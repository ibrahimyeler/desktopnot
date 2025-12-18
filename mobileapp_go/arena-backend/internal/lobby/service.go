package lobby

import (
	"fmt"
	"math/rand"
	"sync"
	"time"

	"arena-backend/internal/models"
	"arena-backend/internal/store"
	"arena-backend/internal/util"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

// Service handles lobby operations
type Service struct {
	redisStore  *store.RedisStore
	postgresStore *store.PostgresStore
	config      *util.Config
	rand        *rand.Rand
	mu          sync.RWMutex
}

// NewService creates a new lobby service
func NewService(redisStore *store.RedisStore, postgresStore *store.PostgresStore, config *util.Config) *Service {
	return &Service{
		redisStore:     redisStore,
		postgresStore:  postgresStore,
		config:         config,
		rand:           rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// CreateRoom creates a new room
func (s *Service) CreateRoom(maxPlayers int) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Generate room code
	roomCode := s.generateRoomCode()
	
	// Create room
	room := &models.Room{
		ID:         uuid.New().String(),
		Code:       roomCode,
		Status:     models.RoomStatusWaiting,
		Players:    make(map[string]*models.Player),
		Items:      make(map[string]*models.Item),
		MaxPlayers: maxPlayers,
		CreatedAt:  time.Now(),
		Seed:       time.Now().UnixNano(),
		Arena:      "ring_v1",
	}

	// Save to Redis
	err := s.redisStore.SaveRoom(room)
	if err != nil {
		return "", fmt.Errorf("failed to save room: %w", err)
	}

	// Save room code mapping
	err = s.redisStore.SaveRoomCodeMapping(roomCode, room.ID)
	if err != nil {
		return "", fmt.Errorf("failed to save room code mapping: %w", err)
	}

	logrus.WithFields(logrus.Fields{
		"room_id":   room.ID,
		"room_code": roomCode,
	}).Info("Room created")

	return roomCode, nil
}

// GetRoom gets a room by code
func (s *Service) GetRoom(roomCode string) (*models.Room, error) {
	// Get room ID from code
	roomID, err := s.redisStore.GetRoomIDByCode(roomCode)
	if err != nil {
		return nil, fmt.Errorf("failed to get room ID: %w", err)
	}

	if roomID == "" {
		return nil, nil // Room not found
	}

	// Get room from Redis
	room, err := s.redisStore.GetRoom(roomID)
	if err != nil {
		return nil, fmt.Errorf("failed to get room: %w", err)
	}

	return room, nil
}

// JoinRoom joins a player to a room
func (s *Service) JoinRoom(roomCode, nickname string) (*models.Player, *models.Room, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Get room
	room, err := s.GetRoom(roomCode)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get room: %w", err)
	}

	if room == nil {
		return nil, nil, fmt.Errorf("room not found")
	}

	// Check if room is full
	if len(room.Players) >= room.MaxPlayers {
		return nil, nil, fmt.Errorf("room is full")
	}

	// Check if room is in waiting state
	if room.Status != models.RoomStatusWaiting {
		return nil, nil, fmt.Errorf("room is not accepting players")
	}

	// Check if nickname is already taken
	for _, player := range room.Players {
		if player.Nickname == nickname {
			return nil, nil, fmt.Errorf("nickname already taken")
		}
	}

	// Create player
	player := models.NewPlayer(nickname)
	
	// Get or create user in database
	user, err := s.postgresStore.GetUserByNickname(nickname)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get user: %w", err)
	}

	if user == nil {
		user, err = s.postgresStore.CreateUser(nickname)
		if err != nil {
			return nil, nil, fmt.Errorf("failed to create user: %w", err)
		}
	}

	player.ID = user.ID

	// Add player to room
	room.Players[player.ID] = player

	// Save room
	err = s.redisStore.SaveRoom(room)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to save room: %w", err)
	}

	// Save player session
	err = s.redisStore.SavePlayerSession(player.ID, room.ID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to save player session: %w", err)
	}

	logrus.WithFields(logrus.Fields{
		"room_id":   room.ID,
		"player_id": player.ID,
		"nickname":  nickname,
	}).Info("Player joined room")

	return player, room, nil
}

// LeaveRoom removes a player from a room
func (s *Service) LeaveRoom(roomID, playerID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Get room
	room, err := s.redisStore.GetRoom(roomID)
	if err != nil {
		return fmt.Errorf("failed to get room: %w", err)
	}

	if room == nil {
		return nil // Room doesn't exist
	}

	// Remove player
	delete(room.Players, playerID)

	// If room is empty, delete it
	if len(room.Players) == 0 {
		err = s.redisStore.DeleteRoom(roomID)
		if err != nil {
			return fmt.Errorf("failed to delete room: %w", err)
		}

		err = s.redisStore.DeleteRoomCodeMapping(room.Code)
		if err != nil {
			return fmt.Errorf("failed to delete room code mapping: %w", err)
		}
	} else {
		// Save updated room
		err = s.redisStore.SaveRoom(room)
		if err != nil {
			return fmt.Errorf("failed to save room: %w", err)
		}
	}

	// Delete player session
	err = s.redisStore.DeletePlayerSession(playerID)
	if err != nil {
		return fmt.Errorf("failed to delete player session: %w", err)
	}

	logrus.WithFields(logrus.Fields{
		"room_id":   roomID,
		"player_id": playerID,
	}).Info("Player left room")

	return nil
}

