package sim

import (
	"math/rand"
	"time"

	"arena-backend/internal/models"
	"arena-backend/internal/util"
)

// ItemManager handles item spawning and management
type ItemManager struct {
	config     *util.Config
	physics    *PhysicsEngine
	rand       *rand.Rand
	spawnTimer int
}

// NewItemManager creates a new item manager
func NewItemManager(config *util.Config, physics *PhysicsEngine) *ItemManager {
	return &ItemManager{
		config:     config,
		physics:    physics,
		rand:       rand.New(rand.NewSource(time.Now().UnixNano())),
		spawnTimer: 0,
	}
}

// Update updates item spawning logic
func (im *ItemManager) Update(room *models.Room) {
	if room.Status != models.RoomStatusInGame {
		return
	}

	im.spawnTimer++

	// Spawn items at regular intervals
	if im.spawnTimer >= im.config.Game.ItemSpawnInterval*im.config.Game.TickRate {
		im.spawnTimer = 0
		im.SpawnRandomItem(room)
	}
}

// SpawnRandomItem spawns a random item in the room
func (im *ItemManager) SpawnRandomItem(room *models.Room) {
	// Check if we have space for more items (max 10 items at once)
	if len(room.Items) >= 10 {
		return
	}

	// Get random spawn position
	position := im.physics.GetRandomItemSpawnPosition()

	// Check if position is occupied by players
	for _, player := range room.Players {
		dx := player.Position.X - position.X
		dy := player.Position.Y - position.Y
		distance := dx*dx + dy*dy
		if distance < 4 { // 2 units minimum distance from players
			return // Position too close to player, skip spawn
		}
	}

	// Check if position is occupied by other items
	for _, item := range room.Items {
		dx := item.Position.X - position.X
		dy := item.Position.Y - position.Y
		distance := dx*dx + dy*dy
		if distance < 1 { // 1 unit minimum distance from other items
			return // Position too close to item, skip spawn
		}
	}

	// Select random item type with weights
	itemType := im.selectRandomItemType()
	
	// Create item
	item := models.NewItem(itemType, position)
	
	// Add to room
	room.Items[item.ID] = item
}

// selectRandomItemType selects a random item type with weighted probabilities
func (im *ItemManager) selectRandomItemType() models.ItemType {
	// Define item weights (higher = more common)
	weights := map[models.ItemType]int{
		models.ItemTypeTerlik:      30,  // Most common
		models.ItemTypeCay:         25,
		models.ItemTypeDoner:       20,
		models.ItemTypeSelfieStick: 15,
		models.ItemTypeEmojiBomb:   8,
		models.ItemTypeKarpuz:      2,   // Rarest
	}

	// Calculate total weight
	totalWeight := 0
	for _, weight := range weights {
		totalWeight += weight
	}

	// Generate random number
	random := im.rand.Intn(totalWeight)

	// Select item based on weight
	currentWeight := 0
	for itemType, weight := range weights {
		currentWeight += weight
		if random < currentWeight {
			return itemType
		}
	}

	// Fallback
	return models.ItemTypeTerlik
}

// TryPickupItem attempts to pick up an item
func (im *ItemManager) TryPickupItem(player *models.Player, itemID string, room *models.Room) bool {
	item, exists := room.Items[itemID]
	if !exists {
		return false
	}

	// Check if player can pick up the item
	if !im.physics.CheckItemPickup(player, item) {
		return false
	}

	// Check if player already has an item
	if player.Item != nil {
		return false
	}

	// Pick up the item
	player.Item = item
	delete(room.Items, itemID)

	return true
}

