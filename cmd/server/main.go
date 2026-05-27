package main

import (
	"log"

	"drainer/internal/config"
	"drainer/internal/router"
	"drainer/internal/service"
)

func main() {
	cfg := config.Load()

	banSvc := service.NewBanService()
	tgSvc := service.NewTelegramService(cfg)

	r := router.New(cfg, banSvc, tgSvc)

	log.Printf("Serveur démarré sur le port %s", cfg.Port)
	log.Fatal(r.Run(":" + cfg.Port))
}
