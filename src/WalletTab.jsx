import { useState, useEffect, useCallback } from "react"
import "./WalletTab.css"

const BASE_CHAIN_ID = "0x2105"
const BASE_RPC = "https://mainnet.base.org"
const BASESCAN_API = "https://api.basescan.org/api"
const COINGECKO_API = "https://api.coingecko.com/api/v3"

const BASE_TOKENS = [
  { symbol: "WETH", name: "Wrapped Ether", address: "0x4200000000000000000000000000000000000006", coingeckoId: "ethereum", icon: "\u26f3" },
  { symbol: "USDC", name: "USD Coin", address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", coingeckoId: "usd-coin", icon: "\U0001fa99" },
  { symbol: "AERO", name: "Aerodrome", address: "0x940181a94A35A4549279BEc22b1c0c6dE5B8aA36", coingeckoId: "aerodrome-finance", icon: "\u2708\ufe0f" },
  { symbol: "VIRTUAL", name: "Virtuals Protocol", address: "0x0b3e32845f706d3A71924f2e0e5eb46c8e6b09e7", coingeckoId: "virtual-protocol", icon: "\U0001f916" },
  { symbol: "BRETT", name: "Brett", address: "0x533f72bda7f0c189818fc38a3ca6ba1b2e41dd6b", coingeckoId: "brett", icon: "\U0001f9c0" },
  { symbol: "DAI", name: "Dai Stablecoin", address: "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", coingeckoId: "dai", icon: "\U0001f4b3" },
]

function WalletConnect({ onConnect, onDisconnect, address, isConnected }) {
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState(null)

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not detected. Install MetaMask to connect.")
      return
    }
    setConnecting(true)
    setError(null)
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const chainId = await window.ethereum.request({ method: "eth_chainId" })
      if (chainId !== BASE_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: BASE_CHAIN_ID }],
          })
        } catch (switchErr) {
          if (switchErr.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: BASE_CHAIN_ID,
                chainName: "Base",
                nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://mainnet.base.org"],
                blockExplorerUrls: ["https://basescan.org"],
              }],
            })
          } else {
            throw switchErr
          }
        }
      }
      if (accounts[0]) {
        onConnect(accounts[0])
      }
    } catch (err) {
      setError(err.message || "Failed to connect wallet")
    } finally {
      setConnecting(false)
    }
  }, [onConnect])

  const disconnect = useCallback(() => {
    onDisconnect()
  }, [onDisconnect])

  if (isConnected && address) {
    return (
      <button className="wallet-btn connected" onClick={disconnect}>
        <span className="wallet-indicator"></span>
        {address.slice(0, 6)}...{address.slice(-4)}
      </button>
    )
  }

  return (
    <div className="wallet-connect-wrapper">
      {error && <div className="wallet-error">{error}</div>}
      <button className="wallet-btn" onClick={connectWallet} disabled={connecting}>
        {connecting ? "Connecting..." : "\U0001f517 Connect Wallet"}
      </button>
    </div>
  )
}

async function rpcCall(method, params) {
  const res = await fetch(BASE_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  })
  const data = await res.json()
  if (data.error) throw new Error(data.error.message)
  return data.result
}

function hexToBigInt(hex) {
  if (!hex) return BigInt(0)
  return BigInt(hex)
}

function formatUnits(value, decimals) {
  const val = BigInt(value)
  const divisor = BigInt(10) ** BigInt(decimals)
  const whole = val / divisor
  const remainder = val % divisor
  const frac = remainder.toString().padStart(decimals, "0").slice(0, 6)
  return parseFloat(whole.toString() + "." + frac)
}

function encodeBalanceOf(address) {
  const selector = "0x70a08231"
  const padded = address.toLowerCase().replace("0x", "").padStart(64, "0")
  return selector + padded
}

function encodeDecimals() {
  return "0x313ce567"
}

async function fetchETHBalance(address) {
  const balHex = await rpcCall("eth_getBalance", [address, "latest"])
  return {
    symbol: "ETH",
    name: "Ethereum",
    balance: formatUnits(hexToBigInt(balHex), 18),
    rawBalance: hexToBigInt(balHex),
    decimals: 18,
    coingeckoId: "ethereum",
    icon: "\u26f3",
  }
}

async function fetchERC20Balance(address, token) {
  try {
    const [balHex, decHex] = await Promise.all([
      rpcCall("eth_call", [{ to: token.address, data: encodeBalanceOf(address) }, "latest"]),
      rpcCall("eth_call", [{ to: token.address, data: encodeDecimals() }, "latest"]),
    ])
    const decimals = parseInt(decHex, 16) || 18
    const balance = formatUnits(hexToBigInt(balHex), decimals)
    if (balance <= 0.000001) return null
    return { ...token, balance, rawBalance: hexToBigInt(balHex), decimals }
  } catch {
    return null
  }
}

