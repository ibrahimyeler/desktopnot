package observability

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/rs/zerolog"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/exporters/prometheus"
	"go.opentelemetry.io/otel/exporters/stdout/stdouttrace"
	"go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
	"go.opentelemetry.io/otel/trace"
	"go.opentelemetry.io/contrib/instrumentation/runtime"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
)

// Config holds observability configuration
type Config struct {
	ServiceName      string
	ServiceVersion   string
	Environment      string
	OTelEndpoint     string
	SentryDSN        string
	EnableTracing    bool
	EnableMetrics    bool
	EnableProfiling  bool
	LogLevel         string
}

// ObservabilityManager manages all observability components
type ObservabilityManager struct {
	config        *Config
	logger        zerolog.Logger
	tracer        trace.Tracer
	meter         metric.Meter
	tracerProvider *sdktrace.TracerProvider
	meterProvider  *sdkmetric.MeterProvider
}

// NewConfig creates a new observability config from environment variables
func NewConfig() *Config {
	return &Config{
		ServiceName:     getEnv("OTEL_SERVICE_NAME", "kovan-backend"),
		ServiceVersion:  getEnv("OTEL_SERVICE_VERSION", "1.0.0"),
		Environment:     getEnv("ENVIRONMENT", "development"),
		OTelEndpoint:    getEnv("OTEL_EXPORTER_OTLP_ENDPOINT", ""),
		SentryDSN:       getEnv("SENTRY_DSN", ""),
		EnableTracing:   getEnv("OTEL_TRACES_ENABLED", "true") == "true",
		EnableMetrics:   getEnv("OTEL_METRICS_ENABLED", "true") == "true",
		EnableProfiling: getEnv("PROFILING_ENABLED", "true") == "true",
		LogLevel:        getEnv("LOG_LEVEL", "info"),
	}
}

// NewObservabilityManager creates and initializes observability components
func NewObservabilityManager(config *Config) (*ObservabilityManager, error) {
	om := &ObservabilityManager{
		config: config,
	}

	// Initialize structured logging
	if err := om.initLogger(); err != nil {
		return nil, fmt.Errorf("failed to initialize logger: %w", err)
	}

	// Initialize Sentry
	if err := om.initSentry(); err != nil {
		om.logger.Error().Err(err).Msg("Failed to initialize Sentry")
	}

	// Initialize OpenTelemetry tracing
	if config.EnableTracing {
		if err := om.initTracing(); err != nil {
			return nil, fmt.Errorf("failed to initialize tracing: %w", err)
		}
	}

	// Initialize OpenTelemetry metrics
	if config.EnableMetrics {
		if err := om.initMetrics(); err != nil {
			return nil, fmt.Errorf("failed to initialize metrics: %w", err)
		}
	}

	// Initialize runtime metrics
	if err := om.initRuntimeMetrics(); err != nil {
		om.logger.Error().Err(err).Msg("Failed to initialize runtime metrics")
	}

	om.logger.Info().
		Str("service", config.ServiceName).
		Str("version", config.ServiceVersion).
		Str("environment", config.Environment).
		Bool("tracing", config.EnableTracing).
		Bool("metrics", config.EnableMetrics).
		Bool("profiling", config.EnableProfiling).
		Msg("Observability initialized")

	return om, nil
}

// initLogger sets up structured logging with zerolog
func (om *ObservabilityManager) initLogger() error {
	// Parse log level
	level, err := zerolog.ParseLevel(om.config.LogLevel)
	if err != nil {
		level = zerolog.InfoLevel
	}

	// Configure zerolog
	zerolog.SetGlobalLevel(level)
	zerolog.TimeFieldFormat = time.RFC3339

	// Create logger with service context
	om.logger = zerolog.New(os.Stdout).With().
		Timestamp().
		Str("service", om.config.ServiceName).
		Str("version", om.config.ServiceVersion).
		Str("environment", om.config.Environment).
		Logger()

	return nil
}

// initSentry sets up error tracking
func (om *ObservabilityManager) initSentry() error {
	if om.config.SentryDSN == "" {
		om.logger.Info().Msg("Sentry DSN not provided, skipping Sentry initialization")
		return nil
	}

	err := sentry.Init(sentry.ClientOptions{
		Dsn:              om.config.SentryDSN,
		Environment:      om.config.Environment,
		Release:          om.config.ServiceVersion,
		TracesSampleRate: 0.1, // 10% of traces
		Debug:            om.config.Environment == "development",
		BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
			// Add service context to all events
			event.Tags["service"] = om.config.ServiceName
			event.Tags["version"] = om.config.ServiceVersion
			return event
		},
	})

	if err != nil {
		return fmt.Errorf("failed to initialize Sentry: %w", err)
	}

	om.logger.Info().Msg("Sentry initialized")
	return nil
}

