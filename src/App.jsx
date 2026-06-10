import DivergenceChart from './DivergenceChart.jsx'
import WalletTab from './WalletTab.jsx'
import { useState, useEffect, useCallback } from 'react'

const WHALE_NAMES = [
  { name: '0xSatoshi', tier: 'mega', avatar: '🐋' },
  { name: 'BaseWhale_01', tier: 'mega', avatar: '🟣' },
  { name: 'SmartContractKing', tier: 'whale', avatar: '👑' },
  { name: 'DeFiGod.eth', tier: 'whale', avatar: '⚡' },
  { name: '0xNakamoto', tier: 'mega', avatar: '🔷' },
  { name: 'WhaleAlert_Base', tier: 'whale', avatar: '🌊' },
  { name: 'OnchainShadow', tier: 'dolphin', avatar: '🐬' },
  { name: 'BaseDegen_42', tier: 'dolphin', avatar: '🔥' },
  { name: 'MegaVault.base', tier: 'mega', avatar: '🏦' },
  { name: 'AlphaSeeker.eth', tier: 'whale', avatar: '🎯' },
  { name: 'DarkPool_7', tier: 'whale', avatar: '🌑' },
  { name: 'FlashBot_Runner', tier: 'dolphin', avatar: '⚡' },
  { name: '0xVitalik_Fan', tier: 'dolphin', avatar: '💎' },
  { name: 'BridgeMaster.base', tier: 'whale', avatar: '🌉' },
  { name: 'YieldFarmer_X', tier: 'dolphin', avatar: '🌾' },
]

const TOP_WHALES = [
  {
    rank: 1,
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD08',
    ens: 'gigabrain.eth',
    tier: 'mega',
    avatar: '🐋',
    portfolio: 48750000,
    pnl24h: 2340000,
    pnlPct: 5.05,
    winRate: 78,
    txCount: 12847,
    topHoldings: ['ETH 40%', 'USDC 25%', 'cbETH 15%', 'AERO 10%', 'VIRTUAL 10%'],
    lastActive: '2m ago',
    streak: 'W5',
  },
  {
    rank: 2,
    address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72',
    ens: 'defi_whale.base',
    tier: 'mega',
    avatar: '🟣',
    portfolio: 31200000,
    pnl24h: -890000,
    pnlPct: -2.78,
    winRate: 72,
    txCount: 9341,
    topHoldings: ['ETH 35%', 'WEETH 20%', 'rETH 20%', 'AERO 15%', 'UNI 10%'],
    lastActive: '8m ago',
    streak: 'L2',
  },
  {
    rank: 3,
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    ens: 'vitalik.eth',
    tier: 'mega',
    avatar: '🔷',
    portfolio: 28400000,
    pnl24h: 1120000,
    pnlPct: 4.11,
    winRate: 91,
    txCount: 45230,
    topHoldings: ['ETH 60%', 'USDC 15%', 'UNI 10%', 'Aave 10%', 'DAI 5%'],
    lastActive: '14m ago',
    streak: 'W12',
  },
  {
    rank: 4,
    address: '0x3fC91A3afd6f62868aB0F74d2e1E7b3B6Cf0A5e0',
    ens: null,
    tier: 'whale',
    avatar: '👑',
    portfolio: 9750000,
    pnl24h: 432000,
    pnlPct: 4.64,
    winRate: 68,
    txCount: 6821,
    topHoldings: ['VIRTUAL 30%', 'CLANKER 25%', 'BRETT 20%', 'AERO 15%', 'ETH 10%'],
    lastActive: '1m ago',
    streak: 'W3',
  },
  {
    rank: 5,
    address: '0x56Eddb7C5a92B0C3E9c2a20A8F7eF2Dc0E4B3e8F',
    ens: 'aerodrome.eth',
    tier: 'whale',
    avatar: '🌊',
    portfolio: 8200000,
    pnl24h: -210000,
    pnlPct: -2.50,
    winRate: 65,
    txCount: 5120,
    topHoldings: ['AERO 35%', 'ETH 25%', 'USDC 20%', 'cbETH 10%', 'DAI 10%'],
    lastActive: '5m ago',
    streak: 'L1',
  },
  {
    rank: 6,
    address: '0x1DB3479A8e23C29B0F6eF4a6fF3A5c17e8B8a1C2',
    ens: 'smartcontractking.base',
    tier: 'whale',
    avatar: '⚡',
    portfolio: 6100000,
    pnl24h: 187000,
    pnlPct: 3.17,
    winRate: 71,
    txCount: 4210,
    topHoldings: ['ETH 45%', 'USDC 20%', 'WEETH 15%', 'DEGEN 10%', 'BRETT 10%'],
    lastActive: '22m ago',
    streak: 'W7',
  },
  {
    rank: 7,
    address: '0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0',
    ens: 'darkpool.eth',
    tier: 'whale',
    avatar: '🌑',
    portfolio: 4500000,
    pnl24h: -67000,
    pnlPct: -1.47,
    winRate: 62,
    txCount: 3890,
    topHoldings: ['USDC 30%', 'ETH 25%', 'AERO 20%', 'VIRTUAL 15%', 'UNI 10%'],
    lastActive: '45m ago',
    streak: 'L3',
  },
  {
    rank: 8,
    address: '0xBb0E1c3a7d0F9E4C8b2A6D1c3E5f7A9b1D3e5F7a',
    ens: null,
    tier: 'whale',
    avatar: '🌉',
    portfolio: 3200000,
    pnl24h: 98000,
    pnlPct: 3.16,
    winRate: 69,
    txCount: 2940,
    topHoldings: ['cbETH 30%', 'ETH 25%', 'rETH 20%', 'Aave 15%', 'DAI 10%'],
    lastActive: '3m ago',
    streak: 'W2',
  },
  {
    rank: 9,
    address: '0xCc1D2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D',
    ens: 'alphaseeker.eth',
    tier: 'dolphin',
    avatar: '🎯',
    portfolio: 1850000,
    pnl24h: 56000,
    pnlPct: 3.12,
    winRate: 64,
    txCount: 1820,
    topHoldings: ['VIRTUAL 25%', 'CLANKER 25%', 'BRETT 20%', 'DEGEN 20%', 'ETH 10%'],
    lastActive: '7m ago',
    streak: 'W4',
  },
  {
    rank: 10,
    address: '0xDd2E3f4A5b6C7d8E9f0A1b2C3d4E5f6A7b8C9d0E',
    ens: 'megavault.base',
    tier: 'dolphin',
    avatar: '🏦',
    portfolio: 1420000,
    pnl24h: -23000,
    pnlPct: -1.59,
    winRate: 58,
    txCount: 1540,
    topHoldings: ['ETH 35%', 'AERO 25%', 'USDC 20%', 'WEETH 10%', 'UNI 10%'],
    lastActive: '18m ago',
    streak: 'L1',
  },
]

