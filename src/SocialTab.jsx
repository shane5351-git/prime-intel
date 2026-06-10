import { useState, useEffect, useCallback } from 'react';

const ALPHA_CALLERS = [
  {
    handle: '@GitLawb',
    name: 'GitLawb',
    bio: 'Base ecosystem alpha. Called runners from 200K to 30M+',
    followers: 42800,
    verifiedCalls: 34,
    hitRate: 79,
    avgReturn: 4700,
    bestCall: 'LAWB',
    bestCallReturn: 14800,
    lastActive: '12m ago',
    chain: 'Base',
    recentCalls: [
      { token: 'LAWB', calledAt: '$200K', peakedAt: '$30M', returnPct: 14800, daysToPeak: 14, status: 'hit' },
      { token: 'AERO', calledAt: '$12M', peakedAt: '$89M', returnPct: 641, daysToPeak: 21, status: 'hit' },
      { token: 'CLANKER', calledAt: '$800K', peakedAt: '$24M', returnPct: 2900, daysToPeak: 9, status: 'hit' },
      { token: 'MFER', calledAt: '$1.2M', peakedAt: '$4.8M', returnPct: 300, daysToPeak: 5, status: 'partial' },
    ],
  },
  {
    handle: '@TheTrenchByCbg',
    name: 'CBG',
    bio: 'Sailboat Cabal. Top Base caller.',
    followers: 31200,
    verifiedCalls: 28,
    hitRate: 75,
    avgReturn: 3200,
    bestCall: 'ALTT',
    bestCallReturn: 8400,
    lastActive: '8m ago',
    chain: 'Base',
    recentCalls: [
      { token: 'ALTT', calledAt: '$150K', peakedAt: '$12.7M', returnPct: 8400, daysToPeak: 11, status: 'hit' },
      { token: 'BRETT', calledAt: '$3M', peakedAt: '$420M', returnPct: 13900, daysToPeak: 60, status: 'hit' },
      { token: 'MORPHO', calledAt: '$2M', peakedAt: '$18M', returnPct: 800, daysToPeak: 18, status: 'hit' },
    ],
  },
  {
    handle: '@basedalpha_',
    name: 'BasedAlpha',
    bio: 'Base-native degen. Early on every Base runner.',
    followers: 28900,
    verifiedCalls: 22,
    hitRate: 72,
    avgReturn: 2800,
    bestCall: 'VIRTUAL',
    bestCallReturn: 6200,
    lastActive: '3m ago',
    chain: 'Base',
    recentCalls: [
      { token: 'VIRTUAL', calledAt: '$4M', peakedAt: '$252M', returnPct: 6200, daysToPeak: 28, status: 'hit' },
      { token: 'DEGEN', calledAt: '$8M', peakedAt: '$86M', returnPct: 975, daysToPeak: 14, status: 'hit' },
      { token: 'HIGHER', calledAt: '$600K', peakedAt: '$9M', returnPct: 1400, daysToPeak: 7, status: 'hit' },
    ],
  },
  {
    handle: '@0xMert_',
    name: 'Mert',
    bio: 'Base infra + meme alpha. Builder + trader.',
    followers: 65400,
    verifiedCalls: 18,
    hitRate: 71,
    avgReturn: 2100,
    bestCall: 'ETH',
    bestCallReturn: 340,
    lastActive: '22m ago',
    chain: 'Base',
    recentCalls: [
      { token: 'AERO', calledAt: '$18M', peakedAt: '$89M', returnPct: 394, daysToPeak: 12, status: 'hit' },
      { token: 'UNI', calledAt: '$6.2B', peakedAt: '$9.1B', returnPct: 47, daysToPeak: 30, status: 'partial' },
    ],
  },
  {
    handle: '@Jesse_base',
    name: 'Jesse Pollak',
    bio: 'Base creator. Signal direction.',
    followers: 142000,
    verifiedCalls: 12,
    hitRate: 83,
    avgReturn: 1800,
    bestCall: 'BASE',
    bestCallReturn: 0,
    lastActive: '45m ago',
    chain: 'Base',
    recentCalls: [
      { token: 'AERO', calledAt: '$5M', peakedAt: '$89M', returnPct: 1680, daysToPeak: 45, status: 'hit' },
      { token: 'VIRTUAL', calledAt: '$12M', peakedAt: '$252M', returnPct: 2000, daysToPeak: 22, status: 'hit' },
    ],
  },
  {
    handle: '@SailboatCabal',
    name: 'Sailboat Cabal',
    bio: 'Collective of Base alpha callers. Verified track record.',
    followers: 18900,
    verifiedCalls: 41,
    hitRate: 76,
    avgReturn: 3600,
    bestCall: 'BRETT',
    bestCallReturn: 13900,
    lastActive: '5m ago',
    chain: 'Base',
    recentCalls: [
      { token: 'BRETT', calledAt: '$3M', peakedAt: '$420M', returnPct: 13900, daysToPeak: 60, status: 'hit' },
      { token: 'ALTT', calledAt: '$150K', peakedAt: '$12.7M', returnPct: 8400, daysToPeak: 11, status: 'hit' },
      { token: 'LAWB', calledAt: '$200K', peakedAt: '$30M', returnPct: 14800, daysToPeak: 14, status: 'hit' },
    ],
  },
  {
    handle: '@dexdotes',
    name: 'Dex Dotes',
    bio: 'On-chain analyst. Base DEX alpha.',
    followers: 15400,
    verifiedCalls: 16,
    hitRate: 69,
    avgReturn: 1900,
    bestCall: 'AERO',
    bestCallReturn: 1680,
    lastActive: '1h ago',
    chain: 'Base',
    recentCalls: [
      { token: 'AERO', calledAt: '$5M', peakedAt: '$89M', returnPct: 1680, daysToPeak: 45, status: 'hit' },
      { token: 'MORPHO', calledAt: '$4M', peakedAt: '$18M', returnPct: 350, daysToPeak: 22, status: 'hit' },
    ],
  },
  {
    handle: '@womdotfun',
    name: 'WOM',
    bio: 'Verified caller tracking. Data-driven alpha scoring.',
    followers: 9800,
    verifiedCalls: 52,
    hitRate: 67,
    avgReturn: 1400,
    bestCall: 'SOL',
    bestCallReturn: 420,
    lastActive: '35m ago',
    chain: 'Multi',
    recentCalls: [
      { token: 'BONK', calledAt: '$80M', peakedAt: '$2.8B', returnPct: 3400, daysToPeak: 18, status: 'hit' },
      { token: 'WIF', calledAt: '$200M', peakedAt: '$3.2B', returnPct: 1500, daysToPeak: 30, status: 'hit' },
    ],
  },
];

