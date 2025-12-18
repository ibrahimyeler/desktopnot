package match

import (
	"fmt"
	"sync"
	"time"

	"arena-backend/internal/models"
	"arena-backend/internal/sim"
	"arena-backend/internal/store"
	"arena-backend/internal/util"

	"github.com/google/uuid"
	"github.com/sirupsen/logrus"
)

// Service handles match operations
type Service struct {
	redisStore     *store.RedisStore
	postgresStore  *store.PostgresStore
	config         *util.Config
	physics        *sim.PhysicsEngine
	itemManager    *sim.ItemManager
	activeMatches  map[string]*MatchRunner
	mu             sync.RWMutex
}

// MatchRunner handles a running match
type MatchRunner struct {
	room          *models.Room
	physics       *sim.PhysicsEngine
	itemManager   *sim.ItemManager
	config        *util.Config
	postgresStore *store.PostgresStore
	ticker        *time.Ticker
	stopChan      chan struct{}
	lastTick      time.Time
}

// NewService creates a new match service
func NewService(redisStore *store.RedisStore, postgresStore *store.PostgresStore, config *util.Config) *Service {
	physics := sim.NewPhysicsEngine(config)
	itemManager := sim.NewItemManager(config, physics)

	return &Service{
		redisStore:    redisStore,
		postgresStore: postgresStore,
		config:        config,
		physics:       physics,
		itemManager:   itemManager,
		activeMatches: make(map[string]*MatchRunner),
	}
}

// StartMatch starts a new match
func (s *Service) StartMatch(roomID string) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Get room
	room, err := s.redisStore.GetRoom(roomID)
	if err != nil {
		return "", fmt.Errorf("failed to get room: %w", err)
	}

	if room == nil {
		return "", fmt.Errorf("room not found")
	}

	// Create match ID
	matchID := uuid.New().String()
	room.MatchID = &matchID

	// Change room status to countdown
	room.Status = models.RoomStatusCountdown
	room.Countdown = s.config.Game.CountdownDuration

	// Save room
	err = s.redisStore.SaveRoom(room)
	if err != nil {
		return "", fmt.Errorf("failed to save room: %w", err)
	}

	// Create match in database
	match := &models.Match{
		ID:          matchID,
		Mode:        "brawl",
		StartedAt:   time.Now(),
		PlayerCount: len(room.Players),
		Seed:        room.Seed,
		Arena:       room.Arena,
	}

	err = s.postgresStore.CreateMatch(match)
	if err != nil {
		return "", fmt.Errorf("failed to create match: %w", err)
	}

	// Start match runner
	runner := s.createMatchRunner(room)
	s.activeMatches[roomID] = runner

	go runner.Start()

	logrus.WithFields(logrus.Fields{
		"room_id":   roomID,
		"match_id":  matchID,
		"players":   len(room.Players),
	}).Info("Match started")

	return matchID, nil
}

// ProcessInput processes player input
func (s *Service) ProcessInput(roomID, playerID string, input map[string]interface{}) error {
	s.mu.RLock()
	runner, exists := s.activeMatches[roomID]
	s.mu.RUnlock()

	if !exists {
		return fmt.Errorf("match not found")
	}

	return runner.ProcessInput(playerID, input)
}

// ProcessPickup processes item pickup
func (s *Service) ProcessPickup(roomID, playerID, itemID string) error {
	s.mu.RLock()
	runner, exists := s.activeMatches[roomID]
	s.mu.RUnlock()

	if !exists {
		return fmt.Errorf("match not found")
	}

	return runner.ProcessPickup(playerID, itemID)
}

// ProcessUseItem processes item use
func (s *Service) ProcessUseItem(roomID, playerID string, targetDir []float64) error {
	s.mu.RLock()
	runner, exists := s.activeMatches[roomID]
	s.mu.RUnlock()

	if !exists {
		return fmt.Errorf("match not found")
	}

	return runner.ProcessUseItem(playerID, targetDir)
}

