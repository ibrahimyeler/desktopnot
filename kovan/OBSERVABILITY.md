# 🔍 Kovan Backend Observability

Production-ready observability stack with OpenTelemetry, structured logging, error tracking, and profiling.

## 📊 Overview

Kovan backend includes comprehensive observability features:

- **🔍 Distributed Tracing** - OpenTelemetry traces with custom Chi middleware
- **📈 Metrics** - Prometheus-compatible HTTP and runtime metrics  
- **📋 Structured Logging** - JSON logs with zerolog
- **🚨 Error Tracking** - Sentry integration with context
- **🔧 Profiling** - pprof endpoints for performance analysis
- **🏥 Health Checks** - Service health monitoring

## 🚀 Quick Start

### Environment Variables

```bash
# Copy and configure
cp env.example .env

# Key observability settings
OTEL_SERVICE_NAME=kovan-backend
OTEL_SERVICE_VERSION=1.0.0
OTEL_TRACES_ENABLED=true
OTEL_METRICS_ENABLED=true
SENTRY_DSN=your_sentry_dsn_here
LOG_LEVEL=info
PROFILING_ENABLED=true
```

### Development Setup

```bash
# Start with observability
go run cmd/server/main.go

# View structured logs (JSON format)
# Traces output to stdout in development
# Metrics available at /metrics (when properly configured)
# Profiling at /debug/pprof/
```

### Production Setup

```bash
# Set production environment
ENVIRONMENT=production
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4318
SENTRY_DSN=https://your-sentry-dsn

# Deploy with observability stack
```

## 🔍 Tracing

### Features
- ✅ HTTP request tracing with Chi routes
- ✅ Automatic span creation with route patterns
- ✅ Request/response attributes
- ✅ Error status tracking
- ✅ Tenant and user context propagation

### Trace Attributes
```json
{
  "http.method": "POST",
  "http.route": "/api/v1/vendor/auth/login",
  "http.status_code": 200,
  "http.user_agent": "curl/7.68.0",
  "tenant.id": "vendor_tenant_123",
  "user.id": "vendor_user_123",
  "user.type": "vendor"
}
```

### Usage Example
```bash
# View traces in development (stdout)
curl -X POST http://localhost:8080/api/v1/vendor/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"vendor@example.com","password":"vendor123"}'
```

## 📈 Metrics

### HTTP Metrics
- `http_requests_total` - Total HTTP requests with method/route/status labels
- `http_request_duration_seconds` - Request duration histogram
- `http_request_size_bytes` - Request size histogram
- `http_response_size_bytes` - Response size histogram

### Runtime Metrics
- Go runtime metrics (heap, GC, goroutines)
- CPU and memory usage
- Process statistics

### Accessing Metrics
```bash
# Prometheus-compatible metrics endpoint
curl http://localhost:8080/metrics

# Example metrics output
http_requests_total{method="POST",route="/api/v1/vendor/auth/login",status="200"} 1
http_request_duration_seconds_bucket{method="POST",route="/api/v1/vendor/auth/login",status="200",le="+Inf"} 1
```

## 📋 Structured Logging

### Features
- ✅ JSON-formatted logs
- ✅ Request correlation with trace IDs
- ✅ Request/response logging
- ✅ Error level based on HTTP status
- ✅ Tenant and user context

### Log Format
```json
{
  "level": "info",
  "service": "kovan-backend",
  "version": "1.0.0",
  "environment": "development",
  "time": "2024-01-15T10:30:00Z",
  "method": "POST",
  "path": "/api/v1/vendor/auth/login",
  "status": 200,
  "duration": 150,
  "trace_id": "abc123...",
  "span_id": "def456...",
  "user_id": "vendor_user_123",
  "tenant_id": "vendor_tenant_123",
  "message": "Request completed"
}
```

### Log Levels
- `DEBUG` - Detailed debugging information
- `INFO` - General information (default)
- `WARN` - Warning messages
- `ERROR` - Error conditions
- `FATAL` - Fatal errors (application exits)

## 🚨 Error Tracking

### Sentry Integration
- ✅ Automatic error capture
- ✅ HTTP error tracking (4xx/5xx)
- ✅ Panic recovery and reporting
- ✅ User and tenant context
- ✅ Trace correlation

### Error Context
```json
{
  "user": {
    "id": "vendor_user_123"
  },
  "tags": {
    "tenant_id": "vendor_tenant_123",
    "trace_id": "abc123...",
    "environment": "production"
  },
  "request": {
    "method": "POST",
    "url": "/api/v1/vendor/auth/login"
  }
}
```

## 🔧 Profiling

### Available Profiles
- **CPU Profile** - `/debug/pprof/profile?seconds=30`
- **Heap Profile** - `/debug/pprof/heap`
- **Goroutine Profile** - `/debug/pprof/goroutine`
- **Block Profile** - `/debug/pprof/block`
- **Mutex Profile** - `/debug/pprof/mutex`
- **Allocation Profile** - `/debug/pprof/allocs`
- **Trace Profile** - `/debug/pprof/trace?seconds=5`

