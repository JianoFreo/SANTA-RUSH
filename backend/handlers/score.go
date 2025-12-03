package handlers

import (
	"encoding/json"
	"net/http"
	"santa-rush/models"
	"sort"
	"strconv"
	"sync"
	"time"
)

var nextID = 1

// GetScoresHandler returns all scores
func GetScoresHandler(scores *[]models.Score, mux *sync.RWMutex) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		mux.RLock()
		defer mux.RUnlock()

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"scores": *scores,
			"total":  len(*scores),
		})
	}
}

// SubmitScoreHandler handles new score submissions
func SubmitScoreHandler(scores *[]models.Score, mux *sync.RWMutex) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req models.SubmitScoreRequest
		
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Validate input
		if req.Score < 0 || req.Followers < 0 {
			http.Error(w, "Invalid score or followers count", http.StatusBadRequest)
			return
		}

		if req.PlayerName == "" {
			req.PlayerName = "Anonymous"
		}

		// Create new score entry
		score := models.Score{
			ID:         nextID,
			PlayerName: req.PlayerName,
			Score:      req.Score,
			Followers:  req.Followers,
			Timestamp:  time.Now(),
		}

		mux.Lock()
		*scores = append(*scores, score)
		nextID++
		
		// Sort scores by score descending
		sort.Slice(*scores, func(i, j int) bool {
			return (*scores)[i].Score > (*scores)[j].Score
		})
		
		// Keep only top 100 scores
		if len(*scores) > 100 {
			*scores = (*scores)[:100]
		}
		mux.Unlock()

		// Send response
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(models.ScoreResponse{
			Success: true,
			Message: "Score submitted successfully",
			Score:   &score,
		})
	}
}

// GetLeaderboardHandler returns top scores
func GetLeaderboardHandler(scores *[]models.Score, mux *sync.RWMutex) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		mux.RLock()
		defer mux.RUnlock()

		// Get limit from query param (default 10)
		limitStr := r.URL.Query().Get("limit")
		limit := 10
		if limitStr != "" {
			if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
				limit = l
			}
		}

		// Get top scores
		topScores := *scores
		if len(topScores) > limit {
			topScores = topScores[:limit]
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(models.LeaderboardResponse{
			Scores: topScores,
			Total:  len(*scores),
		})
	}
}
