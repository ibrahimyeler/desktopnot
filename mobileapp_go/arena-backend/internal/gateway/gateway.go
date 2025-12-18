package gateway

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"arena-backend/internal/lobby"
	"arena-backend/internal/match"
	"arena-backend/internal/models"
	"arena-backend/internal/util"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/sirupsen/logrus"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		// Allow all connections for now
		return true
	},
}

// Gateway handles HTTP and WebSocket connections
type Gateway struct {
	lobbyService *lobby.Service
	matchService *match.Service
	config       *util.Config
	router       *mux.Router
}

// NewGateway creates a new gateway
func NewGateway(lobbyService *lobby.Service, matchService *match.Service, config *util.Config) *Gateway {
	g := &Gateway{
		lobbyService: lobbyService,
		matchService: matchService,
		config:       config,
		router:       mux.NewRouter(),
	}

	g.setupRoutes()
	return g
}

// Router returns the HTTP router
func (g *Gateway) Router() http.Handler {
	// Setup CORS
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"}, // In production, specify actual origins
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},
	})

	return c.Handler(g.router)
}

// setupRoutes sets up all HTTP routes
func (g *Gateway) setupRoutes() {
	// Health check
	g.router.HandleFunc("/healthz", g.handleHealthCheck).Methods("GET")

	// REST API routes
	api := g.router.PathPrefix("/api/v1").Subrouter()
	
	// Room management
	api.HandleFunc("/rooms", g.handleCreateRoom).Methods("POST")
	api.HandleFunc("/rooms", g.handleGetActiveRooms).Methods("GET")
	api.HandleFunc("/rooms/{code}", g.handleGetRoom).Methods("GET")
	api.HandleFunc("/rooms/{code}", g.handleDeleteRoom).Methods("DELETE")
	
	// User management
	api.HandleFunc("/users", g.handleCreateUser).Methods("POST")
	api.HandleFunc("/users/{id}/stats", g.handleGetUserStats).Methods("GET")
	
	// Match management
	api.HandleFunc("/matches", g.handleGetMatchHistory).Methods("GET")
	
	// Leaderboard
	api.HandleFunc("/leaderboard", g.handleGetLeaderboard).Methods("GET")
	
	// WebSocket upgrade
	g.router.HandleFunc("/ws", g.handleWebSocketUpgrade)
}

// handleHealthCheck handles health check requests
func (g *Gateway) handleHealthCheck(w http.ResponseWriter, r *http.Request) {
	response := models.HealthResponse{
		Status:    "healthy",
		Timestamp: strconv.FormatInt(time.Now().Unix(), 10),
		Version:   "1.0.0",
	}

	g.sendJSONResponse(w, http.StatusOK, response)
}

// handleCreateRoom handles room creation requests
func (g *Gateway) handleCreateRoom(w http.ResponseWriter, r *http.Request) {
	var req models.CreateRoomRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		g.sendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Set defaults
	if req.MaxPlayers == 0 {
		req.MaxPlayers = g.config.Game.MaxPlayersPerRoom
	}

	roomCode, err := g.lobbyService.CreateRoom(req.MaxPlayers)
	if err != nil {
		logrus.Errorf("Failed to create room: %v", err)
		g.sendErrorResponse(w, http.StatusInternalServerError, "Failed to create room")
		return
	}

	response := models.CreateRoomResponse{
		RoomCode: roomCode,
	}

	g.sendJSONResponse(w, http.StatusCreated, response)
}

// handleGetActiveRooms handles active rooms list requests
func (g *Gateway) handleGetActiveRooms(w http.ResponseWriter, r *http.Request) {
	rooms, err := g.lobbyService.GetActiveRooms()
	if err != nil {
		logrus.Errorf("Failed to get active rooms: %v", err)
		g.sendErrorResponse(w, http.StatusInternalServerError, "Failed to get active rooms")
		return
	}

	response := models.ActiveRoomsResponse{
		Rooms: rooms,
		Total: len(rooms),
	}

	g.sendJSONResponse(w, http.StatusOK, response)
}

// handleGetMatchHistory handles match history requests
func (g *Gateway) handleGetMatchHistory(w http.ResponseWriter, r *http.Request) {
	// Parse query parameters
	page := 1
	if pageStr := r.URL.Query().Get("page"); pageStr != "" {
		if p, err := strconv.Atoi(pageStr); err == nil && p > 0 {
			page = p
		}
	}

	limit := 20 // Default limit
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
			limit = l
		}
	}

	matches, total, err := g.lobbyService.GetMatchHistory(page, limit)
	if err != nil {
		logrus.Errorf("Failed to get match history: %v", err)
		g.sendErrorResponse(w, http.StatusInternalServerError, "Failed to get match history")
		return
	}

	response := models.MatchHistoryResponse{
		Matches: matches,
		Total:   total,
		Page:    page,
		Limit:   limit,
	}

	g.sendJSONResponse(w, http.StatusOK, response)
}

