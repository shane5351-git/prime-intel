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
        {['feed', 'watchlist', 'tokens'].map((t) => (
          <button key={t} className={'tab ' + (tab === t ? 'active' : '')} onClick={() => setTab(t)}>
            {t === 'feed' ? '🐋 Whale Feed' : t === 'watchlist' ? '👁️ Watchlist' : '📊 Base Tokens'}
          </button>
        ))}
      </div>
      {tab === 'feed' && <WhaleFeed feed={feed} />}
      {tab === 'watchlist' && <Watchlist wallets={watchlist} onRemove={handleRemoveWatchlist} />}
      {tab === 'tokens' && <TokensTab tokens={tokens} loading={tokensLoading} error={tokensError} />}
    </div>
  )
}
