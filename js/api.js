// API communication with Golang backend

class GameAPI {
    constructor() {
        this.baseURL = 'http://localhost:8080/api';
        this.backendAvailable = false;
    }

    async checkBackend() {
        try {
            const response = await fetch(`${this.baseURL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            this.backendAvailable = response.ok;
            return this.backendAvailable;
        } catch (error) {
            console.log('Backend not available, using local storage');
            this.backendAvailable = false;
            return false;
        }
    }

    async submitScore(playerName, score, followers) {
        if (this.backendAvailable) {
            try {
                const response = await fetch(`${this.baseURL}/scores`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        playerName: playerName || 'Anonymous',
                        score: score,
                        followers: followers,
                        timestamp: new Date().toISOString()
                    })
                });
                return await response.json();
            } catch (error) {
                console.error('Failed to submit score:', error);
                return this.submitScoreLocal(playerName, score, followers);
            }
        } else {
            return this.submitScoreLocal(playerName, score, followers);
        }
    }

    async getLeaderboard(limit = 10) {
        if (this.backendAvailable) {
            try {
                const response = await fetch(`${this.baseURL}/leaderboard?limit=${limit}`);
                const data = await response.json();
                return data.scores || [];
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
                return this.getLeaderboardLocal(limit);
            }
        } else {
            return this.getLeaderboardLocal(limit);
        }
    }

    // Local storage fallback methods
    submitScoreLocal(playerName, score, followers) {
        const scores = this.getLeaderboardLocal();
        scores.push({
            playerName: playerName || 'Anonymous',
            score: score,
            followers: followers,
            timestamp: new Date().toISOString()
        });
        
        // Sort and keep top 50
        scores.sort((a, b) => b.score - a.score);
        const topScores = scores.slice(0, 50);
        
        localStorage.setItem('santaRushScores', JSON.stringify(topScores));
        return { success: true, score: { score, followers } };
    }

    getLeaderboardLocal(limit = 10) {
        const scores = localStorage.getItem('santaRushScores');
        if (scores) {
            const parsed = JSON.parse(scores);
            return parsed.slice(0, limit);
        }
        return [];
    }

    getHighScore() {
        const highScore = localStorage.getItem('santaRushHighScore');
        return highScore ? parseInt(highScore) : 0;
    }

    saveHighScore(score) {
        const currentHigh = this.getHighScore();
        if (score > currentHigh) {
            localStorage.setItem('santaRushHighScore', score.toString());
            return true;
        }
        return false;
    }
}