### Usage Examples
```bash
# CPU profiling (30 seconds)
curl -o cpu.prof http://localhost:8080/debug/pprof/profile?seconds=30
go tool pprof cpu.prof

# Memory profiling
curl -o heap.prof http://localhost:8080/debug/pprof/heap
go tool pprof heap.prof

# Goroutine analysis
curl http://localhost:8080/debug/pprof/goroutine?debug=1

# Execution trace
curl -o trace.out http://localhost:8080/debug/pprof/trace?seconds=5
go tool trace trace.out
```

## 🏥 Health Monitoring

### Health Check
```bash
curl http://localhost:8080/health
# Response: "Kovan Backend is healthy"
```

### System Information
- Service name, version, environment
- Uptime and resource usage
- Database connection status (future)
- External service health (future)

## 🎯 Production Deployment

### Recommended Stack

#### OpenTelemetry Collector
```yaml
# otel-collector.yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:

exporters:
  # Traces to Jaeger/Tempo
  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true
  
  # Metrics to Prometheus
  prometheus:
    endpoint: "0.0.0.0:8889"

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [jaeger]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus]
```

#### Docker Compose Example
```yaml
version: '3.8'
services:
  kovan-backend:
    build: .
    environment:
      - OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
      - SENTRY_DSN=https://your-sentry-dsn
      - ENVIRONMENT=production
    depends_on:
      - otel-collector
      - postgres
      - redis

  otel-collector:
    image: otel/opentelemetry-collector-contrib:latest
    command: ["--config=/etc/otel-collector.yaml"]
    volumes:
      - ./otel-collector.yaml:/etc/otel-collector.yaml
    ports:
      - "4317:4317"   # OTLP gRPC receiver
      - "4318:4318"   # OTLP HTTP receiver
      - "8889:8889"   # Prometheus metrics

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686" # Jaeger UI
      - "14250:14250" # Jaeger gRPC

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

### Monitoring Dashboards

#### Grafana Dashboard
```json
{
  "dashboard": {
    "title": "Kovan Backend Observability",
    "panels": [
      {
        "title": "HTTP Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "HTTP Response Time",
        "type": "graph", 
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      }
    ]
  }
}
```

## 🔧 Configuration

### Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `OTEL_SERVICE_NAME` | `kovan-backend` | Service name for tracing |
| `OTEL_SERVICE_VERSION` | `1.0.0` | Service version |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | - | OTLP collector endpoint |
| `OTEL_TRACES_ENABLED` | `true` | Enable distributed tracing |
| `OTEL_METRICS_ENABLED` | `true` | Enable metrics collection |
| `SENTRY_DSN` | - | Sentry error tracking DSN |
| `LOG_LEVEL` | `info` | Logging level (debug/info/warn/error) |
| `PROFILING_ENABLED` | `true` | Enable pprof endpoints |
| `ENVIRONMENT` | `development` | Deployment environment |

### Sampling Configuration

```go
// Trace sampling (10% in production)
sdktrace.WithSampler(sdktrace.TraceIDRatioBased(0.1))

// Sentry sampling (10% of traces)
TracesSampleRate: 0.1
```

## 🚀 Best Practices

### Development
1. Use `LOG_LEVEL=debug` for detailed debugging
2. Monitor traces in stdout output
3. Profile performance bottlenecks with pprof
4. Test error scenarios with Sentry

### Production
1. Use centralized log aggregation (ELK/Loki)
2. Set up alerting on error rates and latency
3. Monitor resource usage and scaling metrics
4. Implement SLI/SLO dashboards
5. Regular profiling for performance optimization

### Security
1. Restrict pprof endpoints to internal networks
2. Use authentication for observability endpoints
3. Sanitize sensitive data in logs and traces
4. Configure proper retention policies

## 🔍 Troubleshooting

### Common Issues

#### Traces Not Appearing
```bash
# Check OTLP endpoint
curl http://localhost:4318/v1/traces

# Verify collector configuration
docker logs otel-collector
```

#### Metrics Missing
```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets

# Verify metrics endpoint
curl http://localhost:8080/metrics
```

#### High Memory Usage
```bash
# Profile memory usage
curl -o heap.prof http://localhost:8080/debug/pprof/heap
go tool pprof -http=:8081 heap.prof
```

### Debug Commands
```bash
# Check service health
curl http://localhost:8080/health

# View profiling index
curl http://localhost:8080/debug/pprof/

# Check goroutines
curl http://localhost:8080/debug/pprof/goroutine?debug=1

# Test Sentry (trigger error)
curl http://localhost:8080/api/v1/nonexistent
```

## 📚 Additional Resources

- [OpenTelemetry Go Documentation](https://opentelemetry.io/docs/instrumentation/go/)
- [Prometheus Metrics](https://prometheus.io/docs/concepts/metric_types/)
- [Grafana Dashboards](https://grafana.com/docs/grafana/latest/dashboards/)
- [Sentry Go SDK](https://docs.sentry.io/platforms/go/)
- [Go pprof Guide](https://pkg.go.dev/net/http/pprof)

---

🎯 **Production Ready**: This observability stack provides comprehensive monitoring, alerting, and debugging capabilities for the Kovan multi-tenant SaaS platform.