const TOKENS = ['ETH', 'USDC', 'cbETH', 'WEETH', 'AERO', 'VIRTUAL', 'CLANKER', 'BRETT', 'DEGEN', 'USDbC', 'DAI', 'rETH', 'UNI', 'Aave']
const ACTIONS = ['buy', 'sell', 'swap', 'transfer']

function randomAddr() {
  return '0x' + Array.from({ length: 8 }, () => Math.floor(Math.random() * 16).toString(16)).join('') + '...'
}

function randomValue(tier) {
  const ranges = { mega: [500000, 5000000], whale: [100000, 800000], dolphin: [10000, 150000] }
  const [min, max] = ranges[tier]
  return Math.floor(Math.random() * (max - min) + min)
}

function generateWhaleAction(whale) {
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)]
  const token2 = token === 'ETH' ? 'USDC' : TOKENS[Math.floor(Math.random() * TOKENS.length)]
  const value = randomValue(whale.tier)
  const amount = (action === 'buy' || action === 'sell')
    ? (value / (Math.random() * 3000 + 100)).toFixed(2) + ' ' + token
    : value.toLocaleString() + ' ' + token

  const details = {
    buy: 'Bought ' + amount + ' via Uniswap V3',
    sell: 'Sold ' + amount + ' on Aerodrome',
    swap: 'Swapped ' + amount + ' to ' + token2,
    transfer: 'Transferred ' + amount + ' to ' + randomAddr(),
  }

  const secs = Math.floor(Math.random() * 3600)
  const timeStr = secs < 60 ? secs + 's ago' : secs < 3600 ? Math.floor(secs / 60) + 'm ago' : '1h ago'

  return {
    id: Date.now() + Math.random(),
    whale,
    action,
    detail: details[action],
    value,
    valueDirection: action === 'buy' ? 'positive' : action === 'sell' ? 'negative' : 'neutral',
    time: timeStr,
    token,
  }
}

