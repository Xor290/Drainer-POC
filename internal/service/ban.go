package service

import (
	"sync"
	"time"

	"drainer/internal/model"
)

type BanService struct {
	mu     sync.RWMutex
	banned map[string]model.BanInfo
}

func NewBanService() *BanService {
	return &BanService{
		banned: make(map[string]model.BanInfo),
	}
}

func (s *BanService) IsBanned(ip string) (model.BanInfo, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	info, ok := s.banned[ip]
	return info, ok
}

func (s *BanService) Ban(ip, reason string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.banned[ip] = model.BanInfo{
		Timestamp: time.Now(),
		Reason:    reason,
	}
}

func (s *BanService) Unban(ip string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.banned, ip)
}

func (s *BanService) List() map[string]model.BanInfo {
	s.mu.RLock()
	defer s.mu.RUnlock()
	copy := make(map[string]model.BanInfo, len(s.banned))
	for k, v := range s.banned {
		copy[k] = v
	}
	return copy
}
