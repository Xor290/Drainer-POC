package model

import "time"

// ── Adresses de destination ───────────────────────────────────────────────────

type EvmAddress struct {
	ID         string `json:"id"`
	EthAddress string `json:"address_eth"`
	Percent    int    `json:"percent"`
}

type SolAddress struct {
	ID         string `json:"id"`
	SolAddress string `json:"address_sol"`
	Percent    int    `json:"percent"`
}

// ── Chaînes / RPC providers ───────────────────────────────────────────────────

type ChainEvm struct {
	ID       string `json:"id"`
	Provider string `json:"provider"`
}

type ChainSol struct {
	SolProvider string `json:"sol_provider"`
}

// ── Prix ──────────────────────────────────────────────────────────────────────

type GetEthPrice struct {
	EthPrice string `json:"eth_price"`
}

type GetSolPrice struct {
	SolPrice string `json:"sol_price"`
}

// ── Ban ───────────────────────────────────────────────────────────────────────

type BanRequest struct {
	IP     string `json:"ip"     binding:"required"`
	Reason string `json:"reason" binding:"omitempty"`
}

type BanInfo struct {
	Timestamp time.Time `json:"timestamp"`
	Reason    string    `json:"reason"`
}

// ── Telegram ──────────────────────────────────────────────────────────────────

type TelegramRequest struct {
	Message string `json:"message" binding:"required,min=1,max=4096"`
}
