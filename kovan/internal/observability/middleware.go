package observability

import (
	"net/http"
	"strconv"
	"time"

	"github.com/getsentry/sentry-go"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/rs/zerolog"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/trace"
)

// HTTPMetrics holds HTTP-related metrics
type HTTPMetrics struct {
	RequestsTotal    metric.Int64Counter
	RequestDuration  metric.Float64Histogram
	RequestSize      metric.Int64Histogram
	ResponseSize     metric.Int64Histogram
}

// NewHTTPMetrics creates HTTP metrics
func NewHTTPMetrics(meter metric.Meter) (*HTTPMetrics, error) {
	requestsTotal, err := meter.Int64Counter(
		"http_requests_total",
		metric.WithDescription("Total number of HTTP requests"),
	)
	if err != nil {
		return nil, err
	}

	requestDuration, err := meter.Float64Histogram(
		"http_request_duration_seconds",
		metric.WithDescription("HTTP request duration in seconds"),
		metric.WithUnit("s"),
	)
	if err != nil {
		return nil, err
	}

	requestSize, err := meter.Int64Histogram(
		"http_request_size_bytes",
		metric.WithDescription("HTTP request size in bytes"),
		metric.WithUnit("By"),
	)
	if err != nil {
		return nil, err
	}

	responseSize, err := meter.Int64Histogram(
		"http_response_size_bytes",
		metric.WithDescription("HTTP response size in bytes"),
		metric.WithUnit("By"),
	)
	if err != nil {
		return nil, err
	}

	return &HTTPMetrics{
		RequestsTotal:    requestsTotal,
		RequestDuration:  requestDuration,
		RequestSize:      requestSize,
		ResponseSize:     responseSize,
	}, nil
}

// TracingMiddleware returns OpenTelemetry tracing middleware for Chi
func TracingMiddleware(serviceName string) func(http.Handler) http.Handler {
	tracer := otel.Tracer(serviceName)
	
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Extract route pattern from Chi
			routePattern := chi.RouteContext(r.Context()).RoutePattern()
			if routePattern == "" {
				routePattern = r.URL.Path
			}
			
			// Create span name
			spanName := r.Method + " " + routePattern
			
			// Start span
			ctx, span := tracer.Start(r.Context(), spanName)
			defer span.End()
			
			// Set span attributes
			span.SetAttributes(
				attribute.String("http.method", r.Method),
				attribute.String("http.url", r.URL.String()),
				attribute.String("http.route", routePattern),
				attribute.String("http.user_agent", r.UserAgent()),
				attribute.String("http.remote_addr", r.RemoteAddr),
			)
			
			// Create a custom ResponseWriter to capture status code
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)
			
			// Process request
			next.ServeHTTP(ww, r.WithContext(ctx))
			
			// Set response attributes
			span.SetAttributes(
				attribute.Int("http.status_code", ww.Status()),
				attribute.Int("http.response_size", ww.BytesWritten()),
			)
			
			// Set span status based on HTTP status code
			if ww.Status() >= 400 {
				span.SetAttributes(attribute.Bool("error", true))
			}
		})
	}
}

// LoggingMiddleware returns structured logging middleware
func LoggingMiddleware(logger zerolog.Logger, telescopeUI *TelescopeUI) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			// Create a custom ResponseWriter to capture status code and size
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

			// Get trace context if available
			span := trace.SpanFromContext(r.Context())
			traceID := span.SpanContext().TraceID().String()
			spanID := span.SpanContext().SpanID().String()

			// Add request context to logger
			reqLogger := logger.With().
				Str("method", r.Method).
				Str("path", r.URL.Path).
				Str("remote_addr", r.RemoteAddr).
				Str("user_agent", r.UserAgent()).
				Str("trace_id", traceID).
				Str("span_id", spanID).
				Str("request_id", middleware.GetReqID(r.Context())).
				Logger()

			// Log request start
			reqLogger.Info().
				Int64("content_length", r.ContentLength).
				Msg("Request started")

			// Process request
			next.ServeHTTP(ww, r)

			// Calculate duration
			duration := time.Since(start)

			// Log request completion
			logEvent := reqLogger.Info()
			if ww.Status() >= 400 {
				logEvent = reqLogger.Error()
			}

			logEvent.
				Int("status", ww.Status()).
				Dur("duration", duration).
				Int("response_size", ww.BytesWritten()).
				Msg("Request completed")

			// Log to Telescope UI if provided
			if telescopeUI != nil {
				// Get user context
				userID := ""
				tenantID := ""
				if uid := r.Context().Value("user_id"); uid != nil {
					userID = uid.(string)
				}
				if tid := r.Context().Value("tenant_id"); tid != nil {
					tenantID = tid.(string)
				}

				requestLog := RequestLog{
					Timestamp:    start,
					Method:       r.Method,
					Path:         r.URL.Path,
					StatusCode:   ww.Status(),
					Duration:     duration,
					UserAgent:    r.UserAgent(),
					RemoteAddr:   r.RemoteAddr,
					TraceID:      traceID,
					UserID:       userID,
					TenantID:     tenantID,
					RequestSize:  r.ContentLength,
					ResponseSize: ww.BytesWritten(),
				}
				
				if ww.Status() >= 400 {
					requestLog.Error = "HTTP Error"
				}
				
				telescopeUI.LogRequest(requestLog)
			}
		})
	}
}

