package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetChainEVM(c *gin.Context) {
	log.Printf("chaînes EVM demandées depuis %s", c.ClientIP())
	c.IndentedJSON(http.StatusOK, h.cfg.EVMChains)
}

func (h *Handler) GetChainSol(c *gin.Context) {
	log.Printf("chaînes Solana demandées depuis %s", c.ClientIP())
	c.IndentedJSON(http.StatusOK, h.cfg.SolChains)
}
