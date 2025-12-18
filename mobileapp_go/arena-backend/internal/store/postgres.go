package store

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"arena-backend/internal/models"
	"arena-backend/internal/util"

	_ "github.com/lib/pq"
)

// PostgresStore implements the database operations
type PostgresStore struct {
	db *sql.DB
}

// NewPostgresStore creates a new PostgreSQL store
func NewPostgresStore(config *util.Config) (*PostgresStore, error) {
	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=%s",
		config.DB.Host, config.DB.Port, config.DB.User, config.DB.Password, config.DB.DBName, config.DB.SSLMode)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	return &PostgresStore{db: db}, nil
}

// Close closes the database connection
func (s *PostgresStore) Close() error {
	return s.db.Close()
}

// CreateUser creates a new user
func (s *PostgresStore) CreateUser(nickname string) (*models.User, error) {
	user := &models.User{}
	query := `INSERT INTO users (nickname) VALUES ($1) RETURNING id, nickname, created_at, updated_at`
	
	err := s.db.QueryRow(query, nickname).Scan(&user.ID, &user.Nickname, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	return user, nil
}

// GetUserByNickname gets a user by nickname
func (s *PostgresStore) GetUserByNickname(nickname string) (*models.User, error) {
	user := &models.User{}
	query := `SELECT id, nickname, created_at, updated_at FROM users WHERE nickname = $1`
	
	err := s.db.QueryRow(query, nickname).Scan(&user.ID, &user.Nickname, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return user, nil
}

// CreateMatch creates a new match
func (s *PostgresStore) CreateMatch(match *models.Match) error {
	query := `
		INSERT INTO matches (id, mode, started_at, player_count, seed, arena)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	
	_, err := s.db.Exec(query, match.ID, match.Mode, match.StartedAt, match.PlayerCount, match.Seed, match.Arena)
	if err != nil {
		return fmt.Errorf("failed to create match: %w", err)
	}

	return nil
}

// UpdateMatchEnd updates match end time and winner
func (s *PostgresStore) UpdateMatchEnd(matchID string, endedAt time.Time, winnerUserID *string, duration int) error {
	query := `
		UPDATE matches 
		SET ended_at = $1, winner_user_id = $2, duration = $3
		WHERE id = $4
	`
	
	_, err := s.db.Exec(query, endedAt, winnerUserID, duration, matchID)
	if err != nil {
		return fmt.Errorf("failed to update match end: %w", err)
	}

	return nil
}

// CreateMatchPlayer creates a match player record
func (s *PostgresStore) CreateMatchPlayer(matchPlayer *models.MatchPlayer) error {
	query := `
		INSERT INTO match_players (match_id, user_id, is_bot, kills, deaths, score, position)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`
	
	_, err := s.db.Exec(query, matchPlayer.MatchID, matchPlayer.UserID, matchPlayer.IsBot, 
		matchPlayer.Kills, matchPlayer.Deaths, matchPlayer.Score, matchPlayer.Position)
	if err != nil {
		return fmt.Errorf("failed to create match player: %w", err)
	}

	return nil
}

// CreateEvent creates a game event
func (s *PostgresStore) CreateEvent(event *models.GameEvent) error {
	payloadJSON, err := json.Marshal(event.Payload)
	if err != nil {
		return fmt.Errorf("failed to marshal event payload: %w", err)
	}

	query := `
		INSERT INTO events (id, match_id, tick, kind, payload_json, timestamp)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	
	_, err = s.db.Exec(query, event.ID, event.MatchID, event.Tick, event.Kind, payloadJSON, event.Timestamp)
	if err != nil {
		return fmt.Errorf("failed to create event: %w", err)
	}

	return nil
}

// GetLeaderboard gets the leaderboard for a given period
func (s *PostgresStore) GetLeaderboard(period string, limit int) ([]models.LeaderboardEntry, error) {
	var timeFilter string
	switch period {
	case "week":
		timeFilter = "AND m.started_at >= NOW() - INTERVAL '7 days'"
	case "month":
		timeFilter = "AND m.started_at >= NOW() - INTERVAL '30 days'"
	case "all":
		timeFilter = ""
	default:
		timeFilter = "AND m.started_at >= NOW() - INTERVAL '7 days'"
	}

	query := `
		SELECT 
			u.id,
			u.nickname,
			SUM(mp.score) as total_score,
			SUM(mp.kills) as total_kills,
			SUM(mp.deaths) as total_deaths,
			COUNT(DISTINCT m.id) as total_matches,
			RANK() OVER (ORDER BY SUM(mp.score) DESC) as position
		FROM users u
		JOIN match_players mp ON u.id = mp.user_id
		JOIN matches m ON mp.match_id = m.id
		WHERE m.ended_at IS NOT NULL ` + timeFilter + `
		GROUP BY u.id, u.nickname
		ORDER BY total_score DESC
		LIMIT $1
	`

	rows, err := s.db.Query(query, limit)
	if err != nil {
		return nil, fmt.Errorf("failed to get leaderboard: %w", err)
	}
	defer rows.Close()

	var entries []models.LeaderboardEntry
	for rows.Next() {
		var entry models.LeaderboardEntry
		err := rows.Scan(&entry.UserID, &entry.Nickname, &entry.Score, &entry.Kills, &entry.Deaths, &entry.Matches, &entry.Position)
		if err != nil {
			return nil, fmt.Errorf("failed to scan leaderboard entry: %w", err)
		}
		entries = append(entries, entry)
	}

	return entries, nil
}

// GetUserStats gets statistics for a specific user
func (s *PostgresStore) GetUserStats(userID string) (*models.User, int, int, int, int, error) {
	query := `
		SELECT 
			u.id, u.nickname, u.created_at, u.updated_at,
			COALESCE(SUM(mp.score), 0) as total_score,
			COALESCE(SUM(mp.kills), 0) as total_kills,
			COALESCE(SUM(mp.deaths), 0) as total_deaths,
			COALESCE(COUNT(DISTINCT m.id), 0) as total_matches
		FROM users u
		LEFT JOIN match_players mp ON u.id = mp.user_id
		LEFT JOIN matches m ON mp.match_id = m.id AND m.ended_at IS NOT NULL
		WHERE u.id = $1
		GROUP BY u.id, u.nickname, u.created_at, u.updated_at
	`

	user := &models.User{}
	var totalScore, totalKills, totalDeaths, totalMatches int

	err := s.db.QueryRow(query, userID).Scan(
		&user.ID, &user.Nickname, &user.CreatedAt, &user.UpdatedAt,
		&totalScore, &totalKills, &totalDeaths, &totalMatches,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, 0, 0, 0, 0, nil
		}
		return nil, 0, 0, 0, 0, fmt.Errorf("failed to get user stats: %w", err)
	}

	return user, totalScore, totalKills, totalDeaths, totalMatches, nil
}

// GetMatchHistory gets match history with pagination
func (s *PostgresStore) GetMatchHistory(page, limit int) ([]models.MatchInfo, int, error) {
	offset := (page - 1) * limit

	// Get total count
	countQuery := `SELECT COUNT(*) FROM matches WHERE ended_at IS NOT NULL`
	var total int
	err := s.db.QueryRow(countQuery).Scan(&total)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get match count: %w", err)
	}

	// Get matches with pagination
	query := `
		SELECT 
			m.id, m.mode, m.started_at, m.ended_at, m.duration, 
			m.player_count, m.arena, u.nickname as winner_name
		FROM matches m
		LEFT JOIN users u ON m.winner_user_id = u.id
		WHERE m.ended_at IS NOT NULL
		ORDER BY m.started_at DESC
		LIMIT $1 OFFSET $2
	`

	rows, err := s.db.Query(query, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get matches: %w", err)
	}
	defer rows.Close()

	var matches []models.MatchInfo
	for rows.Next() {
		var match models.MatchInfo
		var winnerName sql.NullString
		
		err := rows.Scan(
			&match.ID, &match.Mode, &match.StartedAt, &match.EndedAt, &match.Duration,
			&match.PlayerCount, &match.Arena, &winnerName,
		)
		if err != nil {
			return nil, 0, fmt.Errorf("failed to scan match: %w", err)
		}

		if winnerName.Valid {
			match.Winner = winnerName.String
		}

		matches = append(matches, match)
	}

	return matches, total, nil
}
