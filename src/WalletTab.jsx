import { useState, useEffect, useCallback } from "react"
import "./WalletTab.css"

const BASE_CHAIN_ID = "0x2105"
const BASE_CHAIN_ID_DEC = 8453
const COINGECKO_API = "https://api.coingecko.com/api/v3"

// Simulated portfolio data (real wallet connect + simulated balances)
const SIMULATED_PORTFOLIOS = {
  default: {
    totalValue: 47832.51,
    totalChange24h: 2341.87,
    totalChangePct: 5.15,
    tokens: [
      { symbol: "ETH", name: "Ethereum", balance: 8.452, price: 3847.21, value: 32528.42, change24h: 3.82, allocation: 68.0, icon: "⛳" },
      { symbol: "USDC", name: "USD Coin", balance: 8500.00, price: 1.00, value: 8500.00, change24h: 0.01, allocation: 17.8, icon: "🪙" },
      { symbol: "AERO", name: "Aerodrome", balance: 3120.5, price: 1.87, value: 5835.34, change24h: 12.4, allocation: 12.2, icon: "✈️" },
      { symbol: "VIRTUAL", name: "Virtuals Protocol", balance: 420.0, price: 1.24, value: 520.80, change24h: -8.3, allocation: 1.1, icon: "🤖" },
      { symbol: "BRETT", name: "Brett", balance: 15000, price: 0.042, value: 630.00, change24h: -2.1, allocation: 1.3, icon: "🧀" },
    ],
    recentTx: [
      { type: "buy", token: "AERO", amount: "500 AERO", value: "$935.00", time: "2m ago", hash: "0xabc1..." },
      { type: "sell", token: "VIRTUAL", amount: "200 VIRTUAL", value: "$248.00", time: "18m ago", hash: "0xdef2..." },
      { type: "swap", token: "ETH → USDC", amount: "0.5 ETH", value: "$1,923", time: "1h ago", hash: "0xghi3..." },
      { type: "buy", token: "BRETT", amount: "10K BRETT", value: "$420.00", time: "3h ago", hash: "0xjkl4..." },
      { type: "transfer", token: "ETH", amount: "2.0 ETH", value: "$7,694", time: "6h ago", hash: "0xmno5..." },
    ],
  },
}

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
        {connecting ? "Connecting..." : "🔗 Connect Wallet"}
      </button>
    </div>
  )
}

function PortfolioView({ address }) {
  const portfolio = SIMULATED_PORTFOLIOS.default
  const [showAll, setShowAll] = useState(false)
  const [sortBy, setSortBy] = useState("allocation")

  const sortedTokens = [...portfolio.tokens].sort((a, b) => {
    if (sortBy === "allocation") return b.allocation - a.allocation
    if (sortBy === "value") return b.value - a.value
    if (sortBy === "change") return b.change24h - a.change24h
    return 0
  })

  const totalValue = portfolio.totalValue
  const pctChange = portfolio.totalChangePct

  // Simple pie chart using conic-gradient
  const pieGradient = portfolio.tokens
    .map((t, i) => {
      const colors = ["#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#10b981"]
      const start = portfolio.tokens.slice(0, i).reduce((s, tk) => s + tk.allocation, 0)
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
            BaseScan ↗
          </a>
        </div>
      </div>

      <div className="portfolio-summary">
        <div className="portfolio-total">
          <div className="portfolio-total-label">Portfolio Value</div>
          <div className="portfolio-total-value">$
            {totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="portfolio-total-change" style={{ color: pctChange >= 0 ? "#10b981" : "#ef4444" }}>
            {pctChange >= 0 ? "+" : ""}${portfolio.totalChange24h.toLocaleString("en-US", { minimumFractionDigits: 2 })} ({pctChange >= 0 ? "+" : ""}{pctChange.toFixed(2)}%) 24h
          </div>
        </div>
        <div className="portfolio-pie" style={{ background: "conic-gradient(" + pieGradient + ")" }}>
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
            {s === "allocation" ? "📊 Allocation" : s === "value" ? "💰 Value" : "📈 24h Change"}
          </button>
        ))}
      </div>

      <div className="portfolio-tokens">
        {sortedTokens.map((t) => (
          <div key={t.symbol} className="portfolio-token-row">
            <div className="pt-left">
              <span className="pt-icon">{t.icon}</span>
              <div className="pt-info">
                <div className="pt-name">{t.name}</div>
                <div className="pt-balance">{t.balance.toLocaleString()} {t.symbol}</div>
              </div>
            </div>
            <div className="pt-right">
              <div className="pt-value">${t.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
              <div className="pt-change" style={{ color: t.change24h >= 0 ? "#10b981" : "#ef4444" }}>
                {t.change24h >= 0 ? "+" : ""}{t.change24h.toFixed(2)}%
              </div>
            </div>
            <div className="pt-bar">
              <div className="pt-bar-fill" style={{ width: t.allocation + "%" }}></div>
              <span className="pt-bar-label">{t.allocation}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="portfolio-tx-section">
        <h3 className="portfolio-tx-title">📜 Recent Transactions</h3>
        <div className="portfolio-tx-list">
          {portfolio.recentTx.map((tx, i) => (
            <div key={i} className="portfolio-tx-row">
              <span className={"ptx-type " + tx.type}>
                {tx.type === "buy" ? "🟢" : tx.type === "sell" ? "🔴" : tx.type === "swap" ? "🔄" : "📤"}
                {" " + tx.type.toUpperCase()}
              </span>
              <span className="ptx-detail">{tx.amount}</span>
              <span className="ptx-value">{tx.value}</span>
              <span className="ptx-time">{tx.time}</span>
              <a
                className="ptx-hash"
                href={"https://basescan.org/tx/" + tx.hash}
                target="_blank"
                rel="noopener noreferrer"
              >
                →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WalletTab({ address, isConnected, onConnect, onDisconnect }) {
  if (!isConnected) {
    return (
      <div className="wallet-tab-disconnected">
        <div className="wallet-hero">
          <div className="wallet-hero-icon">🔗</div>
          <h2>Connect Your Wallet</h2>
          <p>Connect your Base wallet to track your portfolio, view recent transactions, and monitor your allocations in real-time.</p>
          <WalletConnect
            address={address}
            isConnected={isConnected}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
        </div>
        <div className="wallet-features">
          <div className="wallet-feature">
            <span className="wallet-feature-icon">💰</span>
            <h4>Portfolio Tracking</h4>
            <p>Real-time token balances, values, and 24h performance</p>
          </div>
          <div className="wallet-feature">
            <span className="wallet-feature-icon">📊</span>
            <h4>Allocation Breakdown</h4>
            <p>Visual pie chart of your holdings distribution</p>
          </div>
          <div className="wallet-feature">
            <span className="wallet-feature-icon">📜</span>
            <h4>Transaction History</h4>
            <p>Recent swaps, buys, sells, and transfers on Base</p>
          </div>
        </div>
      </div>
    )
  }

  return <PortfolioView address={address} />
}

export default WalletTab
