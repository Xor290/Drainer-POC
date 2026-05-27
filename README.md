# 🔬 Crypto Wallet Drainers — Analyse théorique & défense

## Vidéo

<video width="600" controls>
  <source src="assets/poc_drainer.mp4" type="video/mp4">
</video>


> Document de recherche en sécurité Web3 · Usage éducatif uniquement

---

## Table des matières

1. [Qu'est-ce qu'un wallet drainer ?](#1-quest-ce-quun-wallet-drainer-)
2. [Surface d'attaque](#2-surface-dattaque)
3. [Architecture typique](#3-architecture-typique)
4. [Vecteurs d'infection](#4-vecteurs-dinfection)
5. [Mécanismes techniques](#5-mécanismes-techniques)
   - 5.1 [Détection du wallet](#51-détection-du-wallet)
   - 5.2 [Connexion & consentement](#52-connexion--consentement)
   - 5.3 [Extraction des fonds (EVM)](#53-extraction-des-fonds-evm)
   - 5.4 [Extraction des fonds (Solana)](#54-extraction-des-fonds-solana)
   - 5.5 [Techniques d'évasion](#55-techniques-dévasion)
   - 5.6 [Exfiltration des données](#56-exfiltration-des-données)
6. [Infrastructure C2](#6-infrastructure-c2)
7. [Indicateurs de compromission (IOC)](#7-indicateurs-de-compromission-ioc)
8. [Défenses & recommandations](#8-défenses--recommandations)
9. [Ressources complémentaires](#9-ressources-complémentaires)
10. [Disclaimer](#10-disclaimer)

---

## 1. Qu'est-ce qu'un wallet drainer ?

Un **wallet drainer** est un script malveillant injecté dans une page web dont l'objectif est de vider automatiquement les fonds d'un portefeuille crypto sans que la victime comprenne ce qui se passe.

Il se distingue d'autres formes de vol crypto par :

| Caractéristique | Drainer | Phishing classique | Clipboard hijacker |
|---|---|---|---|
| Vol de clé privée | Non (optionnel) | Oui | Non |
| Interaction victime requise | Minimale | Oui | Non |
| Réseau ciblé | EVM, Solana, etc. | Tous | Tous |
| Vitesse d'exécution | Immédiate | Différée | Différée |
| Difficulté de détection | Élevée | Moyenne | Faible |

Les drainers sont devenus industrialisés à partir de 2022 avec l'essor des NFT et des DeFi, donnant naissance à des kits vendus sous forme de **Drainer-as-a-Service (DaaS)**.

---

## 2. Surface d'attaque

```
Victime
  └─► Visite une page malveillante (phishing, typosquatting, pub malveillante…)
        └─► Script drainer chargé dans le navigateur
              └─► Interagit avec l'extension wallet de la victime (MetaMask, Phantom…)
                    └─► Transactions signées → fonds transférés vers attaquant
```

**Points d'entrée courants :**
- Sites de mint NFT frauduleux
- Faux portails DeFi / airdrops
- Liens dans des tweets/discords de comptes compromis
- Publicités Google / X ciblant des termes Web3
- Extensions de navigateur malveillantes

---

## 3. Architecture typique

Un drainer complet se compose généralement de trois couches :

```mermaid
flowchart TD

  subgraph LAYER0["👤 Attaquant"]
    ATK(["Opérateur"])
    PANEL["🖥️ Panel admin\nJWT protégé"]
    ATK -- "connexion admin" --> PANEL
  end

  subgraph LAYER1["🖥️ Serveur C2"]
    direction LR
    subgraph C2CORE["Cœur C2"]
      C2_DEST["📋 Adresses\ndestination\n+ répartition %"]
      C2_BAN["🚫 Gestion\nbans IP"]
      C2_RPC["🔄 Proxy\nJSON-RPC"]
      C2_LOG["📝 Relay\nnotifications"]
    end
    subgraph NOTIF["📲 Canaux de notification"]
      N1["Telegram Bot"]
      N2["Discord Webhook"]
      N3["Email / Panel"]
    end
    C2_LOG --> N1 & N2 & N3
  end

  subgraph LAYER2["🌐 Frontend — servi à la victime"]
    direction LR
    FE1["🎭 UI légitime\nen apparence"]
    FE2["🔍 Détection\nwallet"]
    FE3["🛡️ Anti-debug\nÉvasion"]
    FE4["💸 Drain\nEVM"]
    FE5["💸 Drain\nSolana"]
    FE6["📡 Appels\nC2 /api/*"]
  end

  subgraph LAYER3["👤 Victime — Navigateur"]
    direction LR
    W1["🦊 MetaMask\nCoinbase · Brave…"]
    W2["👻 Phantom\nSolflare · Slope…"]
    W3["window.ethereum\nwindow.solana"]
    W1 & W2 -- "injecte" --> W3
  end

  subgraph LAYER4["⛓️ Blockchain"]
    direction LR
    BC1["Ethereum · BSC\nPolygon · Avalanche · Base"]
    BC2["Solana"]
  end

  %% Flux vertical principal
  PANEL      -- "configure destinations\nbans · RPC" --> C2CORE
  C2CORE     -- "sert le payload JS"                 --> LAYER2
  W3         -- "window.ethereum/solana détecté"     --> FE2
  FE2        --> FE1 & FE3 & FE4 & FE5 & FE6
  FE6        -- "POST /api/*"                        --> C2_LOG
  FE6        -- "GET destinations"                   --> C2_DEST
  FE6        -- "POST /rpc/:chainId"                 --> C2_RPC
  FE4        -- "sendTransaction"                    --> BC1
  FE5        -- "signTransaction"                    --> BC2
  C2_RPC     -- "proxy JSON-RPC"                     --> BC1 & BC2

  %% Styles par couche
  style LAYER0 fill:#1e1010,stroke:#ff4444,color:#ffcccc
  style LAYER1 fill:#10101e,stroke:#4444ff,color:#ccccff
  style LAYER2 fill:#101e10,stroke:#44cc44,color:#ccffcc
  style LAYER3 fill:#1e1a10,stroke:#ffaa00,color:#fff0cc
  style LAYER4 fill:#101e1e,stroke:#00cccc,color:#ccffff
  style NOTIF  fill:#1e1018,stroke:#cc44cc,color:#ffccff
  style C2CORE fill:#10101e,stroke:#6666ff,color:#ccccff
```

---

## 4. Vecteurs d'infection

### 4.1 Compromission de sites légitimes
Des attaquants injectent le script dans des sites existants via :
- Vulnérabilités CMS (WordPress, plugins)
- Supply chain (bibliothèques npm malveillantes)
- Compromission d'accès FTP/SSH

### 4.2 Sites clonés (phishing)
Réplication visuelle d'un site connu (Uniswap, OpenSea, etc.) avec un domaine similaire (typosquatting, IDN homograph).

### 4.3 Publicité malveillante (Malvertising)
Des annonces payantes redirigent vers des pages de drain après un clic. Particulièrement efficace car les victimes font confiance aux résultats sponsorisés.

### 4.4 Ingénierie sociale
- Faux airdrops sur les réseaux sociaux
- Comptes officiels de projets piratés (Twitter/Discord)
- Faux support technique demandant de "valider" son wallet

### 4.5 Surface d'attaque — Cartographie complète

```mermaid
mindmap
  root((🎯 Surface\nd'attaque\nDrainer))
    🌐 Couche réseau
      DNS Typosquatting
        uniswop.org
        0penSea.io
        IDN homographes
      CDN / Supply chain
        npm malveillant
        Polyfill.io compromis
        jsDelivr poisoning
      TLS / Certificats
        Cert Let's Encrypt auto
        Faux cadenas HTTPS
    🖥️ Couche application
      Injection dans site légitime
        XSS stocké
        Compromission FTP/SSH
        Plugin WordPress backdooré
      Page clonée
        Clone visuel parfait
        Même UX / même CSS
      Script tiers malveillant
        Analytics remplacé
        Widget de chat piégé
    🧠 Couche sociale
      Réseaux sociaux
        Compte Twitter piraté
        Discord serveur officiel
        Telegram groupe fake
      Publicité
        Google Ads sponsored
        X Ads ciblage Web3
        Bannières DeFi
      Email / DM
        Faux airdrop
        Faux support NFT
        Faux partenariat
    🔌 Couche wallet
      API window.ethereum
        eth_requestAccounts
        eth_sign vulnérable
        personal_sign
      Signatures silencieuses
        Permit EIP-2612
        setApprovalForAll
        SignTypedData v4
      API window.solana
        connect
        signTransaction
        signAllTransactions
    🔒 Couche utilisateur
      Manque de vigilance URL
      Confiance aux popups wallet
      Fatigue des signatures
      Pas de wallet hardware
      Pas de révocation approvals
```

---

### 4.6 Matrice des vecteurs × cibles

```mermaid
quadrantChart
    title Vecteurs d'attaque — Impact vs Facilité de déploiement
    x-axis Difficile à déployer --> Facile à déployer
    y-axis Faible impact --> Impact élevé

    quadrant-1 Priorité haute
    quadrant-2 Sophistiqué
    quadrant-3 Peu pertinent
    quadrant-4 Volume

    Phishing Discord/Twitter: [0.85, 0.80]
    Faux site mint NFT: [0.75, 0.85]
    Google Ads malveillant: [0.65, 0.75]
    Supply chain npm: [0.20, 0.95]
    XSS site légitime: [0.25, 0.90]
    Faux support DM: [0.90, 0.55]
    Plugin WordPress: [0.40, 0.70]
    Email phishing: [0.80, 0.45]
    Extension navigateur: [0.30, 0.80]
    IDN Homographe: [0.55, 0.65]
```

---

## 5. Mécanismes techniques

### 5.1 Détection du wallet

Le script inspecte les objets JavaScript injectés par les extensions wallet :

- `window.ethereum` → wallets EVM (MetaMask, Coinbase, Brave, Rainbow…)
- `window.solana` → Phantom, Solflare, Slope…
- `window.bitcoin` → wallets BTC natifs

Les propriétés de ces objets (`isMetaMask`, `isTrust`, etc.) permettent d'identifier précisément le wallet pour adapter le comportement du drainer.

### 5.2 Connexion & consentement

Le drainer invoque l'API standard du wallet :
- **EVM** : `eth_requestAccounts` → affiche une popup de connexion **légitime** dans l'extension
- **Solana** : `window.solana.connect()` → idem

⚠️ **Point clé** : la victime voit une vraie popup de son extension — rien d'anormal en apparence. Le consentement à "connecter" son wallet est distinct du consentement à signer des transactions.

### 5.3 Extraction des fonds (EVM)

Après connexion, le drainer récupère le solde et construit une transaction :

```
1. Récupérer le solde natif (ETH, BNB, MATIC…)
2. Calculer les frais de gas
3. Soustraire les frais du solde → montant à voler
4. Construire une transaction vers l'adresse de l'attaquant
5. Appeler signer.sendTransaction() → popup de confirmation dans le wallet
```

Des variantes plus sophistiquées utilisent :
- **`eth_sign` / `personal_sign`** : contournement sans popup de transaction (déprécié mais encore exploité)
- **`Permit` / EIP-2612** : signature hors-chaîne qui autorise un tiers à dépenser des tokens ERC-20
- **`setApprovalForAll`** : approuve le transfert de tous les NFTs d'une collection en une signature
- **Multicall** : regroupe plusieurs transferts en une seule transaction pour vider tokens + NFTs simultanément

### 5.4 Extraction des fonds (Solana)

Sur Solana, le mécanisme diffère :

```
1. Connexion via window.solana.connect()
2. Récupération du solde (lamports)
3. Construction d'une Transaction avec SystemProgram.transfer()
4. Ajout d'instructions pour chaque token SPL éventuel
5. window.solana.signTransaction() → signature par la victime
6. Envoi sur le réseau : sendRawTransaction()
```

Les drainers Solana exploitent aussi les **versioned transactions** (v0) avec des Address Lookup Tables pour obfusquer les destinations.

### 5.5 Techniques d'évasion

Les drainers intègrent plusieurs couches pour résister à l'analyse :

#### Anti-debug
- **Boucle `debugger`** : l'instruction est répétée en continu (ex: toutes les 50ms). Si les DevTools sont ouverts, l'exécution se fige.
- **Détection par timing** : mesure du delta d'exécution autour d'un `debugger`. Un délai > 100ms trahit l'ouverture des DevTools.
- **`toString()` override sur RegExp** : dans Chromium, `console.log(/regexp/)` appelle `toString()` uniquement si les DevTools sont ouverts.
- **`Image.id` getter** : même principe — le getter est déclenché par l'affichage dans la console.
- **Détection par taille de fenêtre** : `outerWidth - innerWidth > N` indique un panneau DevTools docked.

En cas de détection, le script peut :
- Vider le DOM (`document.documentElement.innerHTML = ""`)
- Rediriger vers `about:blank`
- Bannir l'IP via le backend C2

#### Filtrage géographique
Certains drainers bloquent des locales spécifiques (`ru-RU`, `be-BY`, etc.) pour éviter de cibler des ressortissants de certains pays — stratégie visant à réduire l'exposition légale dans les juridictions de l'opérateur.

#### Obfuscation du code
- Minification + mangling des noms de variables
- Encodage base64 / XOR des chaînes sensibles
- Chargement dynamique des dépendances

### 5.6 Exfiltration des données

Chaque événement est typiquement remonté à l'attaquant en temps réel :
- Visite d'un nouveau "lead" (IP, user-agent, langue)
- Wallet connecté (type, adresse, solde)
- Transaction envoyée (hash, montant en USD)
- Erreur ou blocage détecté

Le canal d'exfiltration le plus répandu est un **bot Telegram** pour sa simplicité d'intégration et sa gratuité.

---

## 6. Infrastructure C2

Le serveur de commande et contrôle joue plusieurs rôles :

| Rôle | Description |
|---|---|
| **Stockage des destinations** | Adresses wallet de l'attaquant avec répartition en % |
| **Proxy RPC** | Relaie les appels JSON-RPC vers des nœuds blockchain (Alchemy, Infura…), masquant la clé API au client |
| **Gestion des bans** | Bloque les IPs des analystes/chercheurs |
| **Notification** | Transmet les alertes vers Telegram/Discord |
| **Panel admin** | Interface de gestion protégée par JWT |

Le proxy RPC est une technique notable : plutôt que d'exposer la clé API dans le JS frontend (où elle serait visible), le backend la stocke côté serveur et proxy les requêtes. Cela complique aussi le suivi des adresses de destination par les victimes.

### Architecture interne du C2

```mermaid
flowchart LR

  subgraph INTERNET["🌐 Internet — côté victime"]
    VICTIM["Navigateur victime\nPayload JS chargé"]
  end

  subgraph C2["🖥️ Serveur C2 — Go / Node / PHP"]
    direction TB

    subgraph PUBLIC_API["Routes publiques /api/*"]
      R1["POST /api/sendMessage\n→ Telegram relay"]
      R2["GET /api/evm\n→ Adresses EVM destination"]
      R3["GET /api/solana\n→ Adresses SOL destination"]
      R4["POST /api/rpc/:chainId\n→ Proxy JSON-RPC"]
      R5["GET /api/price_eth\n→ Prix ETH temps réel"]
      R6["GET /api/price_sol\n→ Prix SOL temps réel"]
    end

    subgraph AUTH["Route auth /auth/*"]
      R7["POST /auth/login\n→ JWT token"]
    end

    subgraph PROTECTED["Routes protégées /protected/*\n🔒 JWT requis"]
      R8["POST /protected/ban\n→ Bannir une IP"]
    end

    subgraph MIDDLEWARE["Middleware stack"]
      M1["CORS"]
      M2["Security headers\nHSTS · X-Frame · XSS"]
      M3["Ban check\n→ vérifie IP bannies"]
      M4["Auth JWT\n→ routes protégées"]
      M5["Logger / Recovery"]
    end

    subgraph STORAGE["Stockage en mémoire"]
      S1["Map bannedIPs\n{IP → timestamp + raison}"]
      S2["[]EvmAddress\n{address, percent}"]
      S3["[]SolAddress\n{address, percent}"]
      S4["[]ChainEvm\n{chainId, RPC URL}"]
    end
  end

  subgraph EXTERNAL["☁️ Services externes"]
    EXT1["api.telegram.org\n→ Notification attaquant"]
    EXT2["Alchemy / Infura\n→ Nœuds blockchain"]
    EXT3["CoinGecko API\n→ Prix ETH/SOL"]
    EXT4["Blockchain mainnet\n→ Confirmation tx"]
  end

  subgraph ATTACKER["👤 Attaquant"]
    ADM["Panel admin\nnavigateur"]
    TG["📲 Telegram\nalerte temps réel"]
  end

  VICTIM -->|"POST wallet info"| R1
  VICTIM -->|"GET destinations"| R2
  VICTIM -->|"GET destinations"| R3
  VICTIM -->|"POST JSON-RPC"| R4
  VICTIM -->|"GET prix"| R5
  VICTIM -->|"GET prix"| R6

  M1 --> M2 --> M3 --> M4
  M3 --> S1

  R1 --> EXT1 --> TG
  R2 --> S2
  R3 --> S3
  R4 --> EXT2 --> EXT4
  R5 & R6 --> EXT3

  ADM -->|"POST /auth/login"| R7
  R7 -->|"Bearer JWT"| ADM
  ADM -->|"POST /protected/ban\n+ Authorization: Bearer"| R8
  R8 --> S1

  style PUBLIC_API fill:#1a2a1a,stroke:#44aa44
  style AUTH fill:#1a1a2a,stroke:#4444aa
  style PROTECTED fill:#2a1a1a,stroke:#aa4444
  style MIDDLEWARE fill:#2a2a1a,stroke:#aaaa44
  style STORAGE fill:#1a2a2a,stroke:#44aaaa
  style EXTERNAL fill:#2a1a2a,stroke:#aa44aa
  style ATTACKER fill:#2a1a1a,stroke:#ff4444
```

---

## 7. Indicateurs de compromission (IOC)

### Dans le code JS d'une page suspecte
- Présence de `window.ethereum`, `window.solana` combinée à `sendTransaction` ou `signTransaction`
- Appels vers des domaines inconnus avec des payloads JSON contenant des adresses ETH/SOL
- Boucles `setInterval` avec `debugger`
- Surcharge de `toString()` sur des objets RegExp ou Image

### Comportement réseau
- Requêtes POST vers `/api/sendMessage` ou `/api/rpc/:chainId`
- Trafic vers `api.telegram.org/bot<token>/sendMessage`
- Appels vers CoinGecko API (`/simple/price`) depuis une page qui n'en a pas besoin

### Dans le wallet
- Popup de transaction non sollicitée après simple connexion
- Transaction vers une adresse inconnue avec 100% du solde
- Demande `setApprovalForAll` sur une collection NFT

---

## 8. Défenses & recommandations

### Pour les utilisateurs

| Mesure | Efficacité |
|---|---|
| Ne jamais connecter son wallet sur un lien reçu | ⭐⭐⭐⭐⭐ |
| Vérifier l'URL exacte avant toute interaction | ⭐⭐⭐⭐⭐ |
| Utiliser un wallet hardware (Ledger, Trezor) | ⭐⭐⭐⭐⭐ |
| Lire attentivement chaque popup de signature | ⭐⭐⭐⭐ |
| Révoquer les approvals inutiles (revoke.cash) | ⭐⭐⭐⭐ |
| Utiliser un wallet dédié aux interactions DeFi (cold/hot separation) | ⭐⭐⭐⭐ |
| Extensions de protection (Pocket Universe, Fire, Wallet Guard) | ⭐⭐⭐ |

### Pour les développeurs / équipes sécurité

- **Analyse statique** : scanner les bundles JS à la recherche de patterns drainer (ethers + `sendTransaction` + `debugger` loop)
- **CSP stricte** : bloquer les scripts tiers non autorisés via Content-Security-Policy
- **Monitoring des domaines** : surveiller les typosquats de son propre domaine (dnstwist, CertStream)
- **Audit des dépendances npm** : les supply chain attacks via packages malveillants sont en hausse
- **Éducation des utilisateurs** : communiquer clairement sur ce que votre site demande (ou ne demande pas)

### Pour les chercheurs en sécurité

- **Sandbox d'analyse** : utiliser un navigateur isolé sans wallet réel — les drainers vérifient souvent si `window.ethereum` est présent avant d'agir
- **Désactiver le JS sélectivement** : identifier quelles requêtes réseau sont initiées par le script
- **Rejouer avec de faux providers** : simuler `window.ethereum` avec un mock pour observer le comportement sans risque

---

## 9. Schémas de flux

### 9.1 Vue d'ensemble — Cycle de vie d'une attaque

```mermaid
flowchart TD
    subgraph INFECTION["🎣 VECTEUR D'INFECTION"]
        A1[Faux site de mint NFT]
        A2[Lien phishing Discord/Twitter]
        A3[Pub malveillante Google/X]
        A4[Site légitime compromis]
    end

    subgraph VICTIM["👤 NAVIGATEUR VICTIME"]
        B1[Visite la page malveillante]
        B2{window.ethereum\nou window.solana\ndétecté ?}
        B3[Identifie le type de wallet\nMetaMask · Phantom · etc.]
        B4[Popup de CONNEXION wallet\n✅ légitime en apparence]
        B5[Victime accepte la connexion]
        B6[Script récupère adresse\net solde]
    end

    subgraph EVASION["🛡️ ÉVASION & ANTI-ANALYSE"]
        C1[Boucle debugger 50ms]
        C2[Détection timing DevTools]
        C3[Filtrage géographique\npar locale navigateur]
        C4{Analyste\ndétecté ?}
        C5[Vide le DOM\nRedirige about:blank\nBan IP via C2]
    end

    subgraph DRAIN["💸 EXTRACTION DES FONDS"]
        D1{Type de chaîne}
        D2[EVM — eth_requestAccounts\nCalcul solde - gas\nsigner.sendTransaction]
        D3[Solana — solana.connect\nSystemProgram.transfer\nsignTransaction]
        D4[Popup de TRANSACTION wallet\n⚠️ victime doit signer]
        D5[Victime signe\nou est trompée]
        D6[Transaction broadcastée\nsur le réseau blockchain]
    end

    subgraph C2["🖥️ SERVEUR C2 ATTAQUANT"]
        E1[Stockage adresses\nde destination]
        E2[Proxy RPC\ncaché côté serveur]
        E3[Gestion ban IPs]
        E4[API Notification]
    end

    subgraph BLOCKCHAIN["⛓️ BLOCKCHAIN"]
        F1[Transaction confirmée\nfonds transférés]
        F2[Wallet attaquant\ncrédité]
    end

    subgraph NOTIF["📲 NOTIFICATION ATTAQUANT"]
        G1[Bot Telegram]
        G2[Alerte en temps réel\nIP · Wallet · Solde · TX hash]
    end

    A1 & A2 & A3 & A4 --> B1
    B1 --> C1 & C2 & C3
    C1 & C2 & C3 --> C4
    C4 -- Oui --> C5
    C4 -- Non --> B2
    B2 -- Non --> B1
    B2 -- Oui --> B3 --> B4 --> B5 --> B6
    B6 --> D1
    D1 -- EVM --> D2
    D1 -- Solana --> D3
    D2 & D3 --> D4 --> D5 --> D6
    D6 --> F1 --> F2
    E1 & E2 --> D2 & D3
    E3 --> C5
    D6 --> E4 --> G1 --> G2

    style INFECTION fill:#2d1b1b,stroke:#ff4444,color:#ffaaaa
    style VICTIM fill:#1b2d1b,stroke:#44ff44,color:#aaffaa
    style EVASION fill:#1b1b2d,stroke:#4444ff,color:#aaaaff
    style DRAIN fill:#2d2d1b,stroke:#ffff44,color:#ffffaa
    style C2 fill:#2d1b2d,stroke:#ff44ff,color:#ffaaff
    style BLOCKCHAIN fill:#1b2d2d,stroke:#44ffff,color:#aaffff
    style NOTIF fill:#2d1b1b,stroke:#ff8844,color:#ffccaa
```

---

### 9.2 Zoom — Techniques d'évasion anti-analyse

```mermaid
flowchart LR
    subgraph DETECTION["Détection active"]
        T1["⏱️ Timing attack\nperformance.now() autour de debugger\nΔ > 100ms = DevTools ouvert"]
        T2["🔁 Boucle debugger\nsetInterval(() => debugger, 50ms)\nFreeze si DevTools actifs"]
        T3["🖼️ Image.id getter\nconsole.log(img) déclenche\nle getter uniquement avec DevTools"]
        T4["📐 Taille de fenêtre\nouterWidth - innerWidth > 100px\n= panneau DevTools docked"]
        T5["🌍 Locale navigateur\nnavigator.languages filtrés\nbloque certaines régions"]
    end

    subgraph REACTION["Réaction"]
        R1["DOM.innerHTML = ''"]
        R2["location.href = 'about:blank'"]
        R3["POST /api/ban → IP bannie"]
        R4["Alerte Telegram à l'attaquant"]
    end

    T1 & T2 & T3 & T4 & T5 --> REACTION
    R1 & R2 --> REACTION
```

---

### 9.3 Zoom — Techniques de drain avancées (EVM)

```mermaid
flowchart TD
    START([Wallet connecté]) --> Q1{Méthode de drain}

    Q1 --> M1["💰 Native transfer\nVide ETH/BNB/MATIC\nRequiert signature visible"]
    Q1 --> M2["🪙 ERC-20 Permit\nSignature hors-chaîne EIP-2612\nPas de tx visible pour la victime"]
    Q1 --> M3["🖼️ setApprovalForAll\nAutorise transfert de TOUS les NFTs\nUne seule signature"]
    Q1 --> M4["📦 Multicall\nRegroupe ETH + tokens + NFTs\nEn une seule transaction"]

    M1 --> TX[Transaction on-chain]
    M2 --> TX
    M3 --> TX
    M4 --> TX

    TX --> SPLIT["Répartition entre\nplusieurs wallets attaquant\n(% configurables)"]
    SPLIT --> LAUNDER["Mixage / Bridge\nvers d'autres chaînes"]

    style M2 fill:#3d1b1b,stroke:#ff4444
    style M3 fill:#3d1b1b,stroke:#ff4444
    style M4 fill:#3d1b1b,stroke:#ff4444
```

---

## 10. Ressources complémentaires

- [SlowMist — Drainer incident reports](https://slowmist.com)
- [Chainalysis — Crypto Crime Report](https://go.chainalysis.com/crypto-crime-report.html)
- [revoke.cash](https://revoke.cash) — Révocation des approvals EVM
- [Wallet Guard](https://www.walletguard.app) — Extension de protection
- [EIP-2612 (Permit)](https://eips.ethereum.org/EIPS/eip-2612) — Spécification technique
- [Blockchain Threat Intelligence](https://bti.live) — IOC Web3

---

## 10. Disclaimer

> **Ce document est fourni à des fins éducatives et de recherche en cybersécurité uniquement.**
>
> Son contenu vise à aider les chercheurs, développeurs, et équipes de sécurité à **comprendre, détecter et prévenir** les attaques de type wallet drainer, et non à les reproduire.
>
> Aucune implémentation fonctionnelle n'est fournie dans ce document. La création, la distribution ou l'utilisation d'un wallet drainer contre des victimes réelles constitue une infraction pénale dans la quasi-totalité des juridictions (fraude informatique, vol, accès non autorisé à un système).
>
> L'auteur décline toute responsabilité quant à l'utilisation malveillante des informations contenues dans ce document.

---

*Contribuez à rendre l'écosystème Web3 plus sûr — signalez les sites de phishing sur [phishtank.org](https://phishtank.org) et [cryptoscamdb.org](https://cryptoscamdb.org).*