// SetPlayerReady marks a player as ready
func (s *Service) SetPlayerReady(roomID, playerID string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Get room
	room, err := s.redisStore.GetRoom(roomID)
	if err != nil {
		return fmt.Errorf("failed to get room: %w", err)
	}

	if room == nil {
		return fmt.Errorf("room not found")
	}

	// Check if player exists
	player, exists := room.Players[playerID]
	if !exists {
		return fmt.Errorf("player not found")
	}

	// Mark as ready (in a real implementation, you'd have a ready field)
	// For now, we'll just log it
	logrus.WithFields(logrus.Fields{
		"room_id":   roomID,
		"player_id": playerID,
		"nickname":  player.Nickname,
	}).Info("Player ready")

	return nil
}

// ShouldStartGame checks if the game should start
func (s *Service) ShouldStartGame(roomID string) bool {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Get room
	room, err := s.redisStore.GetRoom(roomID)
	if err != nil {
		logrus.Errorf("Failed to get room: %v", err)
		return false
	}

	if room == nil {
		return false
	}

	// Check if we have enough players (minimum 2)
	if len(room.Players) < 2 {
		return false
	}

	// For now, start immediately when we have enough players
	// In a real implementation, you'd check if all players are ready
	return true
}

// GetLeaderboard gets the leaderboard
func (s *Service) GetLeaderboard(period string, limit int) ([]models.LeaderboardEntry, error) {
	return s.postgresStore.GetLeaderboard(period, limit)
}

// GetUserStats gets user statistics
func (s *Service) GetUserStats(userID string) (*models.User, int, int, int, int, error) {
	return s.postgresStore.GetUserStats(userID)
}

// GetActiveRooms gets all active rooms
func (s *Service) GetActiveRooms() ([]models.RoomInfo, error) {
	// Get all room codes from Redis
	roomCodes, err := s.redisStore.GetAllRoomCodes()
	if err != nil {
		return nil, fmt.Errorf("failed to get room codes: %w", err)
	}

	var rooms []models.RoomInfo
	for _, roomCode := range roomCodes {
		room, err := s.GetRoom(roomCode)
		if err != nil {
			logrus.Warnf("Failed to get room %s: %v", roomCode, err)
			continue
		}

		if room != nil {
			roomInfo := models.RoomInfo{
				Code:        room.Code,
				Status:      string(room.Status),
				PlayerCount: len(room.Players),
				MaxPlayers:  room.MaxPlayers,
				CreatedAt:   room.CreatedAt.Format(time.RFC3339),
			}
			rooms = append(rooms, roomInfo)
		}
	}

	return rooms, nil
}

// GetMatchHistory gets match history with pagination
func (s *Service) GetMatchHistory(page, limit int) ([]models.MatchInfo, int, error) {
	return s.postgresStore.GetMatchHistory(page, limit)
}

// CreateUser creates a new user
func (s *Service) CreateUser(nickname string) (*models.User, error) {
	// Check if nickname already exists
	existingUser, err := s.postgresStore.GetUserByNickname(nickname)
	if err != nil {
		return nil, fmt.Errorf("failed to check existing user: %w", err)
	}

	if existingUser != nil {
		return nil, fmt.Errorf("nickname already taken")
	}

	// Create new user
	user, err := s.postgresStore.CreateUser(nickname)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	logrus.WithFields(logrus.Fields{
		"user_id":  user.ID,
		"nickname": user.Nickname,
	}).Info("User created")

	return user, nil
}

// DeleteRoom deletes a room
func (s *Service) DeleteRoom(roomCode string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Get room
	room, err := s.GetRoom(roomCode)
	if err != nil {
		return fmt.Errorf("failed to get room: %w", err)
	}

	if room == nil {
		return fmt.Errorf("room not found")
	}

	// Check if room is in game
	if room.Status == models.RoomStatusInGame {
		return fmt.Errorf("cannot delete room that is in game")
	}

	// Remove all players from the room
	for playerID := range room.Players {
		err = s.LeaveRoom(room.ID, playerID)
		if err != nil {
			logrus.Warnf("Failed to remove player %s from room %s: %v", playerID, roomCode, err)
		}
	}

	// Delete room from Redis
	err = s.redisStore.DeleteRoom(room.ID)
	if err != nil {
		return fmt.Errorf("failed to delete room from Redis: %w", err)
	}

	// Delete room code mapping
	err = s.redisStore.DeleteRoomCodeMapping(room.Code)
	if err != nil {
		return fmt.Errorf("failed to delete room code mapping: %w", err)
	}

	logrus.WithFields(logrus.Fields{
		"room_id":   room.ID,
		"room_code": roomCode,
	}).Info("Room deleted")

	return nil
}

// generateRoomCode generates a random room code
func (s *Service) generateRoomCode() string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	code := make([]byte, 4)
	for i := range code {
		code[i] = charset[s.rand.Intn(len(charset))]
	}
	return string(code)
}
