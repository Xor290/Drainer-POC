package handler

import (
	"drainer/internal/config"
	"drainer/internal/service"
)

type Handler struct {
	cfg    *config.Config
	banSvc *service.BanService
	tgSvc  *service.TelegramService
}

func New(cfg *config.Config, banSvc *service.BanService, tgSvc *service.TelegramService) *Handler {
	return &Handler{
		cfg:    cfg,
		banSvc: banSvc,
		tgSvc:  tgSvc,
	}
}
