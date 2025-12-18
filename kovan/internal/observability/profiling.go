package observability

import (
	"net/http"
	"net/http/pprof"

	"github.com/go-chi/chi/v5"
	"github.com/rs/zerolog"
)

// SetupProfilingRoutes adds pprof endpoints to the router
func SetupProfilingRoutes(r chi.Router, logger zerolog.Logger) {
	logger.Info().Msg("Setting up profiling endpoints at /debug/pprof/")

	r.Route("/debug/pprof", func(r chi.Router) {
		// Middleware to log profiling access
		r.Use(func(next http.Handler) http.Handler {
			return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
				logger.Info().
					Str("path", r.URL.Path).
					Str("remote_addr", r.RemoteAddr).
					Msg("Profiling endpoint accessed")
				next.ServeHTTP(w, r)
			})
		})

		// Standard pprof endpoints
		r.HandleFunc("/", pprof.Index)
		r.HandleFunc("/cmdline", pprof.Cmdline)
		r.HandleFunc("/profile", pprof.Profile)
		r.HandleFunc("/symbol", pprof.Symbol)
		r.HandleFunc("/trace", pprof.Trace)

		// Specialized pprof endpoints
		r.Handle("/goroutine", pprof.Handler("goroutine"))
		r.Handle("/heap", pprof.Handler("heap"))
		r.Handle("/threadcreate", pprof.Handler("threadcreate"))
		r.Handle("/block", pprof.Handler("block"))
		r.Handle("/mutex", pprof.Handler("mutex"))
		r.Handle("/allocs", pprof.Handler("allocs"))
	})
}

// ProfilingInfo provides information about available profiling endpoints
type ProfilingInfo struct {
	Endpoints []ProfilingEndpoint `json:"endpoints"`
	Usage     ProfilingUsage      `json:"usage"`
}

type ProfilingEndpoint struct {
	Path        string `json:"path"`
	Description string `json:"description"`
	Method      string `json:"method"`
}

type ProfilingUsage struct {
	CPUProfile    string `json:"cpu_profile"`
	HeapProfile   string `json:"heap_profile"`
	GoroutineInfo string `json:"goroutine_info"`
	TraceProfile  string `json:"trace_profile"`
}

// GetProfilingInfo returns information about profiling endpoints
func GetProfilingInfo(baseURL string) ProfilingInfo {
	return ProfilingInfo{
		Endpoints: []ProfilingEndpoint{
			{
				Path:        "/debug/pprof/",
				Description: "Index of available profiles",
				Method:      "GET",
			},
			{
				Path:        "/debug/pprof/profile?seconds=30",
				Description: "CPU profile for specified seconds (default 30)",
				Method:      "GET",
			},
			{
				Path:        "/debug/pprof/heap",
				Description: "Heap memory profile",
				Method:      "GET",
			},
			{
				Path:        "/debug/pprof/goroutine",
				Description: "Goroutine profile",
				Method:      "GET",
			},
			{
				Path:        "/debug/pprof/block",
				Description: "Block contention profile",
				Method:      "GET",
			},
			{
				Path:        "/debug/pprof/mutex",
				Description: "Mutex contention profile",
				Method:      "GET",
			},
			{
				Path:        "/debug/pprof/allocs",
				Description: "Memory allocation profile",
				Method:      "GET",
			},
			{
				Path:        "/debug/pprof/trace?seconds=5",
				Description: "Execution trace for specified seconds (default 5)",
				Method:      "GET",
			},
		},
		Usage: ProfilingUsage{
			CPUProfile:    "curl -o cpu.prof " + baseURL + "/debug/pprof/profile?seconds=30",
			HeapProfile:   "curl -o heap.prof " + baseURL + "/debug/pprof/heap",
			GoroutineInfo: "curl " + baseURL + "/debug/pprof/goroutine?debug=1",
			TraceProfile:  "curl -o trace.out " + baseURL + "/debug/pprof/trace?seconds=5",
		},
	}
}

// SetupMetricsEndpoint adds Prometheus metrics endpoint
func SetupMetricsEndpoint(r chi.Router, logger zerolog.Logger) {
	logger.Info().Msg("Setting up metrics endpoint at /metrics")

	r.Handle("/metrics", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		logger.Debug().
			Str("remote_addr", r.RemoteAddr).
			Msg("Metrics endpoint accessed")
		
		// The Prometheus exporter automatically registers itself with the default HTTP handler
		// We serve the default metrics handler
		http.DefaultServeMux.ServeHTTP(w, r)
	}))
}