// initTracing sets up OpenTelemetry tracing
func (om *ObservabilityManager) initTracing() error {
	ctx := context.Background()

	// Create resource with service information
	res, err := resource.New(ctx,
		resource.WithAttributes(
			semconv.ServiceName(om.config.ServiceName),
			semconv.ServiceVersion(om.config.ServiceVersion),
			semconv.DeploymentEnvironment(om.config.Environment),
		),
	)
	if err != nil {
		return fmt.Errorf("failed to create resource: %w", err)
	}

	// Choose exporter based on configuration
	var exporter sdktrace.SpanExporter
	if om.config.OTelEndpoint != "" {
		// Use OTLP exporter for production
		exporter, err = otlptracehttp.New(ctx,
			otlptracehttp.WithEndpoint(om.config.OTelEndpoint),
		)
		if err != nil {
			return fmt.Errorf("failed to create OTLP exporter: %w", err)
		}
		om.logger.Info().Str("endpoint", om.config.OTelEndpoint).Msg("Using OTLP trace exporter")
	} else {
		// Use stdout exporter for development
		exporter, err = stdouttrace.New(stdouttrace.WithPrettyPrint())
		if err != nil {
			return fmt.Errorf("failed to create stdout exporter: %w", err)
		}
		om.logger.Info().Msg("Using stdout trace exporter")
	}

	// Create tracer provider
	om.tracerProvider = sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(res),
		sdktrace.WithSampler(sdktrace.TraceIDRatioBased(0.1)), // 10% sampling
	)

	// Set global tracer provider
	otel.SetTracerProvider(om.tracerProvider)

	// Set global propagator
	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	// Create tracer
	om.tracer = otel.Tracer(om.config.ServiceName)

	return nil
}

// initMetrics sets up OpenTelemetry metrics
func (om *ObservabilityManager) initMetrics() error {
	ctx := context.Background()

	// Create resource
	res, err := resource.New(ctx,
		resource.WithAttributes(
			semconv.ServiceName(om.config.ServiceName),
			semconv.ServiceVersion(om.config.ServiceVersion),
			semconv.DeploymentEnvironment(om.config.Environment),
		),
	)
	if err != nil {
		return fmt.Errorf("failed to create resource: %w", err)
	}

	// Create Prometheus exporter
	prometheusExporter, err := prometheus.New()
	if err != nil {
		return fmt.Errorf("failed to create Prometheus exporter: %w", err)
	}

	// Create meter provider
	om.meterProvider = sdkmetric.NewMeterProvider(
		sdkmetric.WithResource(res),
		sdkmetric.WithReader(prometheusExporter),
	)

	// Set global meter provider
	otel.SetMeterProvider(om.meterProvider)

	// Create meter
	om.meter = otel.Meter(om.config.ServiceName)

	om.logger.Info().Msg("Metrics initialized with Prometheus exporter")
	return nil
}

// initRuntimeMetrics starts collecting Go runtime metrics
func (om *ObservabilityManager) initRuntimeMetrics() error {
	return runtime.Start(runtime.WithMinimumReadMemStatsInterval(time.Second))
}

// GetLogger returns the structured logger
func (om *ObservabilityManager) GetLogger() zerolog.Logger {
	return om.logger
}

// GetTracer returns the OpenTelemetry tracer
func (om *ObservabilityManager) GetTracer() trace.Tracer {
	return om.tracer
}

// GetMeter returns the OpenTelemetry meter
func (om *ObservabilityManager) GetMeter() metric.Meter {
	return om.meter
}

// Shutdown gracefully shuts down all observability components
func (om *ObservabilityManager) Shutdown(ctx context.Context) error {
	var errors []error

	// Flush Sentry
	if !sentry.Flush(2 * time.Second) {
		errors = append(errors, fmt.Errorf("failed to flush Sentry"))
	}

	// Shutdown tracer provider
	if om.tracerProvider != nil {
		if err := om.tracerProvider.Shutdown(ctx); err != nil {
			errors = append(errors, fmt.Errorf("failed to shutdown tracer provider: %w", err))
		}
	}

	// Shutdown meter provider
	if om.meterProvider != nil {
		if err := om.meterProvider.Shutdown(ctx); err != nil {
			errors = append(errors, fmt.Errorf("failed to shutdown meter provider: %w", err))
		}
	}

	if len(errors) > 0 {
		return fmt.Errorf("shutdown errors: %v", errors)
	}

	om.logger.Info().Msg("Observability shutdown completed")
	return nil
}

// getEnv returns environment variable value or default
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
