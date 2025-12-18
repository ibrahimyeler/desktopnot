package observability

import (
	"encoding/json"
	"html/template"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/rs/zerolog"
)

// TraceData represents trace information for the UI
type TraceData struct {
	TraceID    string                 `json:"trace_id"`
	SpanID     string                 `json:"span_id"`
	Operation  string                 `json:"operation"`
	StartTime  time.Time              `json:"start_time"`
	Duration   time.Duration          `json:"duration"`
	Status     string                 `json:"status"`
	Tags       map[string]interface{} `json:"tags"`
}

// RequestLog represents a request log entry
type RequestLog struct {
	Timestamp   time.Time              `json:"timestamp"`
	Method      string                 `json:"method"`
	Path        string                 `json:"path"`
	StatusCode  int                    `json:"status_code"`
	Duration    time.Duration          `json:"duration"`
	UserAgent   string                 `json:"user_agent"`
	RemoteAddr  string                 `json:"remote_addr"`
	TraceID     string                 `json:"trace_id"`
	UserID      string                 `json:"user_id"`
	TenantID    string                 `json:"tenant_id"`
	RequestSize int64                  `json:"request_size"`
	ResponseSize int                   `json:"response_size"`
	Error       string                 `json:"error,omitempty"`
}

// TelescopeData holds all observability data for the UI
type TelescopeData struct {
	ServiceInfo ServiceInfo   `json:"service_info"`
	Requests    []RequestLog  `json:"requests"`
	Traces      []TraceData   `json:"traces"`
	Metrics     SystemMetrics `json:"metrics"`
}

// ServiceInfo contains service metadata
type ServiceInfo struct {
	Name        string    `json:"name"`
	Version     string    `json:"version"`
	Environment string    `json:"environment"`
	StartTime   time.Time `json:"start_time"`
	Uptime      string    `json:"uptime"`
}

// SystemMetrics contains system metrics
type SystemMetrics struct {
	TotalRequests   int64   `json:"total_requests"`
	ErrorRate       float64 `json:"error_rate"`
	AvgResponseTime float64 `json:"avg_response_time"`
	ActiveRequests  int     `json:"active_requests"`
}

// TelescopeUI manages the web UI for observability
type TelescopeUI struct {
	logger      zerolog.Logger
	serviceInfo ServiceInfo
	requests    []RequestLog
	traces      []TraceData
	startTime   time.Time
}

// NewTelescopeUI creates a new telescope UI instance
func NewTelescopeUI(logger zerolog.Logger, serviceName, version, environment string) *TelescopeUI {
	startTime := time.Now()
	return &TelescopeUI{
		logger: logger,
		serviceInfo: ServiceInfo{
			Name:        serviceName,
			Version:     version,
			Environment: environment,
			StartTime:   startTime,
		},
		requests:  make([]RequestLog, 0),
		traces:    make([]TraceData, 0),
		startTime: startTime,
	}
}

// SetupTelescopeRoutes adds telescope UI routes
func (t *TelescopeUI) SetupTelescopeRoutes(r chi.Router) {
	t.logger.Info().Msg("Setting up Telescope-like UI at /telescope")

	r.Route("/telescope", func(r chi.Router) {
		// Main telescope dashboard
		r.Get("/", t.dashboardHandler)
		
		// API endpoints for AJAX requests
		r.Get("/api/requests", t.requestsAPIHandler)
		r.Get("/api/traces", t.tracesAPIHandler)
		r.Get("/api/metrics", t.metricsAPIHandler)
		r.Get("/api/service", t.serviceAPIHandler)
		
		// Static assets (if needed)
		r.Get("/assets/*", t.assetsHandler)
	})
}

