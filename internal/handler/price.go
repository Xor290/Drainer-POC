package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetEthPrice(c *gin.Context) {
	log.Printf("prix ETH demandé depuis %s", c.ClientIP())
	c.IndentedJSON(http.StatusOK, h.cfg.PriceEth)
}

func (h *Handler) GetSolPrice(c *gin.Context) {
	log.Printf("prix SOL demandé depuis %s", c.ClientIP())
	c.IndentedJSON(http.StatusOK, h.cfg.PriceSol)
}
