package main

import (
	"encoding/json"
	"log"
	"net/http"
	"santa-rush/handlers"
	"santa-rush/models"
	"sync"

	"github.com/gorilla/mux"
)

// In-memory storage for scores (you can replace with database later)
var (
	scores    []models.Score
	scoresMux sync.RWMutex
)

func main() {
	// Initialize router
	r := mux.NewRouter()

	// Enable CORS middleware
	r.Use(corsMiddleware)

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	
	// Health check
	api.HandleFunc("/health", healthHandler).Methods("GET")
	
	// Score endpoints
	api.HandleFunc("/scores", handlers.GetScoresHandler(&scores, &scoresMux)).Methods("GET")
	api.HandleFunc("/scores", handlers.SubmitScoreHandler(&scores, &scoresMux)).Methods("POST")
	api.HandleFunc("/leaderboard", handlers.GetLeaderboardHandler(&scores, &scoresMux)).Methods("GET")

	// Start server
	port := ":8080"
	log.Printf("🎮 Santa Rush API Server starting on http://localhost%s\n", port)
	log.Printf("📊 API endpoints available at http://localhost%s/api\n", port)
	
	if err := http.ListenAndServe(port, r); err != nil {
		log.Fatal(err)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status": "ok",
		"message": "Santa Rush API is running",
	})
}