function generateWatchlistWallet() {
  const tier = ['mega', 'whale', 'dolphin'][Math.floor(Math.random() * 3)]
  const addr = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  const balance = randomValue(tier)
  const txCount = Math.floor(Math.random() * 5000 + 100)
  const winRate = Math.floor(Math.random() * 40 + 55)
  return {
    address: addr.slice(0, 6) + '...' + addr.slice(-4),
    fullAddress: addr,
    tier,
    balance,
    txCount,
    winRate,
    firstSeen: Math.floor(Math.random() * 30 + 1) + 'd ago',
  }
}

async function fetchBaseTokens() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-ecosystem&order=market_cap_desc&per_page=50&page=1&sparkline=false'
    )
    if (!res.ok) throw new Error('API error')
    return await res.json()
  } catch {
    return null
  }
}

function Header() {
  return (
    <div className="header">
      <div className="logo">
        <div className="logo-icon">⚡</div>
        <div className="logo-text">
          <h1>Prime:Intel</h1>
          <span>WHALE WALLET TRACKER • BASE</span>
        </div>
      </div>
      <div className="status-pill">
        <div className="status-dot" />
        LIVE
      </div>
    </div>
  )
}

function SearchBar({ onSearch }) {
  const [val, setVal] = useState('')
  const handleSearch = () => onSearch(val)
  const handleKey = (e) => { if (e.key === 'Enter') handleSearch() }
  return (
    <div className="search-bar">
      <input
        className="search-input"
        placeholder="Enter wallet address or ENS..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKey}
      />
      <button className="search-btn" onClick={handleSearch}>Track Whale</button>
    </div>
  )
}

function StatsRow({ feed }) {
  const totalVolume = feed.reduce((s, w) => s + w.value, 0)
  const buys = feed.filter((w) => w.action === 'buy').length
  const sells = feed.filter((w) => w.action === 'sell').length
  const megaCount = new Set(feed.filter((w) => w.whale.tier === 'mega').map((w) => w.whale.name)).size
  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">24h Whale Volume</div>
        <div className="stat-value">${(totalVolume / 1000000).toFixed(1)}M</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Buy / Sell Ratio</div>
        <div className="stat-value" style={{ color: buys > sells ? 'var(--green)' : 'var(--red)' }}>
          {buys}/{sells}
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Mega Whales Active</div>
        <div className="stat-value" style={{ color: '#a78bfa' }}>{megaCount}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Tracked Moves</div>
        <div className="stat-value" style={{ color: 'var(--cyan)' }}>{feed.length}</div>
      </div>
    </div>
  )
}