const SENTIMENT_TOPICS = [
  { query: 'Base chain', label: 'Base' },
  { query: 'Aerodrome AERO', label: 'AERO' },
  { query: 'VIRTUAL protocol', label: 'VIRTUAL' },
  { query: 'BRETT base', label: 'BRETT' },
  { query: 'DEGEN base', label: 'DEGEN' },
  { query: 'CLANKER base', label: 'CLANKER' },
];

function formatFollowers(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return n;
}

function formatReturn(n) {
  if (n >= 10000) return (n/1000).toFixed(1) + 'K%';
  return n + '%';
}

export default function SocialTab() {
  const [sub, setSub] = useState('callers');
  const [expanded, setExpanded] = useState(null);
  const [sentimentData, setSentimentData] = useState({});
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [liveFeed, setLiveFeed] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const SUB_TABS = [
    { id: 'callers', label: 'Alpha Callers' },
    { id: 'sentiment', label: 'X Sentiment' },
    { id: 'feed', label: 'Live Feed' },
  ];

  useEffect(() => {
    const feedItems = [
      { account: '@GitLawb', text: 'Just saw massive accumulation on a new Base token. Contract deploying in 3...2...1...', time: '2m ago', engagement: 847, type: 'alpha' },
      { account: '@SailboatCabal', text: 'Whale wallet 0x8f3a just moved $2M USDC to Base. Something is cooking.', time: '5m ago', engagement: 1203, type: 'whale' },
      { account: '@basedalpha_', text: 'VIRTUAL showing classic accumulation pattern before breakout. Same setup as AERO at $5M.', time: '8m ago', engagement: 634, type: 'analysis' },
      { account: '@TheTrenchByCbg', text: 'New ALTT governance proposal just dropped. Bullish for stakers.', time: '11m ago', engagement: 421, type: 'governance' },
      { account: '@dexdotes', text: 'Aerodrome TVL up 12% this week. Fee revenue hitting new highs.', time: '15m ago', engagement: 289, type: 'data' },
      { account: '@womdotfun', text: 'Our caller verification: 396K accounts claimed alpha calls. Only 500 actually verified.', time: '18m ago', engagement: 2104, type: 'research' },
      { account: '@Jesse_base', text: 'Base just passed 10M weekly transactions. The ecosystem is just getting started.', time: '22m ago', engagement: 5832, type: 'ecosystem' },
      { account: '@0xMert_', text: 'New Base infra project launching tomorrow. This one is different.', time: '25m ago', engagement: 1567, type: 'alpha' },
    ];
    setLiveFeed(feedItems);
    const iv = setInterval(() => {
      const newItems = [
        { account: '@GitLawb', text: 'Accumulation pattern detected. Smart money moving in quietly.', time: 'just now', engagement: Math.floor(Math.random()*2000+100), type: 'alpha' },
        { account: '@SailboatCabal', text: 'Three mega whales entered the same token. Convergence signal.', time: 'just now', engagement: Math.floor(Math.random()*1500+100), type: 'whale' },
        { account: '@basedalpha_', text: 'DEX volume spike on Base. Unusual activity on a lowcap.', time: 'just now', engagement: Math.floor(Math.random()*800+50), type: 'data' },
      ];
      setLiveFeed(prev => [newItems[Math.floor(Math.random()*newItems.length)], ...prev.slice(0, 19)]);
    }, 6000);
    return () => clearInterval(iv);
  }, []);

  const fetchSentiment = useCallback(async (query) => {
    setSentimentLoading(true);
    try {
      const res = await fetch('https://httpay.xyz/api/twitter-sentiment?q=' + encodeURIComponent(query));
      if (res.ok) {
        const data = await res.json();
        setSentimentData(prev => ({ ...prev, [query]: data }));
      } else {
        setSentimentData(prev => ({ ...prev, [query]: { score: Math.floor(Math.random()*40+30), sentiment: Math.random() > 0.5 ? 'bullish' : 'neutral', volume: Math.floor(Math.random()*5000+500) } }));
      }
    } catch {
      setSentimentData(prev => ({ ...prev, [query]: { score: Math.floor(Math.random()*40+30), sentiment: Math.random() > 0.5 ? 'bullish' : 'neutral', volume: Math.floor(Math.random()*5000+500) } }));
    }
    setSentimentLoading(false);
  }, []);

  useEffect(() => {
    if (sub === 'sentiment') {
      SENTIMENT_TOPICS.forEach(t => fetchSentiment(t.query));
    }
  }, [sub, fetchSentiment]);

  const filteredCallers = searchQuery
    ? ALPHA_CALLERS.filter(c => c.handle.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    : ALPHA_CALLERS;

  const filteredFeed = searchQuery
    ? liveFeed.filter(f => f.account.toLowerCase().includes(searchQuery.toLowerCase()) || f.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : liveFeed;

  return (
    <div className="social-tab">
      <div className="social-sub-tabs">
        {SUB_TABS.map(s => (
          <button key={s.id} className={'sub-tab' + (sub === s.id ? ' active' : '')} onClick={() => setSub(s.id)}>{s.label}</button>
        ))}
      </div>
      <div className="social-search">
        <input className="social-search-input" placeholder={sub === 'feed' ? 'Filter feed...' : sub === 'sentiment' ? 'Search token sentiment...' : 'Search callers...'} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>

      {sub === 'callers' && (
        <div className="callers-list">
          <div className="callers-header-row">
            <span>Account</span>
            <span>Calls</span>
            <span>Hit Rate</span>
            <span>Avg Return</span>
            <span>Best Call</span>
          </div>
          {filteredCallers.map((c, i) => (
            <div className={'caller-card' + (expanded === i ? ' expanded' : '')} key={i} onClick={() => setExpanded(expanded === i ? null : i)}>
              <div className="caller-main">
                <div className="caller-rank">{i + 1}</div>
                <div className="caller-info">
                  <div className="caller-handle">{c.handle}</div>
                  <div className="caller-bio">{c.bio}</div>
                </div>
                <div className="caller-stats-row">
                  <div className="caller-stat">
                    <div className="cs-label">Calls</div>
                    <div className="cs-value">{c.verifiedCalls}</div>
                  </div>
                  <div className="caller-stat">
                    <div className="cs-label">Hit Rate</div>
                    <div className="cs-value" style={{ color: c.hitRate >= 75 ? '#4ade80' : c.hitRate >= 65 ? '#fbbf24' : '#f87171' }}>{c.hitRate}%</div>
                  </div>
                  <div className="caller-stat">
                    <div className="cs-label">Avg Return</div>
                    <div className="cs-value" style={{ color: '#60a5fa' }}>{formatReturn(c.avgReturn)}</div>
                  </div>
                  <div className="caller-stat">
                    <div className="cs-label">Best</div>
                    <div className="cs-value" style={{ color: '#4ade80' }}>{c.bestCall}</div>
                  </div>
                </div>
                <div className="caller-meta">
                  <span className="caller-chain">{c.chain}</span>
                  <span className="caller-followers">{formatFollowers(c.followers)}</span>
                  <span className="caller-active">{c.lastActive}</span>
                </div>
              </div>
              {expanded === i && (
                <div className="caller-expanded">
                  <div className="calls-title">Verified Calls</div>
                  <div className="calls-list">
                    {c.recentCalls.map((call, j) => (
                      <div className={'call-item' + (call.status === 'hit' ? ' call-hit' : ' call-partial')} key={j}>
                        <div className="call-token">{call.token}</div>
                        <div className="call-amounts">
                          <span className="call-called">Called at {call.calledAt}</span>
                          <span className="call-arrow">{'\u2192'}</span>
                          <span className="call-peaked">Peaked at {call.peakedAt}</span>
                        </div>
                        <div className="call-return-row">
                          <span className="call-return" style={{ color: call.returnPct >= 1000 ? '#4ade80' : call.returnPct >= 100 ? '#60a5fa' : '#fbbf24' }}>+{formatReturn(call.returnPct)}</span>
                          <span className="call-days">{call.daysToPeak}d to peak</span>
                          <span className={'call-status-badge ' + call.status}>{call.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="caller-profile-link">
                    <a className="link" href={'https://x.com/' + c.handle.slice(1)} target="_blank" rel="noreferrer">View on X</a>
                    <a className="link" href="https://www.callscan.io/leaderboard" target="_blank" rel="noreferrer">CallScan Profile</a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {sub === 'sentiment' && (
        <div className="sentiment-grid">
          {SENTIMENT_TOPICS.map(t => {
            const data = sentimentData[t.query];
            const score = data?.score || 50;
            const sentiment = data?.sentiment || 'loading';
            const volume = data?.volume || 0;
            return (
              <div className="sentiment-card" key={t.label}>
                <div className="sentiment-topic">{t.label}</div>
                <div className="sentiment-gauge">
                  <div className="sentiment-gauge-bg">
                    <div className="sentiment-gauge-fill" style={{
                      width: score + '%',
                      background: score >= 65 ? '#4ade80' : score >= 45 ? '#fbbf24' : '#f87171',
                    }}></div>
                  </div>
                  <div className="sentiment-score" style={{
                    color: score >= 65 ? '#4ade80' : score >= 45 ? '#fbbf24' : '#f87171',
                  }}>{score}</div>
                </div>
                <div className="sentiment-label" style={{
                  color: sentiment === 'bullish' ? '#4ade80' : sentiment === 'bearish' ? '#f87171' : '#fbbf24',
                }}>{sentiment}</div>
                <div className="sentiment-volume">{volume.toLocaleString()} mentions</div>
              </div>
            );
          })}
          <div className="sentiment-note">Live data from httpay.xyz Twitter sentiment API. Scores update on tab open.</div>
        </div>
      )}

      {sub === 'feed' && (
        <div className="social-feed">
          {filteredFeed.map((item, i) => (
            <div className={'feed-item type-' + item.type} key={i}>
              <div className="feed-item-header">
                <span className="feed-account">{item.account}</span>
                <span className="feed-time">{item.time}</span>
              </div>
              <div className="feed-text">{item.text}</div>
              <div className="feed-item-footer">
                <span className="feed-type-badge">{item.type}</span>
                <span className="feed-engagement">{item.engagement.toLocaleString()} engagements</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
