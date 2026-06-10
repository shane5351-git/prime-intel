const fs = require('fs');

const jsx = `import { useState, useEffect, useRef } from 'react';

const ALPHA_CALLERS = [
  {
    handle: '@GitLawb',
    name: 'GitLawb',
    tier: 'alpha',
    followers: 42800,
    totalCalls: 34,
    hits: 27,
    hitRate: 79,
    avgReturn: 4700,
    bestCall: 'LAWB',
    bestCallReturn: 14800,
    chain: 'Base',
    recentCalls: [
      { token: 'LAWB', calledAt: '$200K', peakedAt: '$30M', returnPct: 14800, daysToPeak: 14, status: 'hit', date: '2024-12-01' },
      { token: 'AERO', calledAt: '$12M', peakedAt: '$89M', returnPct: 641, daysToPeak: 21, status: 'hit', date: '2024-11-15' },
      { token: 'CLANKER', calledAt: '$800K', peakedAt: '$24M', returnPct: 2900, daysToPeak: 9, status: 'hit', date: '2024-11-28' },
      { token: 'MFER', calledAt: '$1.2M', peakedAt: '$4.8M', returnPct: 300, daysToPeak: 5, status: 'partial', date: '2024-12-05' },
    ],
  },
  {
    handle: '@TheTrenchByCbg',
    name: 'CBG',
    tier: 'alpha',
    followers: 31200,
    totalCalls: 28,
    hits: 21,
    hitRate: 75,
    avgReturn: 3200,
    bestCall: 'BRETT',
    bestCallReturn: 13900,
    chain: 'Base',
    recentCalls: [
      { token: 'ALTT', calledAt: '$150K', peakedAt: '$12.7M', returnPct: 8400, daysToPeak: 11, status: 'hit', date: '2024-11-20' },
      { token: 'BRETT', calledAt: '$3M', peakedAt: '$420M', returnPct: 13900, daysToPeak: 60, status: 'hit', date: '2024-09-15' },
      { token: 'MORPHO', calledAt: '$2M', peakedAt: '$18M', returnPct: 800, daysToPeak: 18, status: 'hit', date: '2024-11-10' },
    ],
  },
  {
    handle: '@basedalpha_',
    name: 'BasedAlpha',
    tier: 'alpha',
    followers: 28900,
    totalCalls: 22,
    hits: 16,
    hitRate: 72,
    avgReturn: 2800,
    bestCall: 'VIRTUAL',
    bestCallReturn: 6200,
    chain: 'Base',
    recentCalls: [
      { token: 'VIRTUAL', calledAt: '$4M', peakedAt: '$252M', returnPct: 6200, daysToPeak: 28, status: 'hit', date: '2024-10-20' },
      { token: 'DEGEN', calledAt: '$8M', peakedAt: '$86M', returnPct: 975, daysToPeak: 14, status: 'hit', date: '2024-11-01' },
      { token: 'HIGHER', calledAt: '$600K', peakedAt: '$9M', returnPct: 1400, daysToPeak: 7, status: 'hit', date: '2024-11-25' },
    ],
  },
  {
    handle: '@Jesse_base',
    name: 'Jesse Pollak',
    tier: 'alpha',
    followers: 142000,
    totalCalls: 12,
    hits: 10,
    hitRate: 83,
    avgReturn: 1800,
    bestCall: 'AERO',
    bestCallReturn: 1680,
    chain: 'Base',
    recentCalls: [
      { token: 'AERO', calledAt: '$5M', peakedAt: '$89M', returnPct: 1680, daysToPeak: 45, status: 'hit', date: '2024-09-01' },
      { token: 'VIRTUAL', calledAt: '$12M', peakedAt: '$252M', returnPct: 2000, daysToPeak: 22, status: 'hit', date: '2024-10-15' },
    ],
  },
  {
    handle: '@SailboatCabal',
    name: 'Sailboat Cabal',
    tier: 'alpha',
    followers: 18900,
    totalCalls: 41,
    hits: 31,
    hitRate: 76,
    avgReturn: 3600,
    bestCall: 'BRETT',
    bestCallReturn: 13900,
    chain: 'Base',
    recentCalls: [
      { token: 'BRETT', calledAt: '$3M', peakedAt: '$420M', returnPct: 13900, daysToPeak: 60, status: 'hit', date: '2024-09-15' },
      { token: 'ALTT', calledAt: '$150K', peakedAt: '$12.7M', returnPct: 8400, daysToPeak: 11, status: 'hit', date: '2024-11-20' },
      { token: 'LAWB', calledAt: '$200K', peakedAt: '$30M', returnPct: 14800, daysToPeak: 14, status: 'hit', date: '2024-12-01' },
    ],
  },
  {
    handle: '@0xMert_',
    name: 'Mert',
    tier: 'alpha',
    followers: 65400,
    totalCalls: 18,
    hits: 13,
    hitRate: 71,
    avgReturn: 2100,
    bestCall: 'AERO',
    bestCallReturn: 394,
    chain: 'Base',
    recentCalls: [
      { token: 'AERO', calledAt: '$18M', peakedAt: '$89M', returnPct: 394, daysToPeak: 12, status: 'hit', date: '2024-11-18' },
      { token: 'UNI', calledAt: '$6.2B', peakedAt: '$9.1B', returnPct: 47, daysToPeak: 30, status: 'partial', date: '2024-10-20' },
    ],
  },
  {
    handle: '@dexdotes',
    name: 'Dex Dotes',
    tier: 'alpha',
    followers: 15400,
    totalCalls: 16,
    hits: 11,
    hitRate: 69,
    avgReturn: 1900,
    bestCall: 'AERO',
    bestCallReturn: 1680,
    chain: 'Base',
    recentCalls: [
      { token: 'AERO', calledAt: '$5M', peakedAt: '$89M', returnPct: 1680, daysToPeak: 45, status: 'hit', date: '2024-09-01' },
      { token: 'MORPHO', calledAt: '$4M', peakedAt: '$18M', returnPct: 350, daysToPeak: 22, status: 'hit', date: '2024-11-01' },
    ],
  },
];

const AVERAGE_INFLUENCERS = [
  {
    handle: '@KaziBase',
    name: 'Kazi',
    tier: 'avg',
    followers: 8200,
    totalCalls: 45,
    hits: 22,
    hitRate: 49,
    avgReturn: 420,
    bestCall: 'BRETT',
    bestCallReturn: 340,
    chain: 'Base',
    recentCalls: [
      { token: 'BRETT', calledAt: '$380M', peakedAt: '$420M', returnPct: 10, daysToPeak: 3, status: 'hit', date: '2024-12-03' },
      { token: 'AERO', calledAt: '$82M', peakedAt: '$89M', returnPct: 8, daysToPeak: 5, status: 'hit', date: '2024-12-01' },
      { token: 'FLOKI', calledAt: '$1.2M', peakedAt: '$400K', returnPct: -67, daysToPeak: 0, status: 'miss', date: '2024-11-28' },
      { token: 'MFER2', calledAt: '$500K', peakedAt: '$200K', returnPct: -60, daysToPeak: 0, status: 'miss', date: '2024-11-25' },
      { token: 'DOGE2', calledAt: '$2M', peakedAt: '$800K', returnPct: -60, daysToPeak: 0, status: 'miss', date: '2024-11-20' },
    ],
  },
  {
    handle: '@ThePitchMan_base',
    name: 'The Pitch Man',
    tier: 'avg',
    followers: 5400,
    totalCalls: 38,
    hits: 17,
    hitRate: 45,
    avgReturn: 280,
    bestCall: 'DEGEN',
    bestCallReturn: 180,
    chain: 'Base',
    recentCalls: [
      { token: 'DEGEN', calledAt: '$72M', peakedAt: '$86M', returnPct: 19, daysToPeak: 4, status: 'hit', date: '2024-12-02' },
      { token: 'CLANKER', calledAt: '$20M', peakedAt: '$24M', returnPct: 20, daysToPeak: 3, status: 'hit', date: '2024-11-30' },
      { token: 'PEPE2', calledAt: '$800K', peakedAt: '$300K', returnPct: -63, daysToPeak: 0, status: 'miss', date: '2024-11-28' },
      { token: 'WOJAK2', calledAt: '$1.5M', peakedAt: '$600K', returnPct: -60, daysToPeak: 0, status: 'miss', date: '2024-11-22' },
      { token: 'TURBO2', calledAt: '$900K', peakedAt: '$350K', returnPct: -61, daysToPeak: 0, status: 'miss', date: '2024-11-18' },
    ],
  },
  {
    handle: '@BaseDegen_calls',
    name: 'Base Degen',
    tier: 'avg',
    followers: 3800,
    totalCalls: 52,
    hits: 24,
    hitRate: 46,
    avgReturn: 310,
    bestCall: 'VIRTUAL',
    bestCallReturn: 85,
    chain: 'Base',
    recentCalls: [
      { token: 'VIRTUAL', calledAt: '$230M', peakedAt: '$252M', returnPct: 9, daysToPeak: 2, status: 'hit', date: '2024-12-04' },
      { token: 'SHIB2', calledAt: '$1.8M', peakedAt: '$700K', returnPct: -61, daysToPeak: 0, status: 'miss', date: '2024-11-30' },
      { token: 'BONK2', calledAt: '$2.1M', peakedAt: '$900K', returnPct: -57, daysToPeak: 0, status: 'miss', date: '2024-11-25' },
    ],
  },
  {
    handle: '@CryptoGuru_base',
    name: 'Crypto Guru',
    tier: 'avg',
    followers: 6100,
    totalCalls: 41,
    hits: 19,
    hitRate: 46,
    avgReturn: 250,
    bestCall: 'ETH',
    bestCallReturn: 120,
    chain: 'Multi',
    recentCalls: [
      { token: 'ETH', calledAt: '$3.8K', peakedAt: '$4.2K', returnPct: 10, daysToPeak: 7, status: 'hit', date: '2024-12-01' },
      { token: 'NEWCOIN', calledAt: '$1M', peakedAt: '$400K', returnPct: -60, daysToPeak: 0, status: 'miss', date: '2024-11-28' },
      { token: 'SHIBA3', calledAt: '$600K', peakedAt: '$200K', returnPct: -67, daysToPeak: 0, status: 'miss', date: '2024-11-22' },
    ],
  },
];

const LIVE_CALLS_SEED = [
  { account: '@GitLawb', tier: 'alpha', token: 'LAWB', action: 'buy', calledAt: '$200K', current: '$30M', returnPct: 14800, time: '14m ago' },
  { account: '@TheTrenchByCbg', tier: 'alpha', token: 'ALTT', action: 'buy', calledAt: '$150K', current: '$12.7M', returnPct: 8400, time: '11m ago' },
  { account: '@KaziBase', tier: 'avg', token: 'FLOKI', action: 'buy', calledAt: '$1.2M', current: '$400K', returnPct: -67, time: '9m ago' },
  { account: '@basedalpha_', tier: 'alpha', token: 'VIRTUAL', action: 'buy', calledAt: '$4M', current: '$252M', returnPct: 6200, time: '8m ago' },
  { account: '@ThePitchMan_base', tier: 'avg', token: 'PEPE2', action: 'buy', calledAt: '$800K', current: '$300K', returnPct: -63, time: '6m ago' },
  { account: '@SailboatCabal', tier: 'alpha', token: 'BRETT', action: 'buy', calledAt: '$3M', current: '$420M', returnPct: 13900, time: '5m ago' },
  { account: '@Jesse_base', tier: 'alpha', token: 'AERO', action: 'buy', calledAt: '$5M', current: '$89M', returnPct: 1680, time: '4m ago' },
  { account: '@BaseDegen_calls', tier: 'avg', token: 'SHIB2', action: 'buy', calledAt: '$1.8M', current: '$700K', returnPct: -61, time: '3m ago' },
];

function formatFollowers(n) {
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return n;
}

function formatReturn(n) {
  if (Math.abs(n) >= 10000) return (n < 0 ? '-' : '') + (Math.abs(n)/1000).toFixed(1) + 'K%';
  return n + '%';
}

function timeAgo() {
  const mins = Math.floor(Math.random() * 3);
  return mins === 0 ? 'just now' : mins + 'm ago';
}

export default function SocialTab() {
  const [sub, setSub] = useState('callers');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortKey, setSortKey] = useState('hitRate');
  const [sortDir, setSortDir] = useState('desc');
  const [expanded, setExpanded] = useState(null);
  const [liveCalls, setLiveCalls] = useState(LIVE_CALLS_SEED);
  const feedRef = useRef(null);

  const SUB_TABS = [
    { id: 'callers', label: 'Callers' },
    { id: 'live', label: 'Live Calls' },
  ];

  useEffect(() => {
    const iv = setInterval(() => {
      const allCallers = [...ALPHA_CALLERS, ...AVERAGE_INFLUENCERS];
      const tokens = ['AERO','VIRTUAL','BRETT','DEGEN','CLANKER','LAWB','MORPHO','HIGHER','MFER','ALTT','PEPE2','FLOKI','BONK2','SHIB2','WOJAK2'];
      const caller = allCallers[Math.floor(Math.random() * allCallers.length)];
      const token = tokens[Math.floor(Math.random() * tokens.length)];
      const mcap = Math.floor(Math.random() * 50000 + 100);
      const mcapStr = mcap >= 1000 ? '$' + (mcap/1000).toFixed(1) + 'M' : '$' + mcap + 'K';
      const retPct = caller.tier === 'alpha'
        ? Math.floor(Math.random() * 3000 + 100)
        : Math.floor(Math.random() * 200 - 80);
      const newCall = {
        account: caller.handle,
        tier: caller.tier,
        token,
        action: 'buy',
        calledAt: mcapStr,
        current: mcapStr,
        returnPct: retPct,
        time: 'just now',
      };
      setLiveCalls(prev => [newCall, ...prev.slice(0, 49)]);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(iv);
  }, []);

  const allCallers = [...ALPHA_CALLERS, ...AVERAGE_INFLUENCERS];

  const filtered = allCallers.filter(c => {
    if (tierFilter === 'alpha') return c.tier === 'alpha';
    if (tierFilter === 'avg') return c.tier === 'avg';
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let va = a[sortKey], vb = b[sortKey];
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortArrow = ({ col }) => (
    <span className="sort-arrow">{sortKey === col ? (sortDir === 'asc' ? ' \u2191' : ' \u2193') : ''}</span>
  );

  const renderCallTable = (calls) => (
    <table className="calls-table">
      <thead>
        <tr>
          <th>Token</th>
          <th>Called At</th>
          <th>Peaked At</th>
          <th>Return</th>
          <th>Days</th>
          <th>Status</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {calls.map((call, j) => (
          <tr key={j} className={'call-row call-' + call.status}>
            <td className="call-cell token-cell">{call.token}</td>
            <td className="call-cell">{call.calledAt}</td>
            <td className="call-cell">{call.peakedAt}</td>
            <td className="call-cell return-cell" style={{
              color: call.returnPct >= 500 ? '#4ade80' : call.returnPct >= 100 ? '#60a5fa' : call.returnPct >= 0 ? '#fbbf24' : '#f87171'
            }}>+{formatReturn(call.returnPct)}</td>
            <td className="call-cell">{call.daysToPeak}d</td>
            <td className="call-cell"><span className={'status-badge status-' + call.status}>{call.status.toUpperCase()}</span></td>
            <td className="call-cell date-cell">{call.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="social-tab">
      <div className="social-sub-tabs">
        {SUB_TABS.map(s => (
          <button key={s.id} className={'sub-tab' + (sub === s.id ? ' active' : '')} onClick={() => setSub(s.id)}>{s.label}</button>
        ))}
      </div>

      {sub === 'callers' && (
        <>
          <div className="tier-filter-row">
            <button className={'tier-btn' + (tierFilter === 'all' ? ' active' : '')} onClick={() => setTierFilter('all')}>All</button>
            <button className={'tier-btn tier-alpha' + (tierFilter === 'alpha' ? ' active' : '')} onClick={() => setTierFilter('alpha')}>Alpha Callers</button>
            <button className={'tier-btn tier-avg' + (tierFilter === 'avg' ? ' active' : '')} onClick={() => setTierFilter('avg')}>Average Influencers</button>
          </div>
          <div className="callers-table-wrap">
            <table className="callers-table">
              <thead>
                <tr>
                  <th className="th-rank">#</th>
                  <th className="th-handle" onClick={() => toggleSort('handle')}>Account <SortArrow col="handle" /></th>
                  <th className="th-tier">Tier</th>
                  <th className="th-num" onClick={() => toggleSort('totalCalls')}>Calls <SortArrow col="totalCalls" /></th>
                  <th className="th-num" onClick={() => toggleSort('hits')}>Hits <SortArrow col="hits" /></th>
                  <th className="th-num" onClick={() => toggleSort('hitRate')}>Hit Rate <SortArrow col="hitRate" /></th>
                  <th className="th-num" onClick={() => toggleSort('avgReturn')}>Avg Return <SortArrow col="avgReturn" /></th>
                  <th className="th-num" onClick={() => toggleSort('bestCallReturn')}>Best Call <SortArrow col="bestCallReturn" /></th>
                  <th className="th-chain">Chain</th>
                  <th className="th-followers">Followers</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((c, i) => (
                  <tr key={i} className={'caller-row' + (expanded === i ? ' expanded' : '') + (c.tier === 'alpha' ? ' row-alpha' : ' row-avg')} onClick={() => setExpanded(expanded === i ? null : i)}>
                    <td className="td-rank">{i + 1}</td>
                    <td className="td-handle">
                      <a className="x-link" href={'https://x.com/' + c.handle.slice(1)} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>{c.handle}</a>
                    </td>
                    <td className="td-tier"><span className={'tier-tag tier-' + c.tier}>{c.tier === 'alpha' ? 'ALPHA' : 'AVG'}</span></td>
                    <td className="td-num">{c.totalCalls}</td>
                    <td className="td-num">{c.hits}</td>
                    <td className="td-num" style={{ color: c.hitRate >= 70 ? '#4ade80' : c.hitRate >= 50 ? '#fbbf24' : '#f87171' }}>{c.hitRate}%</td>
                    <td className="td-num" style={{ color: c.avgReturn >= 1000 ? '#4ade80' : c.avgReturn >= 100 ? '#60a5fa' : c.avgReturn >= 0 ? '#fbbf24' : '#f87171' }}>{formatReturn(c.avgReturn)}</td>
                    <td className="td-num">
                      <span style={{ color: c.bestCallReturn >= 1000 ? '#4ade80' : c.bestCallReturn >= 100 ? '#60a5fa' : '#fbbf24' }}>{formatReturn(c.bestCallReturn)}</span>
                      <span className="best-call-token"> {c.bestCall}</span>
                    </td>
                    <td className="td-chain">{c.chain}</td>
                    <td className="td-followers">{formatFollowers(c.followers)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {expanded !== null && sorted[expanded] && (
            <div className="expanded-detail">
              <div className="detail-header">
                <span className="detail-handle">{sorted[expanded].handle}</span>
                <span className={'tier-tag tier-' + sorted[expanded].tier}>{sorted[expanded].tier === 'alpha' ? 'ALPHA' : 'AVG'}</span>
                <a className="x-link" href={'https://x.com/' + sorted[expanded].handle.slice(1)} target="_blank" rel="noreferrer">X Profile</a>
              </div>
              {renderCallTable(sorted[expanded].recentCalls)}
            </div>
          )}
        </>
      )}

      {sub === 'live' && (
        <div className="live-feed" ref={feedRef}>
          <div className="live-header">
            <span className="live-dot" /><span className="live-label">LIVE</span>
            <span className="live-count">{liveCalls.length} calls tracked</span>
            <div className="live-legend">
              <span className="legend-item legend-alpha">Alpha Caller</span>
              <span className="legend-item legend-avg">Avg Influencer</span>
            </div>
          </div>
          <table className="live-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Account</th>
                <th>Tier</th>
                <th>Token</th>
                <th>Action</th>
                <th>Called At</th>
                <th>Current</th>
                <th>Return</th>
              </tr>
            </thead>
            <tbody>
              {liveCalls.map((c, i) => (
                <tr key={i} className={'live-row tier-row-' + c.tier}>
                  <td className="lc-time">{c.time}</td>
                  <td className="lc-account">
                    <a className="x-link" href={'https://x.com/' + c.account.slice(1)} target="_blank" rel="noreferrer">{c.account}</a>
                  </td>
                  <td className="lc-tier"><span className={'tier-tag tier-' + c.tier}>{c.tier === 'alpha' ? 'ALPHA' : 'AVG'}</span></td>
                  <td className="lc-token">{c.token}</td>
                  <td className="lc-action">{c.action.toUpperCase()}</td>
                  <td className="lc-mcap">{c.calledAt}</td>
                  <td className="lc-mcap">{c.current}</td>
                  <td className="lc-return" style={{
                    color: c.returnPct >= 500 ? '#4ade80' : c.returnPct >= 100 ? '#60a5fa' : c.returnPct >= 0 ? '#fbbf24' : '#f87171',
                    fontWeight: c.returnPct >= 500 ? 700 : 400,
                  }}>{c.returnPct >= 0 ? '+' : ''}{formatReturn(c.returnPct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('/home/node/.openclaw/workspace/prime-intel/src/SocialTab.jsx', jsx);
console.log('SocialTab.jsx written');
