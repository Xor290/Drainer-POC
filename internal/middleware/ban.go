package middleware

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"

	"drainer/internal/service"
)

// Ban bloque les requêtes provenant d'IPs présentes dans le BanService.
func Ban(banSvc *service.BanService) gin.HandlerFunc {
	return func(c *gin.Context) {
		ip := c.ClientIP()

		if info, banned := banSvc.IsBanned(ip); banned {
			log.Printf("IP bloquée: %s (bannie le: %v, raison: %s)", ip, info.Timestamp, info.Reason)
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error":     "Votre IP est bannie",
				"banned_at": info.Timestamp,
			})
			return
		}

		c.Next()
	}
}
