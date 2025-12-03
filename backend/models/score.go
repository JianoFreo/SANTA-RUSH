package models

import "time"

// Score represents a game score entry
type Score struct {
	ID         int       `json:"id"`
	PlayerName string    `json:"playerName"`
	Score      int       `json:"score"`
	Followers  int       `json:"followers"`
	Timestamp  time.Time `json:"timestamp"`
}

// ScoreResponse for API responses
type ScoreResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message,omitempty"`
	Score   *Score `json:"score,omitempty"`
}

// LeaderboardResponse for leaderboard endpoint
type LeaderboardResponse struct {
	Scores []Score `json:"scores"`
	Total  int     `json:"total"`
}

// SubmitScoreRequest for incoming score submissions
type SubmitScoreRequest struct {
	PlayerName string `json:"playerName"`
	Score      int    `json:"score"`
	Followers  int    `json:"followers"`
}
