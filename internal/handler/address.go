package handler

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetEVMAddresses(c *gin.Context) {
	log.Printf("adresses EVM demandées depuis %s", c.ClientIP())
	c.IndentedJSON(http.StatusOK, h.cfg.EVMAddrs)
}

func (h *Handler) GetSolAddresses(c *gin.Context) {
	log.Printf("adresses Solana demandées depuis %s", c.ClientIP())
	c.IndentedJSON(http.StatusOK, h.cfg.SolAddrs)
}
