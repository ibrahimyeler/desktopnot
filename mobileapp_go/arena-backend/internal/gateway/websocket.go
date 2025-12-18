package gateway

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"arena-backend/internal/lobby"
	"arena-backend/internal/match"
	"arena-backend/internal/models"
	"arena-backend/internal/util"

	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

const (
	// Time allowed to write a message to the peer
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer
	maxMessageSize = 512
)

// WebSocketClient represents a WebSocket client connection
type WebSocketClient struct {
	conn         *websocket.Conn
	lobbyService *lobby.Service
	matchService *match.Service
	config       *util.Config
	
	// Client state
	playerID string
	roomID   string
	nickname string
	
	// Communication channels
	send chan []byte
	
	// Mutex for thread safety
	mu sync.Mutex
}

// NewWebSocketClient creates a new WebSocket client
func NewWebSocketClient(conn *websocket.Conn, lobbyService *lobby.Service, matchService *match.Service, config *util.Config) *WebSocketClient {
	return &WebSocketClient{
		conn:         conn,
		lobbyService: lobbyService,
		matchService: matchService,
		config:       config,
		send:         make(chan []byte, 256),
	}
}

// Handle handles the WebSocket connection
func (c *WebSocketClient) Handle() {
	defer func() {
		c.cleanup()
	}()

	// Set connection parameters
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	})

	// Start ping ticker
	ticker := time.NewTicker(pingPeriod)
	defer ticker.Stop()

	// Start read and write goroutines
	go c.readPump()
	go c.writePump()

	// Handle ping ticker
	for {
		select {
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// readPump pumps messages from the WebSocket connection
func (c *WebSocketClient) readPump() {
	defer func() {
		c.cleanup()
	}()

	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				logrus.Errorf("WebSocket read error: %v", err)
			}
			break
		}

		c.handleMessage(message)
	}
}

// writePump pumps messages to the WebSocket connection
func (c *WebSocketClient) writePump() {
	defer func() {
		c.cleanup()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}

			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}
		}
	}
}

// handleMessage handles incoming WebSocket messages
func (c *WebSocketClient) handleMessage(message []byte) {
	var msg map[string]interface{}
	if err := json.Unmarshal(message, &msg); err != nil {
		c.sendError("INVALID_JSON", "Invalid JSON format")
		return
	}

	msgType, ok := msg["t"].(string)
	if !ok {
		c.sendError("INVALID_MESSAGE", "Missing message type")
		return
	}

	switch msgType {
	case "JOIN_ROOM":
		c.handleJoinRoom(msg)
	case "READY":
		c.handleReady()
	case "INPUT":
		c.handleInput(msg)
	case "PICKUP":
		c.handlePickup(msg)
	case "USE_ITEM":
		c.handleUseItem(msg)
	case "PING":
		c.handlePing(msg)
	default:
		c.sendError("UNKNOWN_MESSAGE", fmt.Sprintf("Unknown message type: %s", msgType))
	}
}

// handleJoinRoom handles room join requests
func (c *WebSocketClient) handleJoinRoom(msg map[string]interface{}) {
	roomCode, ok := msg["room"].(string)
	if !ok {
		c.sendError("INVALID_ROOM", "Invalid room code")
		return
	}

	nickname, ok := msg["nickname"].(string)
	if !ok {
		c.sendError("INVALID_NICKNAME", "Invalid nickname")
		return
	}

	// Join room
	player, room, err := c.lobbyService.JoinRoom(roomCode, nickname)
	if err != nil {
		c.sendError("JOIN_FAILED", err.Error())
		return
	}

	c.playerID = player.ID
	c.roomID = room.ID
	c.nickname = nickname

	// Send room state
	c.sendRoomState(room, player.ID)
}

// handleReady handles ready requests
func (c *WebSocketClient) handleReady() {
	if c.roomID == "" {
		c.sendError("NOT_IN_ROOM", "Not in a room")
		return
	}

	// Mark player as ready
	err := c.lobbyService.SetPlayerReady(c.roomID, c.playerID)
	if err != nil {
		c.sendError("READY_FAILED", err.Error())
		return
	}

	// Check if game should start
	if c.lobbyService.ShouldStartGame(c.roomID) {
		c.startGame()
	}
}

