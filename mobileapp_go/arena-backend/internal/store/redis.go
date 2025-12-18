package store

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"arena-backend/internal/models"
	"arena-backend/internal/util"

	"github.com/redis/go-redis/v9"
)

// RedisStore implements Redis operations
type RedisStore struct {
	client *redis.Client
}

// NewRedisStore creates a new Redis store
func NewRedisStore(config *util.Config) (*RedisStore, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%d", config.Redis.Host, config.Redis.Port),
		Password: config.Redis.Password,
		DB:       config.Redis.DB,
	})

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		return nil, fmt.Errorf("failed to ping Redis: %w", err)
	}

	return &RedisStore{client: client}, nil
}

// Close closes the Redis connection
func (s *RedisStore) Close() error {
	return s.client.Close()
}

// Room operations
const (
	roomKeyPrefix = "room:"
	roomTTL       = 24 * time.Hour
)

// SaveRoom saves a room to Redis
func (s *RedisStore) SaveRoom(room *models.Room) error {
	ctx := context.Background()
	key := roomKeyPrefix + room.ID

	data, err := json.Marshal(room)
	if err != nil {
		return fmt.Errorf("failed to marshal room: %w", err)
	}

	err = s.client.Set(ctx, key, data, roomTTL).Err()
	if err != nil {
		return fmt.Errorf("failed to save room: %w", err)
	}

	return nil
}

// GetRoom gets a room from Redis
func (s *RedisStore) GetRoom(roomID string) (*models.Room, error) {
	ctx := context.Background()
	key := roomKeyPrefix + roomID

	data, err := s.client.Get(ctx, key).Bytes()
	if err != nil {
		if err == redis.Nil {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get room: %w", err)
	}

	var room models.Room
	err = json.Unmarshal(data, &room)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal room: %w", err)
	}

	return &room, nil
}

// DeleteRoom deletes a room from Redis
func (s *RedisStore) DeleteRoom(roomID string) error {
	ctx := context.Background()
	key := roomKeyPrefix + roomID

	err := s.client.Del(ctx, key).Err()
	if err != nil {
		return fmt.Errorf("failed to delete room: %w", err)
	}

	return nil
}

// Room code mapping operations
const (
	roomCodeKeyPrefix = "roomcode:"
	roomCodeTTL       = 24 * time.Hour
)

// SaveRoomCodeMapping saves room code to room ID mapping
func (s *RedisStore) SaveRoomCodeMapping(roomCode, roomID string) error {
	ctx := context.Background()
	key := roomCodeKeyPrefix + roomCode

	err := s.client.Set(ctx, key, roomID, roomCodeTTL).Err()
	if err != nil {
		return fmt.Errorf("failed to save room code mapping: %w", err)
	}

	return nil
}

// GetRoomIDByCode gets room ID by room code
func (s *RedisStore) GetRoomIDByCode(roomCode string) (string, error) {
	ctx := context.Background()
	key := roomCodeKeyPrefix + roomCode

	roomID, err := s.client.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return "", nil
		}
		return "", fmt.Errorf("failed to get room ID by code: %w", err)
	}

	return roomID, nil
}

// DeleteRoomCodeMapping deletes room code mapping
func (s *RedisStore) DeleteRoomCodeMapping(roomCode string) error {
	ctx := context.Background()
	key := roomCodeKeyPrefix + roomCode

	err := s.client.Del(ctx, key).Err()
	if err != nil {
		return fmt.Errorf("failed to delete room code mapping: %w", err)
	}

	return nil
}

// Player session operations
const (
	playerSessionKeyPrefix = "player:"
	playerSessionTTL       = 30 * time.Minute
)

// SavePlayerSession saves player session data
func (s *RedisStore) SavePlayerSession(playerID, roomID string) error {
	ctx := context.Background()
	key := playerSessionKeyPrefix + playerID

	sessionData := map[string]string{
		"room_id": roomID,
		"joined_at": time.Now().Format(time.RFC3339),
	}

	data, err := json.Marshal(sessionData)
	if err != nil {
		return fmt.Errorf("failed to marshal session data: %w", err)
	}

	err = s.client.Set(ctx, key, data, playerSessionTTL).Err()
	if err != nil {
		return fmt.Errorf("failed to save player session: %w", err)
	}

	return nil
}

// GetPlayerSession gets player session data
func (s *RedisStore) GetPlayerSession(playerID string) (map[string]string, error) {
	ctx := context.Background()
	key := playerSessionKeyPrefix + playerID

	data, err := s.client.Get(ctx, key).Bytes()
	if err != nil {
		if err == redis.Nil {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get player session: %w", err)
	}

	var sessionData map[string]string
	err = json.Unmarshal(data, &sessionData)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal session data: %w", err)
	}

	return sessionData, nil
}

// DeletePlayerSession deletes player session
func (s *RedisStore) DeletePlayerSession(playerID string) error {
	ctx := context.Background()
	key := playerSessionKeyPrefix + playerID

	err := s.client.Del(ctx, key).Err()
	if err != nil {
		return fmt.Errorf("failed to delete player session: %w", err)
	}

	return nil
}

// Rate limiting operations
const (
	rateLimitKeyPrefix = "ratelimit:"
	rateLimitTTL       = 1 * time.Minute
)

// CheckRateLimit checks if a client has exceeded rate limit
func (s *RedisStore) CheckRateLimit(clientID, action string, limit int) (bool, error) {
	ctx := context.Background()
	key := rateLimitKeyPrefix + clientID + ":" + action

	count, err := s.client.Incr(ctx, key).Result()
	if err != nil {
		return false, fmt.Errorf("failed to increment rate limit counter: %w", err)
	}

	// Set TTL on first increment
	if count == 1 {
		s.client.Expire(ctx, key, rateLimitTTL)
	}

	return count <= int64(limit), nil
}

// Pub/Sub operations for real-time communication
const (
	roomChannelPrefix = "room:"
)

// PublishToRoom publishes a message to a room channel
func (s *RedisStore) PublishToRoom(roomID string, message interface{}) error {
	ctx := context.Background()
	channel := roomChannelPrefix + roomID

	data, err := json.Marshal(message)
	if err != nil {
		return fmt.Errorf("failed to marshal message: %w", err)
	}

	err = s.client.Publish(ctx, channel, data).Err()
	if err != nil {
		return fmt.Errorf("failed to publish message: %w", err)
	}

	return nil
}

// SubscribeToRoom subscribes to a room channel
func (s *RedisStore) SubscribeToRoom(roomID string) *redis.PubSub {
	channel := roomChannelPrefix + roomID
	return s.client.Subscribe(context.Background(), channel)
}

// Cleanup operations
func (s *RedisStore) CleanupExpiredRooms() error {
	// This is a simplified cleanup - in production you might want more sophisticated cleanup
	// For now, we rely on TTL to automatically clean up expired keys
	
	// You could also implement a scheduled cleanup job here
	return nil
}

// GetAllRoomCodes gets all active room codes
func (s *RedisStore) GetAllRoomCodes() ([]string, error) {
	ctx := context.Background()
	
	// Get all room code mappings
	pattern := roomCodeKeyPrefix + "*"
	keys, err := s.client.Keys(ctx, pattern).Result()
	if err != nil {
		return nil, fmt.Errorf("failed to get room code keys: %w", err)
	}

	var roomCodes []string
	for _, key := range keys {
		// Extract room code from key (remove prefix)
		roomCode := key[len(roomCodeKeyPrefix):]
		roomCodes = append(roomCodes, roomCode)
	}

	return roomCodes, nil
}
