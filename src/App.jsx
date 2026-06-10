import HomeChat from './HomeChat';
import { useState, useEffect, useCallback } from 'react';
import DivergenceChart from './DivergenceChart';
import WalletTab from './WalletTab';
import SentimentTab from './SentimentTab';
import SocialTab from './SocialTab';


const NavIcon = ({ id }) => {
  const icons = {
    home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    feed: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    whales: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 9 12 9"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 9 12 9"/><path d="M4 22h16"/><path d="M10 22V9"/><path d="M14 22V9"/><path d="M12 2v3"/><circle cx="9" cy="14" r="0.5" fill="currentColor"/><circle cx="15" cy="14" r="0.5" fill="currentColor"/></svg>,
    divergence: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 18 8 12 12 14 16 6 20 10" stroke="#888"/><polyline points="4 6 8 10 12 8 16 16 20 14" stroke="#555"/><circle cx="16" cy="6" r="2" fill="none" stroke="#666"/><circle cx="16" cy="16" r="2" fill="none" stroke="#666"/></svg>,
    tokens: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M12 6a4 4 0 0 1 0 12"/></svg>,
    watchlist: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    wallet: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 12h.01"/><path d="M2 10h20"/></svg>,
    sentiment: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
    social: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  };
  return icons[id] || null;
};

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'feed', label: 'Feed' },
  { id: 'whales', label: 'Top Whales' },
  { id: 'divergence', label: 'Divergence' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'sentiment', label: 'Sentiment' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'social', label: 'Social' },
];

const WHALE_NAMES = [
  { name: '0x8f3a', tier: 'mega', avatar: 'M' },
  { name: '0x2d7c', tier: 'mega', avatar: 'M' },
  { name: '0xb4e1', tier: 'whale', avatar: 'W' },
  { name: '0x9a6f', tier: 'whale', avatar: 'W' },
  { name: '0x5c3b', tier: 'dolphin', avatar: 'D' },
  { name: '0x1e8d', tier: 'dolphin', avatar: 'D' },
];

const TOKENS = ['ETH', 'AERO', 'VIRTUAL', 'BRETT', 'DEGEN', 'CLANKER'];
const ACTIONS = ['buy', 'sell', 'swap', 'transfer'];

