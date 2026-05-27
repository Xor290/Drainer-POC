package handler

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"drainer/internal/model"
)

func (h *Handler) Login(c *gin.Context) {
	var req model.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "requête invalide"})
		return
	}

	if req.Username != h.cfg.AdminUsername || req.Password != h.cfg.AdminPassword {
		log.Printf("échec login depuis %s (user: %s)", c.ClientIP(), req.Username)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "identifiants incorrects"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username": req.Username,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
		"iat":      time.Now().Unix(),
	})

	signed, err := token.SignedString(h.cfg.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erreur de signature"})
		return
	}

	log.Printf("login réussi depuis %s (user: %s)", c.ClientIP(), req.Username)
	c.JSON(http.StatusOK, model.LoginResponse{Token: signed})
}
