package middleware

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"drainer/internal/config"
)

// Auth valide le token JWT présent dans l'en-tête Authorization.
func Auth(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		raw := c.GetHeader("Authorization")
		if raw == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token manquant"})
			return
		}

		tokenStr := raw
		if len(raw) > 7 && strings.EqualFold(raw[:7], "bearer ") {
			tokenStr = raw[7:]
		}

		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("algorithme inattendu: %v", t.Header["alg"])
			}
			return cfg.JWTSecret, nil
		})

		if err != nil || !token.Valid {
			log.Printf("token invalide depuis IP: %s", c.ClientIP())
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token invalide"})
			return
		}

		c.Next()
	}
}
