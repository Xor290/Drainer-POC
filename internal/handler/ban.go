package handler

import (
	"log"
	"net"
	"net/http"

	"github.com/gin-gonic/gin"

	"drainer/internal/model"
)

func (h *Handler) BanIP(c *gin.Context) {
	var req model.BanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "requête invalide"})
		return
	}

	if net.ParseIP(req.IP) == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "adresse IP invalide"})
		return
	}

	h.banSvc.Ban(req.IP, req.Reason)
	log.Printf("IP bannie: %s (raison: %s) par admin depuis %s", req.IP, req.Reason, c.ClientIP())

	c.JSON(http.StatusOK, gin.H{
		"message": "IP bannie avec succès",
		"ip":      req.IP,
		"reason":  req.Reason,
	})
}