// handleCreateUser handles user creation requests
func (g *Gateway) handleCreateUser(w http.ResponseWriter, r *http.Request) {
	var req models.CreateUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		g.sendErrorResponse(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	// Validate nickname
	if req.Nickname == "" || len(req.Nickname) > 50 {
		g.sendErrorResponse(w, http.StatusBadRequest, "Invalid nickname")
		return
	}

	user, err := g.lobbyService.CreateUser(req.Nickname)
	if err != nil {
		logrus.Errorf("Failed to create user: %v", err)
		g.sendErrorResponse(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	response := models.CreateUserResponse{
		UserID:    user.ID,
		Nickname:  user.Nickname,
		CreatedAt: user.CreatedAt,
	}

	g.sendJSONResponse(w, http.StatusCreated, response)
}

// handleDeleteRoom handles room deletion requests
func (g *Gateway) handleDeleteRoom(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	roomCode := vars["code"]

	err := g.lobbyService.DeleteRoom(roomCode)
	if err != nil {
		logrus.Errorf("Failed to delete room: %v", err)
		g.sendErrorResponse(w, http.StatusInternalServerError, "Failed to delete room")
		return
	}

	// Return success response
	response := map[string]string{
		"message": "Room deleted successfully",
		"code":    roomCode,
	}

	g.sendJSONResponse(w, http.StatusOK, response)
}

// handleGetRoom handles room information requests
func (g *Gateway) handleGetRoom(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	roomCode := vars["code"]

	room, err := g.lobbyService.GetRoom(roomCode)
	if err != nil {
		logrus.Errorf("Failed to get room: %v", err)
		g.sendErrorResponse(w, http.StatusInternalServerError, "Failed to get room")
		return
	}

	if room == nil {
		g.sendErrorResponse(w, http.StatusNotFound, "Room not found")
		return
	}

	response := models.RoomInfoResponse{
		Code:         room.Code,
		Status:       string(room.Status),
		PlayerCount:  len(room.Players),
		MaxPlayers:   room.MaxPlayers,
		PingEndpoint: "/ws",
	}

	g.sendJSONResponse(w, http.StatusOK, response)
}

// handleGetLeaderboard handles leaderboard requests
func (g *Gateway) handleGetLeaderboard(w http.ResponseWriter, r *http.Request) {
	period := r.URL.Query().Get("period")
	if period == "" {
		period = "week"
	}

	limit := 50 // Default limit
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil && l > 0 && l <= 100 {
			limit = l
		}
	}

	entries, err := g.lobbyService.GetLeaderboard(period, limit)
	if err != nil {
		logrus.Errorf("Failed to get leaderboard: %v", err)
		g.sendErrorResponse(w, http.StatusInternalServerError, "Failed to get leaderboard")
		return
	}

	response := models.LeaderboardResponse{
		Period:  period,
		Entries: entries,
	}

	g.sendJSONResponse(w, http.StatusOK, response)
}

// handleGetUserStats handles user statistics requests
func (g *Gateway) handleGetUserStats(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	userID := vars["id"]

	user, totalScore, totalKills, totalDeaths, totalMatches, err := g.lobbyService.GetUserStats(userID)
	if err != nil {
		logrus.Errorf("Failed to get user stats: %v", err)
		g.sendErrorResponse(w, http.StatusInternalServerError, "Failed to get user stats")
		return
	}

	if user == nil {
		g.sendErrorResponse(w, http.StatusNotFound, "User not found")
		return
	}

	// Calculate win rate and KD ratio
	var winRate, kdRatio float64
	if totalMatches > 0 {
		// For now, we'll use a simple calculation - in a real app you'd track wins
		winRate = float64(totalMatches) / float64(totalMatches) * 100 // Placeholder
	}
	if totalDeaths > 0 {
		kdRatio = float64(totalKills) / float64(totalDeaths)
	} else if totalKills > 0 {
		kdRatio = float64(totalKills) // Perfect KD if no deaths
	}

	response := models.UserStatsResponse{
		UserID:       user.ID,
		Nickname:     user.Nickname,
		CreatedAt:    user.CreatedAt,
		TotalScore:   totalScore,
		TotalKills:   totalKills,
		TotalDeaths:  totalDeaths,
		TotalMatches: totalMatches,
		WinRate:      winRate,
		KDRatio:      kdRatio,
	}

	g.sendJSONResponse(w, http.StatusOK, response)
}

// handleWebSocketUpgrade handles WebSocket upgrade requests
func (g *Gateway) handleWebSocketUpgrade(w http.ResponseWriter, r *http.Request) {
	// Upgrade HTTP connection to WebSocket
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logrus.Errorf("Failed to upgrade connection: %v", err)
		return
	}

	// Create new WebSocket client
	client := NewWebSocketClient(conn, g.lobbyService, g.matchService, g.config)
	
	// Start client handling
	go client.Handle()
}

// sendJSONResponse sends a JSON response
func (g *Gateway) sendJSONResponse(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	
	if err := json.NewEncoder(w).Encode(data); err != nil {
		logrus.Errorf("Failed to encode JSON response: %v", err)
	}
}

// sendErrorResponse sends an error response
func (g *Gateway) sendErrorResponse(w http.ResponseWriter, statusCode int, message string) {
	errorResponse := map[string]string{
		"error": message,
	}
	
	g.sendJSONResponse(w, statusCode, errorResponse)
}
