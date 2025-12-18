package models

import (
	"time"
	"github.com/google/uuid"
)

// Player represents a player in the game
type Player struct {
	ID        string    `json:"id"`
	Nickname  string    `json:"nickname"`
	Position  Vector2D  `json:"position"`
	Velocity  Vector2D  `json:"velocity"`
	Health    int       `json:"health"`
	Item      *Item     `json:"item,omitempty"`
	State     PlayerState `json:"state"`
	IsBot     bool      `json:"is_bot"`
	Kills     int       `json:"kills"`
	Deaths    int       `json:"deaths"`
	Score     int       `json:"score"`
	LastInput int64     `json:"last_input"`
}

// Vector2D represents a 2D vector
type Vector2D struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// Item represents an item in the game
type Item struct {
	ID        string    `json:"id"`
	Type      ItemType  `json:"type"`
	Position  Vector2D  `json:"position"`
	UsesLeft  int       `json:"uses_left"`
	MaxUses   int       `json:"max_uses"`
	Range     float64   `json:"range"`
	Damage    int       `json:"damage"`
	Knockback float64   `json:"knockback"`
	Effect    ItemEffect `json:"effect"`
	EffectDuration int  `json:"effect_duration"`
}

// ItemType represents different types of items
type ItemType string

const (
	ItemTypeTerlik      ItemType = "TERLIK"
	ItemTypeCay         ItemType = "CAY"
	ItemTypeKarpuz      ItemType = "KARPUZ"
	ItemTypeSelfieStick ItemType = "SELFIE_STICK"
	ItemTypeEmojiBomb   ItemType = "EMOJI_BOMB"
	ItemTypeDoner       ItemType = "DONER"
)

// ItemEffect represents effects that items can have
type ItemEffect string

const (
	EffectNone  ItemEffect = "NONE"
	EffectStun  ItemEffect = "STUN"
	EffectSlow  ItemEffect = "SLOW"
	EffectBlind ItemEffect = "BLIND"
)

// PlayerState represents the current state of a player
type PlayerState string

const (
	PlayerStateAlive   PlayerState = "alive"
	PlayerStateStunned PlayerState = "stunned"
	PlayerStateSlowed  PlayerState = "slowed"
	PlayerStateBlinded PlayerState = "blinded"
	PlayerStateDead    PlayerState = "dead"
)

// Room represents a game room
type Room struct {
	ID          string      `json:"id"`
	Code        string      `json:"code"`
	Status      RoomStatus  `json:"status"`
	Players     map[string]*Player `json:"players"`
	MaxPlayers  int         `json:"max_players"`
	CreatedAt   time.Time   `json:"created_at"`
	StartedAt   *time.Time  `json:"started_at,omitempty"`
	EndedAt     *time.Time  `json:"ended_at,omitempty"`
	MatchID     *string     `json:"match_id,omitempty"`
	Seed        int64       `json:"seed"`
	Arena       string      `json:"arena"`
	Items       map[string]*Item `json:"items"`
	Tick        int64       `json:"tick"`
	Countdown   int         `json:"countdown"`
	GameTime    int         `json:"game_time"`
}

// RoomStatus represents the status of a room
type RoomStatus string

const (
	RoomStatusWaiting   RoomStatus = "WAITING"
	RoomStatusCountdown RoomStatus = "COUNTDOWN"
	RoomStatusInGame    RoomStatus = "IN_GAME"
	RoomStatusFinished  RoomStatus = "FINISHED"
)

// GameEvent represents an event that occurred in the game
type GameEvent struct {
	ID        string          `json:"id"`
	MatchID   string          `json:"match_id"`
	Tick      int64           `json:"tick"`
	Kind      EventKind       `json:"kind"`
	Payload   map[string]interface{} `json:"payload"`
	Timestamp time.Time       `json:"timestamp"`
}

// EventKind represents different types of game events
type EventKind string

const (
	EventItemSpawn   EventKind = "item_spawn"
	EventItemPick    EventKind = "item_pick"
	EventHit         EventKind = "hit"
	EventKO          EventKind = "ko"
	EventFallOut     EventKind = "fall_out"
	EventMVP         EventKind = "mvp"
)

// Match represents a completed game match
type Match struct {
	ID            string    `json:"id"`
	Mode          string    `json:"mode"`
	StartedAt     time.Time `json:"started_at"`
	EndedAt       time.Time `json:"ended_at"`
	WinnerUserID  *string   `json:"winner_user_id,omitempty"`
	PlayerCount   int       `json:"player_count"`
	Duration      int       `json:"duration"`
	Seed          int64     `json:"seed"`
	Arena         string    `json:"arena"`
}

// MatchPlayer represents a player's performance in a match
type MatchPlayer struct {
	MatchID  string `json:"match_id"`
	UserID   string `json:"user_id"`
	IsBot    bool   `json:"is_bot"`
	Kills    int    `json:"kills"`
	Deaths   int    `json:"deaths"`
	Score    int    `json:"score"`
	Position int    `json:"position"`
}

// User represents a user in the system
type User struct {
	ID        string    `json:"id"`
	Nickname  string    `json:"nickname"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Helper functions
func NewPlayer(nickname string) *Player {
	return &Player{
		ID:       uuid.New().String(),
		Nickname: nickname,
		Position: Vector2D{X: 0, Y: 0},
		Velocity: Vector2D{X: 0, Y: 0},
		Health:   100,
		State:    PlayerStateAlive,
		IsBot:    false,
		Kills:    0,
		Deaths:   0,
		Score:    0,
	}
}

func NewItem(itemType ItemType, position Vector2D) *Item {
	item := &Item{
		ID:       uuid.New().String(),
		Type:     itemType,
		Position: position,
	}

	// Set item properties based on type
	switch itemType {
	case ItemTypeTerlik:
		item.MaxUses = 3
		item.Range = 2.0
		item.Damage = 20
		item.Knockback = 3.0
		item.Effect = EffectStun
		item.EffectDuration = 1500
	case ItemTypeCay:
		item.MaxUses = 2
		item.Range = 1.5
		item.Damage = 15
		item.Knockback = 2.0
		item.Effect = EffectSlow
		item.EffectDuration = 2000
	case ItemTypeKarpuz:
		item.MaxUses = 1
		item.Range = 1.0
		item.Damage = 30
		item.Knockback = 4.0
		item.Effect = EffectNone
		item.EffectDuration = 0
	case ItemTypeSelfieStick:
		item.MaxUses = 2
		item.Range = 2.5
		item.Damage = 10
		item.Knockback = 1.5
		item.Effect = EffectBlind
		item.EffectDuration = 1000
	case ItemTypeEmojiBomb:
		item.MaxUses = 1
		item.Range = 3.0
		item.Damage = 25
		item.Knockback = 3.5
		item.Effect = EffectStun
		item.EffectDuration = 2000
	case ItemTypeDoner:
		item.MaxUses = 2
		item.Range = 1.8
		item.Damage = 18
		item.Knockback = 2.5
		item.Effect = EffectSlow
		item.EffectDuration = 1500
	}

	item.UsesLeft = item.MaxUses
	return item
}
