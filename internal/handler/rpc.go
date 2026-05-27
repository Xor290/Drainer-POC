package handler

import (
	"bytes"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) RPCProxy(c *gin.Context) {
	chainID := c.Param("chainId")

	var providerURL string
	for _, ch := range h.cfg.EVMChains {
		if ch.ID == chainID {
			providerURL = ch.Provider
			break
		}
	}

	if providerURL == "" {
		c.JSON(http.StatusNotFound, gin.H{"error": "chaîne non supportée"})
		return
	}

	body, err := io.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "corps de requête invalide"})
		return
	}

	resp, err := http.Post(providerURL, "application/json", bytes.NewReader(body))
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": "provider injoignable"})
		return
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "erreur lecture réponse"})
		return
	}

	c.Data(resp.StatusCode, "application/json", respBody)
}