// createMatchRunner creates a new match runner
func (s *Service) createMatchRunner(room *models.Room) *MatchRunner {
	physics := sim.NewPhysicsEngine(s.config)
	itemManager := sim.NewItemManager(s.config, physics)

	return &MatchRunner{
		room:          room,
		physics:       physics,
		itemManager:   itemManager,
		config:        s.config,
		postgresStore: s.postgresStore,
		ticker:        time.NewTicker(s.config.GetTickDuration()),
		stopChan:      make(chan struct{}),
		lastTick:      time.Now(),
	}
}

// Start starts the match runner
func (r *MatchRunner) Start() {
	defer r.ticker.Stop()

	// Countdown phase
	for r.room.Countdown > 0 {
		select {
		case <-r.ticker.C:
			r.room.Countdown--
			r.broadcastCountdown()
		case <-r.stopChan:
			return
		}
	}

	// Start game
	r.room.Status = models.RoomStatusInGame
	r.room.GameTime = r.config.Game.MatchDuration
	r.initializePlayers()

	// Game loop
	for r.room.GameTime > 0 {
		select {
		case <-r.ticker.C:
			r.update()
		case <-r.stopChan:
			return
		}
	}

	// End game
	r.endGame()
}

// update updates the game state
func (r *MatchRunner) update() {
	now := time.Now()
	deltaTime := now.Sub(r.lastTick).Seconds()
	r.lastTick = now

	// Update physics
	r.updatePhysics(deltaTime)

	// Update items
	r.itemManager.Update(r.room)

	// Remove expired effects
	r.itemManager.RemoveExpiredEffects(r.room)

	// Update game time
	r.room.GameTime--

	// Increment tick
	r.room.Tick++

	// Check win condition
	if r.checkWinCondition() {
		r.endGame()
		return
	}

	// Broadcast snapshot
	r.broadcastSnapshot()
}

// updatePhysics updates physics simulation
func (r *MatchRunner) updatePhysics(deltaTime float64) {
	// Update player positions based on stored input
	for _, player := range r.room.Players {
		if player.State != models.PlayerStateDead {
			// Apply stored input (simplified)
			r.physics.UpdatePlayerPosition(player, []float64{0, 0}, deltaTime)
		}
	}

	// Resolve collisions
	r.resolveCollisions()
}

// resolveCollisions resolves player collisions
func (r *MatchRunner) resolveCollisions() {
	players := make([]*models.Player, 0, len(r.room.Players))
	for _, player := range r.room.Players {
		players = append(players, player)
	}

	for i := 0; i < len(players); i++ {
		for j := i + 1; j < len(players); j++ {
			if r.physics.CheckCollision(players[i], players[j]) {
				r.physics.ResolveCollision(players[i], players[j])
			}
		}
	}
}

// initializePlayers initializes player positions
func (r *MatchRunner) initializePlayers() {
	for _, player := range r.room.Players {
		player.Position = r.physics.GetRandomSpawnPosition()
		player.Velocity = models.Vector2D{X: 0, Y: 0}
		player.Health = 100
		player.State = models.PlayerStateAlive
		player.Item = nil
	}
}

// ProcessInput processes player input
func (r *MatchRunner) ProcessInput(playerID string, input map[string]interface{}) error {
	player, exists := r.room.Players[playerID]
	if !exists {
		return fmt.Errorf("player not found")
	}

	// Store input for processing in next tick
	// In a real implementation, you'd have an input buffer
	seq, _ := input["seq"].(float64)
	player.LastInput = int64(seq)

	return nil
}

// ProcessPickup processes item pickup
func (r *MatchRunner) ProcessPickup(playerID, itemID string) error {
	player, exists := r.room.Players[playerID]
	if !exists {
		return fmt.Errorf("player not found")
	}

	success := r.itemManager.TryPickupItem(player, itemID, r.room)
	if success {
		// Broadcast pickup event
		r.broadcastPickup(playerID, itemID, player.Item)
	}

	return nil
}

