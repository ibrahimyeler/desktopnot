package models

import "time"

// ClientMessage represents messages sent from client to server
type ClientMessage struct {
	Type string `json:"t"`
	Data interface{} `json:"data,omitempty"`
}

// ServerMessage represents messages sent from server to client
type ServerMessage struct {
	Type string `json:"t"`
	Data interface{} `json:"data,omitempty"`
}

// JoinRoomMessage represents a client joining a room
type JoinRoomMessage struct {
	Type      string `json:"t"`
	RoomCode  string `json:"room"`
	Nickname  string `json:"nickname"`
}

// ReadyMessage represents a client readying up
type ReadyMessage struct {
	Type string `json:"t"`
}

// InputMessage represents player input
type InputMessage struct {
	Type string `json:"t"`
	Seq  int64  `json:"seq"`
	Move []float64 `json:"move"`
	Aim  []float64 `json:"aim"`
	Act  ActionData `json:"act"`
}

// ActionData represents action data
type ActionData struct {
	Use bool `json:"use"`
}

// PickupMessage represents picking up an item
type PickupMessage struct {
	Type   string `json:"t"`
	ItemID string `json:"itemId"`
}

// UseItemMessage represents using an item
type UseItemMessage struct {
	Type      string    `json:"t"`
	TargetDir []float64 `json:"targetDir"`
}

// PingMessage represents a ping message
type PingMessage struct {
	Type string `json:"t"`
	N    int64  `json:"n"`
}

// RoomStateMessage represents room state update
type RoomStateMessage struct {
	Type    string            `json:"t"`
	Status  string            `json:"status"`
	Players map[string]*Player `json:"players"`
	You     string            `json:"you"`
}

// CountdownMessage represents countdown update
type CountdownMessage struct {
	Type string `json:"t"`
	S    int    `json:"s"`
}

// StartMessage represents game start
type StartMessage struct {
	Type     string `json:"t"`
	MatchID  string `json:"matchId"`
	Seed     int64  `json:"seed"`
	Arena    string `json:"arena"`
}

// SnapshotMessage represents game state snapshot
type SnapshotMessage struct {
	Type    int64                    `json:"t"`
	Tick    int64                    `json:"tick"`
	Players map[string]*Player       `json:"players"`
	Items   []*Item                  `json:"items"`
	Events  []map[string]interface{} `json:"events"`
}

// PickupOKMessage represents successful item pickup
type PickupOKMessage struct {
	Type      string `json:"t"`
	ItemID    string `json:"itemId"`
	Item      string `json:"item"`
	UsesLeft  int    `json:"usesLeft"`
}

// HitMessage represents a hit event
type HitMessage struct {
	Type   string    `json:"t"`
	HitBy  string    `json:"hitBy"`
	Item   string    `json:"item"`
	To     string    `json:"to"`
	Knock  []float64 `json:"knock"`
	Effect string    `json:"effect"`
	DurMs  int       `json:"durMs"`
}

// KOMessage represents a KO event
type KOMessage struct {
	Type string `json:"t"`
	Who  string `json:"who"`
	By   string `json:"by"`
}

// EndMessage represents game end
type EndMessage struct {
	Type   string        `json:"t"`
	Winner string        `json:"winner"`
	Scores []PlayerScore `json:"scores"`
}

// PlayerScore represents player score at end
type PlayerScore struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Score int    `json:"score"`
	Kills int    `json:"kills"`
	Deaths int   `json:"deaths"`
}

// PongMessage represents pong response
type PongMessage struct {
	Type string `json:"t"`
	N    int64  `json:"n"`
}

// ErrorMessage represents an error
type ErrorMessage struct {
	Type string `json:"t"`
	Code string `json:"code"`
	Msg  string `json:"msg"`
}

// REST API Models

// CreateRoomRequest represents room creation request
type CreateRoomRequest struct {
	Region     string `json:"region,omitempty"`
	MaxPlayers int    `json:"maxPlayers,omitempty"`
}

// CreateRoomResponse represents room creation response
type CreateRoomResponse struct {
	RoomCode string `json:"roomCode"`
}

// RoomInfoResponse represents room information
type RoomInfoResponse struct {
	Code       string `json:"code"`
	Status     string `json:"status"`
	PlayerCount int   `json:"playerCount"`
	MaxPlayers int   `json:"maxPlayers"`
	PingEndpoint string `json:"pingEndpoint"`
}

// LeaderboardEntry represents a leaderboard entry
type LeaderboardEntry struct {
	UserID   string `json:"userId"`
	Nickname string `json:"nickname"`
	Score    int    `json:"score"`
	Kills    int    `json:"kills"`
	Deaths   int    `json:"deaths"`
	Matches  int    `json:"matches"`
	Position int    `json:"position"`
}

// LeaderboardResponse represents leaderboard response
type LeaderboardResponse struct {
	Period  string             `json:"period"`
	Entries []LeaderboardEntry `json:"entries"`
}

// HealthResponse represents health check response
type HealthResponse struct {
	Status    string `json:"status"`
	Timestamp string `json:"timestamp"`
	Version   string `json:"version"`
}

// UserStatsResponse represents user statistics response
type UserStatsResponse struct {
	UserID      string    `json:"userId"`
	Nickname    string    `json:"nickname"`
	CreatedAt   time.Time `json:"createdAt"`
	TotalScore  int       `json:"totalScore"`
	TotalKills  int       `json:"totalKills"`
	TotalDeaths int       `json:"totalDeaths"`
	TotalMatches int      `json:"totalMatches"`
	WinRate     float64   `json:"winRate"`
	KDRatio     float64   `json:"kdRatio"`
}

// ActiveRoomsResponse represents active rooms list response
type ActiveRoomsResponse struct {
	Rooms []RoomInfo `json:"rooms"`
	Total int        `json:"total"`
}

// RoomInfo represents basic room information
type RoomInfo struct {
	Code        string `json:"code"`
	Status      string `json:"status"`
	PlayerCount int    `json:"playerCount"`
	MaxPlayers  int    `json:"maxPlayers"`
	CreatedAt   string `json:"createdAt"`
}

// MatchHistoryResponse represents match history response
type MatchHistoryResponse struct {
	Matches []MatchInfo `json:"matches"`
	Total   int         `json:"total"`
	Page    int         `json:"page"`
	Limit   int         `json:"limit"`
}

// MatchInfo represents basic match information
type MatchInfo struct {
	ID          string    `json:"id"`
	Mode        string    `json:"mode"`
	StartedAt   time.Time `json:"startedAt"`
	EndedAt     time.Time `json:"endedAt"`
	Duration    int       `json:"duration"`
	PlayerCount int       `json:"playerCount"`
	Winner      string    `json:"winner,omitempty"`
	Arena       string    `json:"arena"`
}

// CreateUserRequest represents user creation request
type CreateUserRequest struct {
	Nickname string `json:"nickname"`
}

// CreateUserResponse represents user creation response
type CreateUserResponse struct {
	UserID   string    `json:"userId"`
	Nickname string    `json:"nickname"`
	CreatedAt time.Time `json:"createdAt"`
}