// handleInput handles player input
func (c *WebSocketClient) handleInput(msg map[string]interface{}) {
	if c.roomID == "" {
		c.sendError("NOT_IN_ROOM", "Not in a room")
		return
	}

	// Process input in match service
	err := c.matchService.ProcessInput(c.roomID, c.playerID, msg)
	if err != nil {
		c.sendError("INPUT_FAILED", err.Error())
		return
	}
}

// handlePickup handles item pickup requests
func (c *WebSocketClient) handlePickup(msg map[string]interface{}) {
	if c.roomID == "" {
		c.sendError("NOT_IN_ROOM", "Not in a room")
		return
	}

	itemID, ok := msg["itemId"].(string)
	if !ok {
		c.sendError("INVALID_ITEM", "Invalid item ID")
		return
	}

	// Process pickup in match service
	err := c.matchService.ProcessPickup(c.roomID, c.playerID, itemID)
	if err != nil {
		c.sendError("PICKUP_FAILED", err.Error())
		return
	}
}

// handleUseItem handles item use requests
func (c *WebSocketClient) handleUseItem(msg map[string]interface{}) {
	if c.roomID == "" {
		c.sendError("NOT_IN_ROOM", "Not in a room")
		return
	}

	targetDir, ok := msg["targetDir"].([]interface{})
	if !ok {
		c.sendError("INVALID_TARGET", "Invalid target direction")
		return
	}

	// Convert to float64 slice
	var dir []float64
	for _, v := range targetDir {
		if f, ok := v.(float64); ok {
			dir = append(dir, f)
		}
	}

	// Process item use in match service
	err := c.matchService.ProcessUseItem(c.roomID, c.playerID, dir)
	if err != nil {
		c.sendError("USE_ITEM_FAILED", err.Error())
		return
	}
}

// handlePing handles ping messages
func (c *WebSocketClient) handlePing(msg map[string]interface{}) {
	n, ok := msg["n"].(float64)
	if !ok {
		c.sendError("INVALID_PING", "Invalid ping number")
		return
	}

	// Send pong response
	pong := models.PongMessage{
		Type: "PONG",
		N:    int64(n),
	}

	c.sendMessage(pong)
}

// sendRoomState sends room state to client
func (c *WebSocketClient) sendRoomState(room *models.Room, playerID string) {
	// Convert items map to slice for JSON
	var items []*models.Item
	for _, item := range room.Items {
		items = append(items, item)
	}

	state := models.RoomStateMessage{
		Type:    "ROOM_STATE",
		Status:  string(room.Status),
		Players: room.Players,
		You:     playerID,
	}

	c.sendMessage(state)
}

// startGame starts the game
func (c *WebSocketClient) startGame() {
	// Start match in match service
	matchID, err := c.matchService.StartMatch(c.roomID)
	if err != nil {
		c.sendError("START_FAILED", err.Error())
		return
	}

	// Send start message
	start := models.StartMessage{
		Type:    "START",
		MatchID: matchID,
		Seed:    time.Now().UnixNano(),
		Arena:   "ring_v1",
	}

	c.sendMessage(start)
}

// sendMessage sends a message to the client
func (c *WebSocketClient) sendMessage(msg interface{}) {
	data, err := json.Marshal(msg)
	if err != nil {
		logrus.Errorf("Failed to marshal message: %v", err)
		return
	}

	select {
	case c.send <- data:
	default:
		logrus.Warn("Client send buffer full, dropping message")
	}
}

// sendError sends an error message to the client
func (c *WebSocketClient) sendError(code, message string) {
	err := models.ErrorMessage{
		Type: "ERR",
		Code: code,
		Msg:  message,
	}

	c.sendMessage(err)
}

// cleanup cleans up the client connection
func (c *WebSocketClient) cleanup() {
	c.mu.Lock()
	defer c.mu.Unlock()

	// Leave room if in one
	if c.roomID != "" {
		c.lobbyService.LeaveRoom(c.roomID, c.playerID)
	}

	// Close connection
	c.conn.Close()

	// Close send channel
	close(c.send)
}