// dashboardHandler serves the main telescope dashboard
func (t *TelescopeUI) dashboardHandler(w http.ResponseWriter, r *http.Request) {
	tmpl := `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kovan Telescope - Observability Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; }
        .header { background: #2d3748; color: white; padding: 1rem 2rem; }
        .header h1 { font-size: 1.5rem; }
        .header .subtitle { color: #a0aec0; font-size: 0.9rem; }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stat-card h3 { color: #2d3748; font-size: 0.875rem; text-transform: uppercase; margin-bottom: 0.5rem; }
        .stat-card .value { font-size: 2rem; font-weight: bold; color: #3182ce; }
        .tabs { display: flex; background: white; border-radius: 8px 8px 0 0; margin-bottom: 0; }
        .tab { padding: 1rem 2rem; cursor: pointer; border-bottom: 2px solid transparent; }
        .tab.active { border-bottom-color: #3182ce; background: #ebf8ff; }
        .content { background: white; border-radius: 0 0 8px 8px; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .table { width: 100%; border-collapse: collapse; }
        .table th, .table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .table th { background: #f7fafc; font-weight: 600; }
        .status-200 { color: #38a169; }
        .status-400 { color: #d69e2e; }
        .status-500 { color: #e53e3e; }
        .trace-id { font-family: monospace; font-size: 0.8rem; color: #718096; }
        .refresh-btn { background: #3182ce; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; float: right; margin-bottom: 1rem; }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔭 Kovan Telescope</h1>
        <div class="subtitle">Real-time observability dashboard</div>
    </div>

    <div class="container">
        <div class="stats-grid" id="stats-grid">
            <div class="stat-card">
                <h3>Total Requests</h3>
                <div class="value" id="total-requests">0</div>
            </div>
            <div class="stat-card">
                <h3>Error Rate</h3>
                <div class="value" id="error-rate">0%</div>
            </div>
            <div class="stat-card">
                <h3>Avg Response Time</h3>
                <div class="value" id="avg-response-time">0ms</div>
            </div>
            <div class="stat-card">
                <h3>Uptime</h3>
                <div class="value" id="uptime">0s</div>
            </div>
        </div>

        <button class="refresh-btn" onclick="refreshData()">🔄 Refresh</button>

        <div class="tabs">
            <div class="tab active" onclick="showTab('requests')">📋 Requests</div>
            <div class="tab" onclick="showTab('traces')">🔍 Traces</div>
            <div class="tab" onclick="showTab('metrics')">📊 Metrics</div>
        </div>

        <div class="content">
            <div id="requests-content">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Method</th>
                            <th>Path</th>
                            <th>Status</th>
                            <th>Duration</th>
                            <th>Trace ID</th>
                            <th>User</th>
                        </tr>
                    </thead>
                    <tbody id="requests-tbody">
                        <tr><td colspan="7">Loading...</td></tr>
                    </tbody>
                </table>
            </div>

            <div id="traces-content" class="hidden">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Trace ID</th>
                            <th>Operation</th>
                            <th>Start Time</th>
                            <th>Duration</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="traces-tbody">
                        <tr><td colspan="5">Loading...</td></tr>
                    </tbody>
                </table>
            </div>

            <div id="metrics-content" class="hidden">
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Service</h3>
                        <div class="value" id="service-name">{{.Name}}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Version</h3>
                        <div class="value" id="service-version">{{.Version}}</div>
                    </div>
                    <div class="stat-card">
                        <h3>Environment</h3>
                        <div class="value" id="service-env">{{.Environment}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function showTab(tabName) {
            // Hide all content
            document.querySelectorAll('[id$="-content"]').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
            
            // Show selected content
            document.getElementById(tabName + '-content').classList.remove('hidden');
            event.target.classList.add('active');
        }

        function refreshData() {
            loadRequests();
            loadTraces();
            loadMetrics();
            loadServiceInfo();
        }

        function loadRequests() {
            fetch('/telescope/api/requests')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('requests-tbody');
                    tbody.innerHTML = data.map(req => 
                        '<tr>' +
                        '<td>' + new Date(req.timestamp).toLocaleTimeString() + '</td>' +
                        '<td>' + req.method + '</td>' +
                        '<td>' + req.path + '</td>' +
                        '<td><span class="status-' + Math.floor(req.status_code/100) + '00">' + req.status_code + '</span></td>' +
                        '<td>' + Math.round(req.duration/1000000) + 'ms</td>' +
                        '<td class="trace-id">' + (req.trace_id || '-') + '</td>' +
                        '<td>' + (req.user_id || '-') + '</td>' +
                        '</tr>'
                    ).join('');
                })
                .catch(err => console.error('Error loading requests:', err));
        }

        function loadTraces() {
            fetch('/telescope/api/traces')
                .then(response => response.json())
                .then(data => {
                    const tbody = document.getElementById('traces-tbody');
                    tbody.innerHTML = data.map(trace => 
                        '<tr>' +
                        '<td class="trace-id">' + trace.trace_id + '</td>' +
                        '<td>' + trace.operation + '</td>' +
                        '<td>' + new Date(trace.start_time).toLocaleTimeString() + '</td>' +
                        '<td>' + Math.round(trace.duration/1000000) + 'ms</td>' +
                        '<td>' + trace.status + '</td>' +
                        '</tr>'
                    ).join('');
                })
                .catch(err => console.error('Error loading traces:', err));
        }

        function loadMetrics() {
            fetch('/telescope/api/metrics')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('total-requests').textContent = data.total_requests || 0;
                    document.getElementById('error-rate').textContent = (data.error_rate || 0).toFixed(1) + '%';
                    document.getElementById('avg-response-time').textContent = Math.round(data.avg_response_time || 0) + 'ms';
                })
                .catch(err => console.error('Error loading metrics:', err));
        }

        function loadServiceInfo() {
            fetch('/telescope/api/service')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('uptime').textContent = data.uptime;
                })
                .catch(err => console.error('Error loading service info:', err));
        }

        // Auto-refresh every 5 seconds
        setInterval(refreshData, 5000);
        
        // Initial load
        refreshData();
    </script>
</body>
</html>
`

	// Parse template with service info
	t.serviceInfo.Uptime = time.Since(t.startTime).Truncate(time.Second).String()
	
	tmplParsed, err := template.New("telescope").Parse(tmpl)
	if err != nil {
		http.Error(w, "Template error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "text/html")
	tmplParsed.Execute(w, t.serviceInfo)
}

// API handlers for AJAX requests
func (t *TelescopeUI) requestsAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Return last 50 requests
	requests := t.requests
	if len(requests) > 50 {
		requests = requests[len(requests)-50:]
	}
	
	json.NewEncoder(w).Encode(requests)
}

func (t *TelescopeUI) tracesAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Return last 50 traces
	traces := t.traces
	if len(traces) > 50 {
		traces = traces[len(traces)-50:]
	}
	
	json.NewEncoder(w).Encode(traces)
}