function WhaleFeed({ feed }) {
  if (!feed.length) {
    return (
      <div className="empty-state">
        <h3>No whale moves yet</h3>
        <p>Tracking blockchain for large transactions...</p>
      </div>
    )
  }
  return (
    <div className="whale-feed">
      {feed.slice(0, 20).map((w) => (
        <div key={w.id} className="whale-card">
          <div className="whale-header">
            <div className="whale-identity">
              <div className={'whale-avatar ' + (w.whale.tier === 'mega' ? 'diamond' : w.whale.tier === 'whale' ? 'gold' : 'silver')}>
                {w.whale.avatar}
              </div>
              <span className="whale-name">{w.whale.name}</span>
              <span className={'whale-tier tier-' + w.whale.tier}>{w.whale.tier}</span>
            </div>
            <span className="whale-time">{w.time}</span>
          </div>
          <div className="whale-action">
            <span className={'action-type action-' + w.action}>{w.action}</span>
            <span className="action-detail">{w.detail}</span>
            <span className={'action-value ' + (w.valueDirection === 'positive' ? 'value-positive' : w.valueDirection === 'negative' ? 'value-negative' : '')}>
              ${w.value.toLocaleString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function TopWhales({ whales }) {
  const [copiedIdx, setCopiedIdx] = useState(null)
  const [expandedIdx, setExpandedIdx] = useState(null)

  const handleCopy = (addr, idx) => {
    navigator.clipboard.writeText(addr).catch(() => {})
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  const toggleExpand = (idx) => {
    setExpandedIdx(expandedIdx === idx ? null : idx)
  }

  const formatValue = (n) => {
    if (n >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M'
    if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K'
    return '$' + n.toLocaleString()
  }

  return (
    <div className="top-whales">
      {whales.map((w, i) => (
        <div key={i} className={'top-whale-card' + (expandedIdx === i ? ' expanded' : '')}>
          <div className="top-whale-main" onClick={() => toggleExpand(i)}>
            <div className="top-whale-rank">
              <span className="rank-num">#{w.rank}</span>
            </div>
            <div className={'whale-avatar ' + (w.tier === 'mega' ? 'diamond' : w.tier === 'whale' ? 'gold' : 'silver')}>
              {w.avatar}
            </div>
            <div className="top-whale-info">
              <div className="top-whale-name-row">
                <span className="top-whale-ens">{w.ens || w.address.slice(0, 8) + '...'}</span>
                <span className={'whale-tier tier-' + w.tier}>{w.tier}</span>
                <span className={'streak-badge ' + (w.streak.startsWith('W') ? 'streak-win' : 'streak-loss')}>{w.streak}</span>
              </div>
              <div className="top-whale-addr">{w.address.slice(0, 6) + '...' + w.address.slice(-4)}</div>
            </div>
            <div className="top-whale-portfolio">
              <div className="portfolio-val">{formatValue(w.portfolio)}</div>
              <div className={'pnl-val ' + (w.pnl24h >= 0 ? 'value-positive' : 'value-negative')}>
                {w.pnl24h >= 0 ? '+' : ''}{formatValue(Math.abs(w.pnl24h))} ({w.pnlPct >= 0 ? '+' : ''}{w.pnlPct.toFixed(2)}%)
              </div>
            </div>
            <div className="top-whale-meta">
              <div className="meta-item">
                <span className="meta-label">Win</span>
                <span className="meta-val" style={{ color: w.winRate >= 70 ? 'var(--green)' : w.winRate >= 60 ? 'var(--yellow)' : 'var(--red)' }}>{w.winRate}%</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Txns</span>
                <span className="meta-val">{w.txCount.toLocaleString()}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Last</span>
                <span className="meta-val">{w.lastActive}</span>
              </div>
            </div>
            <button className="copy-btn" onClick={(e) => { e.stopPropagation(); handleCopy(w.address, i) }} title="Copy address">
              {copiedIdx === i ? '✓' : '📋'}
            </button>
          </div>
          {expandedIdx === i && (
            <div className="top-whale-expand">
              <div className="holdings-section">
                <div className="holdings-title">Top Holdings</div>
                <div className="holdings-list">
                  {w.topHoldings.map((h, j) => (
                    <div key={j} className="holding-item">
                      <span className="holding-token">{h.split(' ')[0]}</span>
                      <div className="holding-bar-bg">
                        <div className="holding-bar" style={{ width: parseInt(h) + '%' }} />
                      </div>
                      <span className="holding-pct">{h.split(' ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="expand-meta-row">
                <span className="mono">Full: {w.address}</span>
                <a className="basescan-link" href={'https://basescan.org/address/' + w.address} target="_blank" rel="noopener noreferrer">View on BaseScan ↗</a>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function Watchlist({ wallets, onRemove }) {
  if (!wallets.length) {
    return (
      <div className="empty-state">
        <h3>Watchlist empty</h3>
        <p>Track a whale wallet to add it here</p>
      </div>
    )
  }
  return (
    <div className="watchlist">
      {wallets.map((w, i) => (
        <div key={i} className="watchlist-card" onClick={() => onRemove(i)}>
          <div className="wl-header">
            <span className="wl-address">{w.address}</span>
            <span className={'whale-tier tier-' + w.tier}>{w.tier}</span>
          </div>
          <div className="wl-stats">
            <div>
              <div className="wl-stat-label">Balance</div>
              <div className="wl-stat-value">${(w.balance / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <div className="wl-stat-label">Win Rate</div>
              <div className="wl-stat-value" style={{ color: w.winRate > 65 ? 'var(--green)' : 'var(--yellow)' }}>{w.winRate}%</div>
            </div>
            <div>
              <div className="wl-stat-label">Txns</div>
              <div className="wl-stat-value">{w.txCount}</div>
            </div>
            <div>
              <div className="wl-stat-label">First Seen</div>
              <div className="wl-stat-value">{w.firstSeen}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TokensTab({ tokens, loading, error }) {
  if (loading) {
    return <div className="loading"><div className="spinner" /> Loading Base tokens...</div>
  }
  if (error) {
    return <div className="error-msg">⚠️ {error}</div>
  }
  if (!tokens) {
    return (
      <div className="empty-state">
        <h3>Token data unavailable</h3>
        <p>Could not fetch from CoinGecko API</p>
      </div>
    )
  }
  return (
    <table className="tokens-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Token</th>
          <th>Price</th>
          <th>24h</th>
          <th>Market Cap</th>
          <th>Volume 24h</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((t, i) => (
          <tr key={t.id}>
            <td className="token-rank">{i + 1}</td>
            <td>
              <div className="token-name">
                <img src={t.image} alt="" width="20" height="20" />
                <span className="token-symbol">{t.symbol.toUpperCase()}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{t.name}</span>
              </div>
            </td>
            <td className="mono">${t.current_price?.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
            <td className={'mono ' + (t.price_change_percentage_24h >= 0 ? 'change-positive' : 'change-negative')}>
              {t.price_change_percentage_24h?.toFixed(2)}%
            </td>
            <td className="mono">${(t.market_cap / 1e6).toFixed(0)}M</td>
            <td className="mono">${(t.total_volume / 1e6).toFixed(0)}M</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function App() {
  const [tab, setTab] = useState('feed')
  const [feed, setFeed] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [tokens, setTokens] = useState(null)
  const [tokensLoading, setTokensLoading] = useState(false)
  const [tokensError, setTokensError] = useState(null)
  const [walletAddress, setWalletAddress] = useState(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const handleWalletConnect = (addr) => { setWalletAddress(addr); setWalletConnected(true) }
  const handleWalletDisconnect = () => { setWalletAddress(null); setWalletConnected(false) }

  useEffect(() => {
    const initial = WHALE_NAMES.slice(0, 8).map((name) => generateWhaleAction(name))
    setFeed(initial)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const whale = WHALE_NAMES[Math.floor(Math.random() * WHALE_NAMES.length)]
      const action = generateWhaleAction(whale)
      setFeed((prev) => [action, ...prev].slice(0, 50))
    }, 4000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (tab === 'tokens' && !tokens && !tokensLoading) {
      setTokensLoading(true)
      fetchBaseTokens().then((data) => {
        setTokens(data)
        setTokensError(data ? null : 'Failed to fetch — rate limited or network error')
        setTokensLoading(false)
      })
    }
  }, [tab, tokens, tokensLoading])

  const handleSearch = useCallback((val) => {
    const trimmed = val.trim()
    if (!trimmed) return
    const wallet = generateWatchlistWallet()
    if (trimmed.startsWith('0x') && trimmed.length > 6) {
      wallet.address = trimmed.slice(0, 6) + '...' + trimmed.slice(-4)
      wallet.fullAddress = trimmed
    }
    setWatchlist((prev) => [wallet, ...prev].slice(0, 12))
  }, [])

  const handleRemoveWatchlist = useCallback((index) => {
    setWatchlist((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div className="app">
      <Header />
      <SearchBar onSearch={handleSearch} />
      <StatsRow feed={feed} />
      <div className="tabs">
        {['feed', 'topwhales', 'divergence', 'wallet', 'watchlist', 'tokens'].map((t) => (
          <button key={t} className={'tab ' + (tab === t ? 'active' : '')} onClick={() => setTab(t)}>
            {t === 'feed' ? '🐋 Whale Feed' : t === 'topwhales' ? '🏆 Top Whales' : t === 'divergence' ? '⚡ Divergence' : t === 'wallet' ? '🔗 Wallet' : t === 'watchlist' ? '👁️ Watchlist' : '📊 Base Tokens'}
          </button>
        ))}
      </div>
      {tab === 'feed' && <WhaleFeed feed={feed} />}
      {tab === 'topwhales' && <TopWhales whales={TOP_WHALES} />}
      {tab === 'divergence' && <DivergenceChart />}
      {tab === 'wallet' && <WalletTab address={walletAddress} isConnected={walletConnected} onConnect={handleWalletConnect} onDisconnect={handleWalletDisconnect} />}
      {tab === 'watchlist' && <Watchlist wallets={watchlist} onRemove={handleRemoveWatchlist} />}
      {tab === 'tokens' && <TokensTab tokens={tokens} loading={tokensLoading} error={tokensError} />}
    </div>
  )
}