function generateWhaleMove() {
  const whale = WHALE_NAMES[Math.floor(Math.random() * WHALE_NAMES.length)];
  const token = TOKENS[Math.floor(Math.random() * TOKENS.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const amount = (Math.random() * 500 + 10).toFixed(1);
  const value = (parseFloat(amount) * (Math.random() * 3000 + 50)).toFixed(0);
  const mins = Math.floor(Math.random() * 30);
  return {
    ...whale, token, action, amount, value, time: mins === 0 ? 'just now' : mins + 'm ago',
    id: Date.now() + Math.random()
  };
}

const TOP_WHALES = [
  { rank: 1, ens: 'basebuilder.eth', addr: '0x8f3a...d4e2', tier: 'mega', portfolio: 48700000, pnl: 2340000, pnlPct: 4.8, winRate: 82, txCount: 1243, lastActive: '2m ago', streak: 'W5', holdings: [{t:'ETH',p:38},{t:'AERO',p:22},{t:'VIRTUAL',p:18},{t:'USDC',p:12},{t:'BRETT',p:10}] },
  { rank: 2, ens: 'whaleking.base', addr: '0x2d7c...a1f3', tier: 'mega', portfolio: 31200000, pnl: 1890000, pnlPct: 6.1, winRate: 78, txCount: 982, lastActive: '5m ago', streak: 'W3', holdings: [{t:'AERO',p:32},{t:'ETH',p:28},{t:'CLANKER',p:20},{t:'DEGEN',p:12},{t:'USDC',p:8}] },
  { rank: 3, ens: '0xb4e1...c7d9', addr: '0xb4e1...c7d9', tier: 'whale', portfolio: 18700000, pnl: -890000, pnlPct: -4.8, winRate: 71, txCount: 756, lastActive: '12m ago', streak: 'L2', holdings: [{t:'VIRTUAL',p:35},{t:'ETH',p:25},{t:'BRETT',p:20},{t:'AERO',p:15},{t:'USDC',p:5}] },
  { rank: 4, ens: '0x9a6f...e2b1', addr: '0x9a6f...e2b1', tier: 'whale', portfolio: 12400000, pnl: 567000, pnlPct: 4.6, winRate: 68, txCount: 623, lastActive: '18m ago', streak: 'W2', holdings: [{t:'DEGEN',p:30},{t:'CLANKER',p:28},{t:'ETH',p:22},{t:'AERO',p:12},{t:'USDC',p:8}] },
  { rank: 5, ens: '0x5c3b...f8a2', addr: '0x5c3b...f8a2', tier: 'dolphin', portfolio: 8200000, pnl: 312000, pnlPct: 3.8, winRate: 65, txCount: 445, lastActive: '25m ago', streak: '-', holdings: [{t:'ETH',p:42},{t:'AERO',p:20},{t:'VIRTUAL',p:18},{t:'BRETT',p:12},{t:'USDC',p:8}] },
  { rank: 6, ens: '0x1e8d...b3c4', addr: '0x1e8d...b3c4', tier: 'dolphin', portfolio: 5600000, pnl: -145000, pnlPct: -2.6, winRate: 62, txCount: 389, lastActive: '32m ago', streak: 'L1', holdings: [{t:'BRETT',p:28},{t:'VIRTUAL',p:25},{t:'ETH',p:22},{t:'DEGEN',p:15},{t:'USDC',p:10}] },
  { rank: 7, ens: '0x7f2a...d9e1', addr: '0x7f2a...d9e1', tier: 'dolphin', portfolio: 3200000, pnl: 89000, pnlPct: 2.8, winRate: 59, txCount: 278, lastActive: '45m ago', streak: 'W1', holdings: [{t:'CLANKER',p:35},{t:'ETH',p:30},{t:'AERO',p:20},{t:'USDC',p:15}] },
  { rank: 8, ens: '0x4c6d...a2b8', addr: '0x4c6d...a2b8', tier: 'dolphin', portfolio: 2100000, pnl: -67000, pnlPct: -3.2, winRate: 56, txCount: 198, lastActive: '1h ago', streak: 'L3', holdings: [{t:'DEGEN',p:40},{t:'BRETT',p:25},{t:'ETH',p:20},{t:'USDC',p:15}] },
  { rank: 9, ens: '0xa3e8...f1d2', addr: '0xa3e8...f1d2', tier: 'dolphin', portfolio: 1800000, pnl: 42000, pnlPct: 2.3, winRate: 54, txCount: 167, lastActive: '1h ago', streak: '-', holdings: [{t:'ETH',p:45},{t:'AERO',p:22},{t:'USDC',p:33}] },
  { rank: 10, ens: '0xd5b9...c4e7', addr: '0xd5b9...c4e7', tier: 'dolphin', portfolio: 1400000, pnl: 21000, pnlPct: 1.5, winRate: 52, txCount: 134, lastActive: '2h ago', streak: '-', holdings: [{t:'VIRTUAL',p:38},{t:'ETH',p:32},{t:'USDC',p:30}] },
];

function formatNum(n) {
  if (n >= 1e6) return '$' + (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n/1e3).toFixed(1) + 'K';
  return '$' + n;
}

function fmtAddr(addr) {
  if (!addr) return '';
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

export default function App() {
  const [tab, setTab] = useState('home');
  const [whaleFeed, setWhaleFeed] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [searchAddr, setSearchAddr] = useState('');
  const [tokens, setTokens] = useState([]);
  const [tokensLoading, setTokensLoading] = useState(true);
  const [tokensError, setTokensError] = useState(null);
  const [tokenSearch, setTokenSearch] = useState('');
  const [expandedWhale, setExpandedWhale] = useState(null);

  useEffect(() => {
    const feed = [];
    for (let i = 0; i < 8; i++) feed.push(generateWhaleMove());
    setWhaleFeed(feed);
    const iv = setInterval(() => {
      setWhaleFeed(prev => [generateWhaleMove(), ...prev.slice(0, 19)]);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=base-ecosystem&order=market_cap_desc&per_page=50&page=1&sparkline=false')
      .then(r => r.json())
      .then(d => { setTokens(Array.isArray(d) ? d : []); setTokensLoading(false); })
      .catch(e => { setTokensError(e.message); setTokensLoading(false); });
  }, []);

  const addToWatchlist = useCallback(() => {
    const addr = searchAddr.trim();
    if (!addr) return;
    const wl = { address: addr, tier: 'whale', balance: '$' + (Math.random()*10+1).toFixed(2) + 'M', winRate: (Math.random()*30+55).toFixed(0) + '%', txCount: Math.floor(Math.random()*500+50), pnl: (Math.random()>0.5?'+':'-') + '$' + (Math.random()*500+10).toFixed(0) + 'K' };
    setWatchlist(prev => [wl, ...prev]);
    setSearchAddr('');
  }, [searchAddr]);

  const removeFromWatchlist = useCallback((addr) => {
    setWatchlist(prev => prev.filter(w => w.address !== addr));
  }, []);

  const copyAddr = (text) => { navigator.clipboard.writeText(text); };

  const filteredTokens = tokens.filter(t =>
    t.name.toLowerCase().includes(tokenSearch.toLowerCase()) ||
    t.symbol.toLowerCase().includes(tokenSearch.toLowerCase())
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand">PRIME : INTEL</div>
          <div className="sidebar-sub">Base chain intelligence</div>
        </div>
        <nav className="sidebar-nav">
          {TABS.map(t => (
            <button key={t.id} className={'nav-item' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>
              <span className="nav-icon"><NavIcon id={t.id} /></span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-status">
            <span className="status-dot"></span>
            Base Mainnet
          </div>
        </div>
      </aside>

      <main className="main">
        <div className={'main-header' + (tab === 'home' ? ' home-hidden' : '')}>
          <h1 className="page-title">{TABS.find(t => t.id === tab)?.label}</h1>
          {(tab === 'feed' || tab === 'watchlist') && (
            <div className="search-bar">
              <input className="search-input" placeholder="0x..." value={searchAddr} onChange={e => setSearchAddr(e.target.value)} onKeyDown={e => e.key === 'Enter' && addToWatchlist()} />
              <button className="search-btn" onClick={addToWatchlist}>Track</button>
            </div>
          )}
          {tab === 'tokens' && (
            <div className="search-bar">
              <input className="search-input" placeholder="Search tokens..." value={tokenSearch} onChange={e => setTokenSearch(e.target.value)} />
            </div>
          )}
        </div>

        {tab === 'feed' && (
          <>
            <div className="stats-row">
              <div className="stat-card"><div className="stat-label">24h Whale Volume</div><div className="stat-value">$142.8M</div></div>
              <div className="stat-card"><div className="stat-label">Buy / Sell Ratio</div><div className="stat-value">1.34</div></div>
              <div className="stat-card"><div className="stat-label">Active Mega Whales</div><div className="stat-value">18</div></div>
              <div className="stat-card"><div className="stat-label">Tracked Moves</div><div className="stat-value">2,847</div></div>
            </div>
            <div className="whale-feed">
              {whaleFeed.map(m => (
                <div className="card" key={m.id}>
                  <div className="whale-header">
                    <div className="whale-identity">
                      <div className={'whale-avatar ' + m.tier}>{m.avatar}</div>
                      <span className="whale-name">{m.name}</span>
                      <span className={'tier-badge' + (m.tier === 'mega' ? ' mega' : '')}>{m.tier}</span>
                    </div>
                    <span className="whale-time">{m.time}</span>
                  </div>
                  <div className="whale-action">
                    <span className={'action-type action-' + m.action}>{m.action}</span>
                    <span className="action-detail">{m.amount} {m.token}</span>
                    <span className={'action-value ' + (m.action === 'buy' ? 'value-positive' : m.action === 'sell' ? 'value-negative' : '')}>${Number(m.value).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'whales' && (
          <div className="top-whales">
            {TOP_WHALES.map(w => (
              <div className={'top-whale-card' + (expandedWhale === w.rank ? ' expanded' : '')} key={w.rank} onClick={() => setExpandedWhale(expandedWhale === w.rank ? null : w.rank)}>
                <div className="top-whale-main">
                  <div className="top-whale-rank">{w.rank}</div>
                  <div className={'whale-avatar ' + w.tier}>{w.tier === 'mega' ? 'M' : w.tier === 'whale' ? 'W' : 'D'}</div>
                  <div className="top-whale-info">
                    <div className="top-whale-name-row">
                      <span className="top-whale-ens">{w.ens}</span>
                      <span className={'tier-badge' + (w.tier === 'mega' ? ' mega' : '')}>{w.tier}</span>
                    </div>
                    <div className="top-whale-addr">{w.addr}</div>
                  </div>
                  <div className="top-whale-portfolio">
                    <div className="portfolio-val">{formatNum(w.portfolio)}</div>
                    <div className={'pnl-val ' + (w.pnl >= 0 ? 'change-positive' : 'change-negative')}>{w.pnl >= 0 ? '+' : ''}{formatNum(Math.abs(w.pnl))}</div>
                  </div>
                  <div className="top-whale-meta">
                    <div className="meta-item"><span className="meta-label">Win</span><span className="meta-val" style={{color: w.winRate >= 70 ? 'var(--positive)' : w.winRate >= 60 ? 'var(--warning)' : 'var(--negative)'}}>{w.winRate}%</span></div>
                    <div className="meta-item"><span className="meta-label">Txns</span><span className="meta-val">{w.txCount}</span></div>
                  </div>
                  <button className="copy-btn" onClick={e => { e.stopPropagation(); copyAddr(w.addr); }}>Copy</button>
                </div>
                {expandedWhale === w.rank && (
                  <div className="top-whale-expand">
                    <div className="holdings-title">Holdings</div>
                    {w.holdings.map((h,i) => (
                      <div className="holding-item" key={i}>
                        <span className="holding-token">{h.t}</span>
                        <div className="holding-bar-bg"><div className="holding-bar" style={{width: h.p + '%'}}></div></div>
                        <span className="holding-pct">{h.p}%</span>
                      </div>
                    ))}
                    <div className="expand-meta-row">
                      <span>Last active: {w.lastActive}</span>
                      <a className="link" href={'https://basescan.org/address/' + w.addr} target="_blank" rel="noreferrer">BaseScan</a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'divergence' && <DivergenceChart />}

        {tab === 'tokens' && (
          <>
            {tokensLoading && <div className="loading"><span className="spinner"></span>Loading tokens...</div>}
            {tokensError && <div className="error-msg">{tokensError}</div>}
            {!tokensLoading && !tokensError && (
              <table className="tokens-table">
                <thead><tr><th>#</th><th>Token</th><th>Price</th><th>24h</th><th>Market Cap</th><th>Volume</th></tr></thead>
                <tbody>
                  {filteredTokens.map((t,i) => (
                    <tr key={t.id}>
                      <td className="mono token-rank">{i+1}</td>
                      <td><div className="token-name"><img src={t.image} alt="" width="20" height="20" style={{borderRadius:'50%'}} /><span className="token-symbol">{t.symbol.toUpperCase()}</span></div></td>
                      <td className="mono">${t.current_price?.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:6})}</td>
                      <td className={'mono ' + (t.price_change_percentage_24h >= 0 ? 'change-positive' : 'change-negative')}>{t.price_change_percentage_24h?.toFixed(2)}%</td>
                      <td className="mono">{formatNum(t.market_cap)}</td>
                      <td className="mono">{formatNum(t.total_volume)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {tab === 'watchlist' && (
          <>
            {watchlist.length === 0 && <div className="empty-state"><h3>No wallets tracked</h3><p>Enter an address above to start tracking</p></div>}
            <div className="watchlist">
              {watchlist.map(w => (
                <div className="watchlist-card" key={w.address} onClick={() => removeFromWatchlist(w.address)}>
                  <div className="wl-header">
                    <span className="wl-address">{fmtAddr(w.address)}</span>
                    <span className={'tier-badge' + (w.tier === 'mega' ? ' mega' : '')}>{w.tier}</span>
                  </div>
                  <div className="wl-stats">
                    <div><div className="wl-stat-label">Balance</div><div className="wl-stat-value">{w.balance}</div></div>
                    <div><div className="wl-stat-label">Win Rate</div><div className="wl-stat-value">{w.winRate}</div></div>
                    <div><div className="wl-stat-label">PnL</div><div className={'wl-stat-value ' + (w.pnl.startsWith('+') ? 'change-positive' : 'change-negative')}>{w.pnl}</div></div>
                    <div><div className="wl-stat-label">Txns</div><div className="wl-stat-value">{w.txCount}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'home' && <HomeChat />}
        {tab === 'sentiment' && <SentimentTab />}
        {tab === 'wallet' && <WalletTab />}
        {tab === 'social' && <SocialTab />}
      </main>
    </div>
  );
}
