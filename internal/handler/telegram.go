package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"drainer/internal/model"
)

func (h *Handler) SendMessage(c *gin.Context) {
	var req model.TelegramRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "requête invalide"})
		return
	}

	if err := h.tgSvc.Send(req.Message); err != nil {
		log.Printf("telegram: erreur envoi depuis %s: %v", c.ClientIP(), err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "échec envoi"})
		return
	}

	log.Printf("telegram: message envoyé depuis %s", c.ClientIP())
	c.Status(http.StatusOK)
}