func (t *TelescopeUI) metricsAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	// Calculate metrics from stored requests
	totalRequests := int64(len(t.requests))
	errorCount := int64(0)
	totalDuration := time.Duration(0)
	
	for _, req := range t.requests {
		if req.StatusCode >= 400 {
			errorCount++
		}
		totalDuration += req.Duration
	}
	
	errorRate := float64(0)
	avgResponseTime := float64(0)
	
	if totalRequests > 0 {
		errorRate = float64(errorCount) / float64(totalRequests) * 100
		avgResponseTime = float64(totalDuration.Nanoseconds()) / float64(totalRequests) / 1000000 // Convert to ms
	}
	
	metrics := SystemMetrics{
		TotalRequests:   totalRequests,
		ErrorRate:       errorRate,
		AvgResponseTime: avgResponseTime,
		ActiveRequests:  0, // TODO: implement active request tracking
	}
	
	json.NewEncoder(w).Encode(metrics)
}

func (t *TelescopeUI) serviceAPIHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	t.serviceInfo.Uptime = time.Since(t.startTime).Truncate(time.Second).String()
	json.NewEncoder(w).Encode(t.serviceInfo)
}

func (t *TelescopeUI) assetsHandler(w http.ResponseWriter, r *http.Request) {
	// Serve static assets if needed
	http.NotFound(w, r)
}

// LogRequest adds a request to the telescope UI data
func (t *TelescopeUI) LogRequest(req RequestLog) {
	t.requests = append(t.requests, req)
	
	// Keep only last 1000 requests to prevent memory issues
	if len(t.requests) > 1000 {
		t.requests = t.requests[len(t.requests)-1000:]
	}
}

// LogTrace adds a trace to the telescope UI data
func (t *TelescopeUI) LogTrace(trace TraceData) {
	t.traces = append(t.traces, trace)
	
	// Keep only last 1000 traces
	if len(t.traces) > 1000 {
		t.traces = t.traces[len(t.traces)-1000:]
	}
}