// UseItem uses an item against targets
func (im *ItemManager) UseItem(attacker *models.Player, targetDir []float64, room *models.Room) []models.GameEvent {
	if attacker.Item == nil {
		return nil
	}

	var events []models.GameEvent

	// Find all valid targets
	for _, target := range room.Players {
		if target.ID == attacker.ID {
			continue // Can't hit yourself
		}

		if target.State == models.PlayerStateDead {
			continue // Can't hit dead players
		}

		// Check if hit lands
		if im.physics.CheckHit(attacker, target, attacker.Item, targetDir) {
			event := im.processHit(attacker, target, room)
			events = append(events, event)
		}
	}

	// Reduce item uses
	attacker.Item.UsesLeft--
	if attacker.Item.UsesLeft <= 0 {
		attacker.Item = nil // Item breaks
	}

	return events
}

// processHit processes a successful hit
func (im *ItemManager) processHit(attacker, target *models.Player, room *models.Room) models.GameEvent {
	// Calculate knockback direction
	knockbackX, knockbackY := im.physics.CalculateKnockbackDirection(attacker, target)
	
	// Apply knockback
	im.physics.ApplyKnockback(target, knockbackX, knockbackY, attacker.Item.Knockback)

	// Apply damage
	target.Health -= attacker.Item.Damage

	// Apply effects
	if attacker.Item.Effect != models.EffectNone {
		target.State = models.PlayerState(attacker.Item.Effect)
	}

	// Check if target is knocked out
	if im.physics.IsPlayerOutOfBounds(target) || target.Health <= 0 {
		target.State = models.PlayerStateDead
		target.Health = 0
		attacker.Kills++
		attacker.Score += 10
		target.Deaths++
	}

	// Create hit event
	event := models.GameEvent{
		ID:      generateEventID(),
		MatchID: *room.MatchID,
		Tick:    room.Tick,
		Kind:    models.EventHit,
		Payload: map[string]interface{}{
			"attacker_id": attacker.ID,
			"target_id":   target.ID,
			"item_type":   string(attacker.Item.Type),
			"knockback_x": knockbackX,
			"knockback_y": knockbackY,
			"effect":      string(attacker.Item.Effect),
			"effect_duration": attacker.Item.EffectDuration,
			"damage":      attacker.Item.Damage,
			"target_health": target.Health,
			"target_state": string(target.State),
		},
		Timestamp: time.Now(),
	}

	return event
}

// RemoveExpiredEffects removes expired effects from players
func (im *ItemManager) RemoveExpiredEffects(room *models.Room) {
	for _, player := range room.Players {
		if player.State != models.PlayerStateAlive && player.State != models.PlayerStateDead {
			// In a real implementation, you'd track effect timers
			// For now, we'll just reset to alive after a few ticks
			// This is simplified - you'd want proper effect duration tracking
			if player.State == models.PlayerStateStunned || 
			   player.State == models.PlayerStateSlowed || 
			   player.State == models.PlayerStateBlinded {
				player.State = models.PlayerStateAlive
			}
		}
	}
}

// ClearAllItems removes all items from the room
func (im *ItemManager) ClearAllItems(room *models.Room) {
	room.Items = make(map[string]*models.Item)
}

// GetItemSpawnPositions gets predefined spawn positions for items
func (im *ItemManager) GetItemSpawnPositions() []models.Vector2D {
	// Define some fixed spawn positions around the arena
	halfWidth := im.config.Game.ArenaWidth / 2 - 2
	halfHeight := im.config.Game.ArenaHeight / 2 - 2

	return []models.Vector2D{
		{X: -halfWidth * 0.7, Y: -halfHeight * 0.7},
		{X: halfWidth * 0.7, Y: -halfHeight * 0.7},
		{X: -halfWidth * 0.7, Y: halfHeight * 0.7},
		{X: halfWidth * 0.7, Y: halfHeight * 0.7},
		{X: 0, Y: -halfHeight * 0.8},
		{X: 0, Y: halfHeight * 0.8},
		{X: -halfWidth * 0.8, Y: 0},
		{X: halfWidth * 0.8, Y: 0},
	}
}

// Helper function to generate event ID
func generateEventID() string {
	return "evt_" + time.Now().Format("20060102150405") + "_" + string(rune(rand.Intn(1000)))
}
