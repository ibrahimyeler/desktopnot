package sim

import (
	"math"
	"math/rand"
	"time"

	"arena-backend/internal/models"
	"arena-backend/internal/util"
)

// PhysicsEngine handles game physics simulation
type PhysicsEngine struct {
	config *util.Config
	rand   *rand.Rand
}

// NewPhysicsEngine creates a new physics engine
func NewPhysicsEngine(config *util.Config) *PhysicsEngine {
	return &PhysicsEngine{
		config: config,
		rand:   rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// UpdatePlayerPosition updates player position based on input and physics
func (p *PhysicsEngine) UpdatePlayerPosition(player *models.Player, move []float64, deltaTime float64) {
	// Apply movement input
	if len(move) >= 2 {
		moveX, moveY := move[0], move[1]
		
		// Normalize movement vector
		magnitude := math.Sqrt(moveX*moveX + moveY*moveY)
		if magnitude > 0 {
			moveX /= magnitude
			moveY /= magnitude
		}

		// Apply movement to velocity
		player.Velocity.X += moveX * p.config.Game.MaxPlayerSpeed * deltaTime
		player.Velocity.Y += moveY * p.config.Game.MaxPlayerSpeed * deltaTime
	}

	// Apply friction
	friction := 0.9
	player.Velocity.X *= friction
	player.Velocity.Y *= friction

	// Clamp velocity to max speed
	maxSpeed := p.config.Game.MaxPlayerSpeed
	currentSpeed := math.Sqrt(player.Velocity.X*player.Velocity.X + player.Velocity.Y*player.Velocity.Y)
	if currentSpeed > maxSpeed {
		player.Velocity.X = (player.Velocity.X / currentSpeed) * maxSpeed
		player.Velocity.Y = (player.Velocity.Y / currentSpeed) * maxSpeed
	}

	// Update position
	player.Position.X += player.Velocity.X * deltaTime
	player.Position.Y += player.Velocity.Y * deltaTime

	// Apply arena boundaries
	p.applyArenaBoundaries(player)
}

// applyArenaBoundaries keeps player within arena bounds
func (p *PhysicsEngine) applyArenaBoundaries(player *models.Player) {
	halfWidth := p.config.Game.ArenaWidth / 2
	halfHeight := p.config.Game.ArenaHeight / 2
	radius := p.config.Game.PlayerRadius

	// X boundaries
	if player.Position.X-radius < -halfWidth {
		player.Position.X = -halfWidth + radius
		player.Velocity.X = 0
	} else if player.Position.X+radius > halfWidth {
		player.Position.X = halfWidth - radius
		player.Velocity.X = 0
	}

	// Y boundaries
	if player.Position.Y-radius < -halfHeight {
		player.Position.Y = -halfHeight + radius
		player.Velocity.Y = 0
	} else if player.Position.Y+radius > halfHeight {
		player.Position.Y = halfHeight - radius
		player.Velocity.Y = 0
	}
}

// ApplyKnockback applies knockback to a player
func (p *PhysicsEngine) ApplyKnockback(player *models.Player, knockbackX, knockbackY, force float64) {
	player.Velocity.X += knockbackX * force
	player.Velocity.Y += knockbackY * force
}

// CheckCollision checks collision between two players
func (p *PhysicsEngine) CheckCollision(player1, player2 *models.Player) bool {
	dx := player1.Position.X - player2.Position.X
	dy := player1.Position.Y - player2.Position.Y
	distance := math.Sqrt(dx*dx + dy*dy)
	
	combinedRadius := p.config.Game.PlayerRadius * 2
	return distance < combinedRadius
}

// ResolveCollision resolves collision between two players
func (p *PhysicsEngine) ResolveCollision(player1, player2 *models.Player) {
	dx := player2.Position.X - player1.Position.X
	dy := player2.Position.Y - player1.Position.Y
	distance := math.Sqrt(dx*dx + dy*dy)
	
	if distance == 0 {
		// Players are exactly on top of each other, move them apart randomly
		angle := p.rand.Float64() * 2 * math.Pi
		dx = math.Cos(angle)
		dy = math.Sin(angle)
		distance = 1
	}

	// Normalize direction
	dx /= distance
	dy /= distance

	// Calculate overlap
	combinedRadius := p.config.Game.PlayerRadius * 2
	overlap := combinedRadius - distance

	// Move players apart
	player1.Position.X -= dx * overlap * 0.5
	player1.Position.Y -= dy * overlap * 0.5
	player2.Position.X += dx * overlap * 0.5
	player2.Position.Y += dy * overlap * 0.5
}

// CheckItemPickup checks if a player can pick up an item
func (p *PhysicsEngine) CheckItemPickup(player *models.Player, item *models.Item) bool {
	dx := player.Position.X - item.Position.X
	dy := player.Position.Y - item.Position.Y
	distance := math.Sqrt(dx*dx + dy*dy)
	
	return distance <= p.config.Game.ItemPickupDistance
}

// CheckHit checks if a hit lands on a target
func (p *PhysicsEngine) CheckHit(attacker *models.Player, target *models.Player, item *models.Item, targetDir []float64) bool {
	// Check distance
	dx := target.Position.X - attacker.Position.X
	dy := target.Position.Y - attacker.Position.Y
	distance := math.Sqrt(dx*dx + dy*dy)
	
	if distance > item.Range {
		return false
	}

	// Check direction (if targetDir is provided)
	if len(targetDir) >= 2 {
		// Normalize target direction
		dirX, dirY := targetDir[0], targetDir[1]
		dirMagnitude := math.Sqrt(dirX*dirX + dirY*dirY)
		if dirMagnitude > 0 {
			dirX /= dirMagnitude
			dirY /= dirMagnitude
		}

		// Normalize direction to target
		targetDirX := dx / distance
		targetDirY := dy / distance

		// Calculate dot product
		dotProduct := dirX*targetDirX + dirY*targetDirY

		// Check if target is within hit cone (120 degrees)
		cosAngle := math.Cos(120 * math.Pi / 180)
		if dotProduct < cosAngle {
			return false
		}
	}

	return true
}

// CalculateKnockbackDirection calculates knockback direction from attacker to target
func (p *PhysicsEngine) CalculateKnockbackDirection(attacker, target *models.Player) (float64, float64) {
	dx := target.Position.X - attacker.Position.X
	dy := target.Position.Y - attacker.Position.Y
	distance := math.Sqrt(dx*dx + dy*dy)
	
	if distance == 0 {
		// If players are on top of each other, use random direction
		angle := p.rand.Float64() * 2 * math.Pi
		return math.Cos(angle), math.Sin(angle)
	}
	
	return dx / distance, dy / distance
}

// IsPlayerOutOfBounds checks if a player is out of arena bounds
func (p *PhysicsEngine) IsPlayerOutOfBounds(player *models.Player) bool {
	halfWidth := p.config.Game.ArenaWidth / 2
	halfHeight := p.config.Game.ArenaHeight / 2
	
	return player.Position.X < -halfWidth || 
		   player.Position.X > halfWidth || 
		   player.Position.Y < -halfHeight || 
		   player.Position.Y > halfHeight
}

// GetRandomSpawnPosition gets a random spawn position within the arena
func (p *PhysicsEngine) GetRandomSpawnPosition() models.Vector2D {
	halfWidth := p.config.Game.ArenaWidth / 2 - p.config.Game.PlayerRadius
	halfHeight := p.config.Game.ArenaHeight / 2 - p.config.Game.PlayerRadius
	
	return models.Vector2D{
		X: (p.rand.Float64()*2 - 1) * halfWidth,
		Y: (p.rand.Float64()*2 - 1) * halfHeight,
	}
}

// GetRandomItemSpawnPosition gets a random item spawn position
func (p *PhysicsEngine) GetRandomItemSpawnPosition() models.Vector2D {
	halfWidth := p.config.Game.ArenaWidth / 2 - 1 // Keep items away from edges
	halfHeight := p.config.Game.ArenaHeight / 2 - 1
	
	return models.Vector2D{
		X: (p.rand.Float64()*2 - 1) * halfWidth,
		Y: (p.rand.Float64()*2 - 1) * halfHeight,
	}
}