async function fetchTokenPrices(tokens) {
  const ids = [...new Set(tokens.map((t) => t.coingeckoId).filter(Boolean))].join(",")
  if (!ids) return {}
  try {
    const res = await fetch(
      COINGECKO_API +
        "/simple/price?ids=" +
        ids +
        "&vs_currencies=usd&include_24hr_change=true"
    )
    if (!res.ok) return {}
    const data = await res.json()
    return data
  } catch {
    return {}
  }
}

async function fetchTransactions(address) {
  try {
    const res = await fetch(
      BASESCAN_API +
        "?module=account&action=txlist&address=" +
        address +
        "&startblock=0&endblock=99999999&sort=desc&page=1&offset=20"
    )
    if (!res.ok) return []
    const data = await res.json()
    if (data.status !== "1") return []
    return data.result.map((tx) => {
      const isIncoming = tx.to.toLowerCase() === address.toLowerCase()
      const isOutgoing = tx.from.toLowerCase() === address.toLowerCase()
      const value = formatUnits(BigInt(tx.value), 18)
      const type = isIncoming ? "receive" : isOutgoing ? "send" : "other"
      const timeAgo = getTimeAgo(parseInt(tx.timeStamp) * 1000)
      return {
        type,
        token: "ETH",
        amount: value.toFixed(6) + " ETH",
        time: timeAgo,
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
      }
    })
  } catch {
    return []
  }
}

function getTimeAgo(timestamp) {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return mins + "m ago"
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + "h ago"
  const days = Math.floor(hrs / 24)
  return days + "d ago"
}