// ProcessUseItem processes item use
func (r *MatchRunner) ProcessUseItem(playerID string, targetDir []float64) error {
	player, exists := r.room.Players[playerID]
	if !exists {
		return fmt.Errorf("player not found")
	}

	events := r.itemManager.UseItem(player, targetDir, r.room)
	for _, event := range events {
		// Broadcast hit event
		r.broadcastHit(event)
	}

	return nil
}

// checkWinCondition checks if the game should end
func (r *MatchRunner) checkWinCondition() bool {
	alivePlayers := 0
	for _, player := range r.room.Players {
		if player.State != models.PlayerStateDead {
			alivePlayers++
		}
	}

	return alivePlayers <= 1
}

// endGame ends the game
func (r *MatchRunner) endGame() {
	r.room.Status = models.RoomStatusFinished

	// Determine winner
	var winner *models.Player
	highestScore := -1

	for _, player := range r.room.Players {
		if player.Score > highestScore {
			highestScore = player.Score
			winner = player
		}
	}

	// Save match results
	r.saveMatchResults(winner)

	// Broadcast end game
	r.broadcastEndGame(winner)

	// Stop runner
	close(r.stopChan)
}

// saveMatchResults saves match results to database
func (r *MatchRunner) saveMatchResults(winner *models.Player) {
	if r.room.MatchID == nil {
		return
	}

	// Update match end
	endedAt := time.Now()
	winnerID := ""
	if winner != nil {
		winnerID = winner.ID
	}

	err := r.postgresStore.UpdateMatchEnd(*r.room.MatchID, endedAt, &winnerID, r.config.Game.MatchDuration)
	if err != nil {
		logrus.Errorf("Failed to update match end: %v", err)
	}

	// Save player results
	for _, player := range r.room.Players {
		matchPlayer := &models.MatchPlayer{
			MatchID: *r.room.MatchID,
			UserID:  player.ID,
			IsBot:   player.IsBot,
			Kills:   player.Kills,
			Deaths:  player.Deaths,
			Score:   player.Score,
		}

		err := r.postgresStore.CreateMatchPlayer(matchPlayer)
		if err != nil {
			logrus.Errorf("Failed to save match player: %v", err)
		}
	}
}

// broadcastCountdown broadcasts countdown update
func (r *MatchRunner) broadcastCountdown() {
	// In a real implementation, you'd broadcast to all connected clients
	logrus.WithField("countdown", r.room.Countdown).Info("Countdown")
}

// broadcastSnapshot broadcasts game snapshot
func (r *MatchRunner) broadcastSnapshot() {
	// In a real implementation, you'd broadcast to all connected clients
	// For now, just log
	logrus.WithFields(logrus.Fields{
		"tick":      r.room.Tick,
		"game_time": r.room.GameTime,
		"players":   len(r.room.Players),
	}).Debug("Snapshot")
}

// broadcastPickup broadcasts item pickup
func (r *MatchRunner) broadcastPickup(playerID, itemID string, item *models.Item) {
	// In a real implementation, you'd broadcast to all connected clients
	logrus.WithFields(logrus.Fields{
		"player_id": playerID,
		"item_id":   itemID,
		"item_type": item.Type,
	}).Info("Item pickup")
}

// broadcastHit broadcasts hit event
func (r *MatchRunner) broadcastHit(event models.GameEvent) {
	// In a real implementation, you'd broadcast to all connected clients
	logrus.WithFields(logrus.Fields{
		"attacker": event.Payload["attacker_id"],
		"target":   event.Payload["target_id"],
		"item":     event.Payload["item_type"],
	}).Info("Hit event")
}

// broadcastEndGame broadcasts end game
func (r *MatchRunner) broadcastEndGame(winner *models.Player) {
	// In a real implementation, you'd broadcast to all connected clients
	winnerID := ""
	if winner != nil {
		winnerID = winner.ID
	}

	logrus.WithFields(logrus.Fields{
		"winner_id": winnerID,
		"match_id":  r.room.MatchID,
	}).Info("Game ended")
}