// MetricsMiddleware returns HTTP metrics middleware
func MetricsMiddleware(metrics *HTTPMetrics) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			// Create a custom ResponseWriter to capture status code and size
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

			// Process request
			next.ServeHTTP(ww, r)

			// Calculate duration
			duration := time.Since(start)

			// Extract route pattern from Chi
			routePattern := chi.RouteContext(r.Context()).RoutePattern()
			if routePattern == "" {
				routePattern = "unknown"
			}

			// Common attributes
			attrs := []attribute.KeyValue{
				attribute.String("method", r.Method),
				attribute.String("route", routePattern),
				attribute.String("status", strconv.Itoa(ww.Status())),
			}

			// Record metrics
			metrics.RequestsTotal.Add(r.Context(), 1, metric.WithAttributes(attrs...))
			metrics.RequestDuration.Record(r.Context(), duration.Seconds(), metric.WithAttributes(attrs...))

			if r.ContentLength > 0 {
				metrics.RequestSize.Record(r.Context(), r.ContentLength, metric.WithAttributes(attrs...))
			}

			if ww.BytesWritten() > 0 {
				metrics.ResponseSize.Record(r.Context(), int64(ww.BytesWritten()), metric.WithAttributes(attrs...))
			}
		})
	}
}

// SentryMiddleware returns Sentry error tracking middleware
func SentryMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Create Sentry hub for this request
			hub := sentry.GetHubFromContext(r.Context())
			if hub == nil {
				hub = sentry.CurrentHub().Clone()
			}

			// Set request context
			hub.Scope().SetRequest(r)

			// Add user context if available (from JWT)
			if userID := r.Context().Value("user_id"); userID != nil {
				hub.Scope().SetUser(sentry.User{
					ID: userID.(string),
				})
			}

			// Add tenant context if available
			if tenantID := r.Context().Value("tenant_id"); tenantID != nil {
				hub.Scope().SetTag("tenant_id", tenantID.(string))
			}

			// Add trace context
			span := trace.SpanFromContext(r.Context())
			if span.SpanContext().IsValid() {
				hub.Scope().SetTag("trace_id", span.SpanContext().TraceID().String())
				hub.Scope().SetTag("span_id", span.SpanContext().SpanID().String())
			}

			// Create new context with hub
			ctx := sentry.SetHubOnContext(r.Context(), hub)
			r = r.WithContext(ctx)

			// Create a custom ResponseWriter to capture panics and errors
			ww := middleware.NewWrapResponseWriter(w, r.ProtoMajor)

			// Handle panics
			defer func() {
				if rvr := recover(); rvr != nil {
					hub.RecoverWithContext(ctx, rvr)
					panic(rvr) // Re-panic to let other middleware handle it
				}
			}()

			// Process request
			next.ServeHTTP(ww, r)

			// Capture 4xx and 5xx errors
			if ww.Status() >= 400 {
				hub.WithScope(func(scope *sentry.Scope) {
					scope.SetLevel(sentry.LevelError)
					hub.CaptureMessage("HTTP Error: " + strconv.Itoa(ww.Status()))
				})
			}
		})
	}
}

// TenantContextMiddleware adds tenant information to observability context
func TenantContextMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Get current span
			span := trace.SpanFromContext(r.Context())

			// Add tenant information to span if available
			if tenantID := r.Context().Value("tenant_id"); tenantID != nil {
				span.SetAttributes(attribute.String("tenant.id", tenantID.(string)))
			}

			if userType := r.Context().Value("user_type"); userType != nil {
				span.SetAttributes(attribute.String("user.type", userType.(string)))
			}

			if userID := r.Context().Value("user_id"); userID != nil {
				span.SetAttributes(attribute.String("user.id", userID.(string)))
			}

			next.ServeHTTP(w, r)
		})
	}
}

// HealthCheckFilter excludes health check endpoints from tracing and metrics
func HealthCheckFilter(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip observability for health check endpoints
		if r.URL.Path == "/health" || r.URL.Path == "/metrics" || r.URL.Path == "/debug/pprof" {
			next.ServeHTTP(w, r)
			return
		}

		next.ServeHTTP(w, r)
	})
}