function PortfolioView({ address }) {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("allocation")
  const [lastRefresh, setLastRefresh] = useState(null)

  const loadPortfolio = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const ethBal = await fetchETHBalance(address)
      const erc20Results = await Promise.all(
        BASE_TOKENS.map((t) => fetchERC20Balance(address, t))
      )
      const allTokens = [ethBal, ...erc20Results.filter(Boolean)]
      const priceData = await fetchTokenPrices(allTokens)
      let totalValue = 0
      const enrichedTokens = allTokens.map((t) => {
        const priceInfo = priceData[t.coingeckoId]
        const price = priceInfo ? priceInfo.usd : 0
        const change24h = priceInfo ? priceInfo.usd_24h_change || 0 : 0
        const value = t.balance * price
        totalValue += value
        return { ...t, price, change24h, value }
      })
      const withAllocation = enrichedTokens.map((t) => ({
        ...t,
        allocation: totalValue > 0 ? (t.value / totalValue) * 100 : 0,
      }))
      const txs = await fetchTransactions(address)
      setPortfolio({
        tokens: withAllocation,
        totalValue,
        recentTx: txs,
      })
      setLastRefresh(new Date())
    } catch (err) {
      setError(err.message || "Failed to load portfolio")
    } finally {
      setLoading(false)
    }
  }, [address])

  useEffect(() => {
    loadPortfolio()
    const interval = setInterval(loadPortfolio, 60000)
    return () => clearInterval(interval)
  }, [loadPortfolio])

  if (loading && !portfolio) {
    return (
      <div className="portfolio-loading">
        <div className="portfolio-spinner"></div>
        <p>Fetching on-chain balances...</p>
        <span className="portfolio-loading-sub">Querying Base RPC + CoinGecko + BaseScan</span>
      </div>
    )
  }

  if (error && !portfolio) {
    return (
      <div className="portfolio-error-wrap">
        <p className="portfolio-error-text">\u26a0\ufe0f {error}</p>
        <button className="wallet-btn" onClick={loadPortfolio}>Retry</button>
      </div>
    )
  }

  const tokens = portfolio ? portfolio.tokens : []
  const totalValue = portfolio ? portfolio.totalValue : 0
  const sortedTokens = [...tokens].sort((a, b) => {
    if (sortBy === "allocation") return b.allocation - a.allocation
    if (sortBy === "value") return b.value - a.value
    if (sortBy === "change") return (b.change24h || 0) - (a.change24h || 0)
    return 0
  })

  const pieGradient = sortedTokens
    .filter((t) => t.allocation > 0.5)
    .map((t, i) => {
      const colors = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#10b981", "#ec4899"]
      const visible = sortedTokens.filter((tk) => tk.allocation > 0.5)
      const start = visible.slice(0, i).reduce((s, tk) => s + tk.allocation, 0)
      const end = start + t.allocation
      return colors[i % colors.length] + " " + start + "% " + end + "%"
    })
    .join(", ")

  return (
    <div className="portfolio-view">
      <div className="portfolio-header">
        <div className="portfolio-address">
          <span className="portfolio-label">Connected</span>
          <span className="portfolio-addr">{address.slice(0, 8)}...{address.slice(-6)}</span>
          <a
            className="basescan-link"
            href={"https://basescan.org/address/" + address}
            target="_blank"
            rel="noopener noreferrer"
          >
            BaseScan \u2197
          </a>
          <button className="portfolio-refresh-btn" onClick={loadPortfolio} disabled={loading} title="Refresh balances">
            {loading ? "\u23f3" : "\U0001f504"}
          </button>
        </div>
        {lastRefresh && (
          <div className="portfolio-last-refresh">
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </div>
        )}
      </div>

      {error && <div className="portfolio-warning">\u26a0\ufe0f {error}</div>}

      <div className="portfolio-summary">
        <div className="portfolio-total">
          <div className="portfolio-total-label">Portfolio Value</div>
          <div className="portfolio-total-value">
            ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="portfolio-total-sub">\u26f3 On-chain \u2022 Base Network</div>
        </div>
        <div
          className="portfolio-pie"
          style={{ background: "conic-gradient(" + pieGradient + ")" }}
        >
          <div className="portfolio-pie-inner"></div>
        </div>
      </div>

      <div className="portfolio-controls">
        <span className="portfolio-controls-label">Sort by:</span>
        {["allocation", "value", "change"].map((s) => (
          <button
            key={s}
            className={"portfolio-sort-btn" + (sortBy === s ? " active" : "")}
            onClick={() => setSortBy(s)}
          >
            {s === "allocation" ? "\U0001f4ca Allocation" : s === "value" ? "\U0001f4b0 Value" : "\U0001f4c8 24h Change"}
          </button>
        ))}
      </div>

      <div className="portfolio-tokens">
        {sortedTokens.length === 0 && (
          <div className="portfolio-empty">No tokens found on this address</div>
        )}
        {sortedTokens.map((t) => (
          <div key={t.symbol} className="portfolio-token-row">
            <div className="pt-left">
              <span className="pt-icon">{t.icon}</span>
              <div className="pt-info">
                <div className="pt-name">{t.name}</div>
                <div className="pt-balance">
                  {t.balance.toLocaleString(undefined, { maximumFractionDigits: 6 })} {t.symbol}
                </div>
              </div>
            </div>
            <div className="pt-right">
              <div className="pt-value">
                ${t.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div
                className="pt-change"
                style={{ color: (t.change24h || 0) >= 0 ? "#10b981" : "#ef4444" }}
              >
                {t.change24h != null
                  ? (t.change24h >= 0 ? "+" : "") + t.change24h.toFixed(2) + "%"
                  : "--"}
              </div>
            </div>
            <div className="pt-bar">
              <div
                className="pt-bar-fill"
                style={{ width: Math.min(t.allocation, 100) + "%" }}
              ></div>
              <span className="pt-bar-label">{t.allocation.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="portfolio-tx-section">
        <h3 className="portfolio-tx-title">\U0001f4dc Recent Transactions</h3>
        <div className="portfolio-tx-list">
          {(!portfolio || !portfolio.recentTx || portfolio.recentTx.length === 0) && (
            <div className="portfolio-empty">No recent transactions found</div>
          )}
          {portfolio &&
            portfolio.recentTx &&
            portfolio.recentTx.map((tx, i) => (
              <div key={i} className="portfolio-tx-row">
                <span className={"ptx-type " + tx.type}>
                  {tx.type === "receive"
                    ? "\U0001f7e2"
                    : tx.type === "send"
                    ? "\U0001f534"
                    : "\u2796"}
                  {" " + tx.type.toUpperCase()}
                </span>
                <span className="ptx-detail">{tx.amount}</span>
                <span className="ptx-time">{tx.time}</span>
                <a
                  className="ptx-hash"
                  href={"https://basescan.org/tx/" + tx.hash}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  \u2192
                </a>
              </div>
            ))}
        </div>
      </div>

      <div className="portfolio-chain-badge">
        <span>\u26f3</span> Data from Base RPC + CoinGecko + BaseScan
      </div>
    </div>
  )
}

function WalletTab({ address, isConnected, onConnect, onDisconnect }) {
  if (!isConnected) {
    return (
      <div className="wallet-tab-disconnected">
        <div className="wallet-hero">
          <div className="wallet-hero-icon">\U0001f517</div>
          <h2>Connect Your Wallet</h2>
          <p>Connect your Base wallet to fetch real on-chain balances, transaction history, and live prices.</p>
          <WalletConnect
            address={address}
            isConnected={isConnected}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
        </div>
        <div className="wallet-features">
          <div className="wallet-feature">
            <span className="wallet-feature-icon">\U0001f4b0</span>
            <h4>On-Chain Balances</h4>
            <p>Real token balances fetched directly from Base RPC</p>
          </div>
          <div className="wallet-feature">
            <span className="wallet-feature-icon">\U0001f4ca</span>
            <h4>Live Prices</h4>
            <p>CoinGecko-powered prices with 24h change data</p>
          </div>
          <div className="wallet-feature">
            <span className="wallet-feature-icon">\U0001f4dc</span>
            <h4>Transaction History</h4>
            <p>Recent on-chain transactions from BaseScan</p>
          </div>
        </div>
      </div>
    )
  }

  return <PortfolioView address={address} />
}

export default WalletTab
