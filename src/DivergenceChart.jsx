import { useState, useMemo } from 'react';

const DIVERGENCE_DATA = [
  { token: 'VIRTUAL', price: 0.544, change24h: -3.2, whaleFlow: 4200000, retailFlow: -1800000, divergence: 94, signal: 'STRONG BUY', whaleTxs: 47, retailTxs: 312, desc: 'Whales accumulating heavily while retail exits. Strong smart money signal.' },
  { token: 'CLANKER', price: 0.042, change24h: 12.4, whaleFlow: 2800000, retailFlow: -950000, divergence: 91, signal: 'STRONG BUY', whaleTxs: 31, retailTxs: 198, desc: 'Consistent whale accumulation over 48h. Retail capitulation creating entry.' },
  { token: 'AERO', price: 0.332, change24h: 6.1, whaleFlow: 1900000, retailFlow: -420000, divergence: 82, signal: 'BUY', whaleTxs: 28, retailTxs: 156, desc: 'Moderate whale buying pressure. Retail showing signs of fatigue.' },
  { token: 'ETH', price: 1628.04, change24h: -0.8, whaleFlow: 1200000, retailFlow: 680000, divergence: 38, signal: 'NEUTRAL', whaleTxs: 89, retailTxs: 4210, desc: 'Both whale and retail aligned. No significant divergence detected.' },
  { token: 'BRETT', price: 0.0053, change24h: -4.1, whaleFlow: -890000, retailFlow: 1200000, divergence: 72, signal: 'SELL', whaleTxs: 15, retailTxs: 287, desc: 'Whales reducing positions. Retail FOMO buying into distribution.' },
  { token: 'DEGEN', price: 0.0016, change24h: 2.3, whaleFlow: -2100000, retailFlow: 3400000, divergence: 86, signal: 'STRONG SELL', whaleTxs: 22, retailTxs: 892, desc: 'Massive retail pump while whales exit. Classic distribution pattern.' },
];

function fmt(n) { return n >= 1e6 ? '$' + (n/1e6).toFixed(1) + 'M' : n >= 1e3 ? '$' + (n/1e3).toFixed(0) + 'K' : '$' + n; }

function signalColor(sig) {
  if (sig.includes('STRONG BUY')) return 'var(--positive)';
  if (sig.includes('BUY')) return '#7ab87a';
  if (sig.includes('STRONG SELL')) return 'var(--negative)';
  if (sig.includes('SELL')) return '#d47070';
  return 'var(--text-secondary)';
}

function meterColor(d) {
  if (d >= 70) return 'var(--warning)';
  if (d >= 40) return 'var(--accent)';
  return 'var(--text-muted)';
}

export default function DivergenceChart() {
  const [filter, setFilter] = useState('all');

  const summary = useMemo(() => {
    let wFlow = 0, rFlow = 0, extreme = 0, best = DIVERGENCE_DATA[0];
    DIVERGENCE_DATA.forEach(d => {
      wFlow += d.whaleFlow;
      rFlow += d.retailFlow;
      if (d.divergence >= 70) extreme++;
      if (d.divergence > best.divergence) best = d;
    });
    return { whaleFlow: wFlow, retailFlow: rFlow, extreme, bestSignal: best.token + ' ' + best.signal };
  }, []);

  const filtered = useMemo(() => {
    return DIVERGENCE_DATA.filter(d => {
      if (filter === 'all') return true;
      if (filter === 'high') return d.divergence >= 70;
      if (filter === 'buys') return d.whaleFlow > 0 && d.retailFlow < 0;
      if (filter === 'sells') return d.whaleFlow < 0 && d.retailFlow > 0;
      return true;
    });
  }, [filter]);

  return (
    <div className="dvg-container">
      <div className="dvg-summary">
        <div className="dvg-sum-card whale">
          <div className="dvg-sum-label">Whale Net Flow</div>
          <div className="dvg-sum-val" style={{color: summary.whaleFlow >= 0 ? 'var(--positive)' : 'var(--negative)'}}>{summary.whaleFlow >= 0 ? '+' : ''}{fmt(Math.abs(summary.whaleFlow))}</div>
        </div>
        <div className="dvg-sum-card retail">
          <div className="dvg-sum-label">Retail Net Flow</div>
          <div className="dvg-sum-val" style={{color: summary.retailFlow >= 0 ? 'var(--positive)' : 'var(--negative)'}}>{summary.retailFlow >= 0 ? '+' : ''}{fmt(Math.abs(summary.retailFlow))}</div>
        </div>
        <div className="dvg-sum-card div">
          <div className="dvg-sum-label">Extreme Divergences</div>
          <div className="dvg-sum-val" style={{color: 'var(--warning)'}}>{summary.extreme}</div>
        </div>
        <div className="dvg-sum-card signal">
          <div className="dvg-sum-label">Top Signal</div>
          <div className="dvg-sum-val">{summary.bestSignal}</div>
        </div>
      </div>

      <div className="dvg-filters">
        {['all','high','buys','sells'].map(f => (
          <button key={f} className={'dvg-filter-btn' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All' : f === 'high' ? 'High Divergence' : f === 'buys' ? 'Whale Buying' : 'Whale Selling'}
          </button>
        ))}
      </div>

      <div className="dvg-legend">
        <div className="dvg-legend-item"><div className="dvg-legend-swatch" style={{background:'var(--accent-hover)'}}></div>Whale</div>
        <div className="dvg-legend-item"><div className="dvg-legend-swatch" style={{background:'var(--text-secondary)'}}></div>Retail</div>
        <div className="dvg-legend-item"><div className="dvg-legend-swatch" style={{background:'var(--warning)'}}></div>High divergence (70%+)</div>
      </div>

      <div className="dvg-list">
        {filtered.map(d => {
          const maxFlow = Math.max(...DIVERGENCE_DATA.map(x => Math.max(Math.abs(x.whaleFlow), Math.abs(x.retailFlow))));
          const wPct = (d.whaleFlow / maxFlow) * 50;
          const rPct = (d.retailFlow / maxFlow) * 50;
          return (
            <div className="dvg-card" key={d.token}>
              <div className="dvg-card-header">
                <div className="dvg-token-info">
                  <span className="dvg-token-name">{d.token}</span>
                  <span className="dvg-token-price">${d.price.toLocaleString()}</span>
                  <span className={'dvg-token-change ' + (d.change24h >= 0 ? 'change-positive' : 'change-negative')}>{d.change24h >= 0 ? '+' : ''}{d.change24h}%</span>
                </div>
                <span className="dvg-signal-label" style={{color: signalColor(d.signal)}}>{d.signal}</span>
              </div>
              <div className="dvg-meter-row">
                <span className="dvg-meter-label">Divergence</span>
                <div className="dvg-meter-track"><div className="dvg-meter-fill" style={{width: d.divergence + '%', background: meterColor(d.divergence)}}></div></div>
                <span className="dvg-meter-val">{d.divergence}%</span>
              </div>
              <div className="dvg-bars">
                <div className="dvg-bar-row">
                  <span className="dvg-bar-label">Whale</span>
                  <div className="dvg-bar-track">
                    <div className="dvg-bar-center"></div>
                    <div className="dvg-bar-fill" style={{
                      left: d.whaleFlow >= 0 ? '50%' : (50 - Math.abs(wPct)) + '%',
                      width: Math.abs(wPct) + '%',
                      background: 'var(--accent-hover)'
                    }}></div>
                  </div>
                  <span className={'dvg-bar-val ' + (d.whaleFlow >= 0 ? 'change-positive' : 'change-negative')}>{d.whaleFlow >= 0 ? '+' : ''}{fmt(Math.abs(d.whaleFlow))}</span>
                </div>
                <div className="dvg-bar-row">
                  <span className="dvg-bar-label">Retail</span>
                  <div className="dvg-bar-track">
                    <div className="dvg-bar-center"></div>
                    <div className="dvg-bar-fill" style={{
                      left: d.retailFlow >= 0 ? '50%' : (50 - Math.abs(rPct)) + '%',
                      width: Math.abs(rPct) + '%',
                      background: 'var(--text-secondary)'
                    }}></div>
                  </div>
                  <span className={'dvg-bar-val ' + (d.retailFlow >= 0 ? 'change-positive' : 'change-negative')}>{d.retailFlow >= 0 ? '+' : ''}{fmt(Math.abs(d.retailFlow))}</span>
                </div>
              </div>
              <div className="dvg-desc">{d.desc}</div>
              <div className="dvg-footer">
                <div className="dvg-foot-stat"><span className="dvg-foot-label">Whale txns</span><span className="dvg-foot-val">{d.whaleTxs}</span></div>
                <div className="dvg-foot-stat"><span className="dvg-foot-label">Retail txns</span><span className="dvg-foot-val">{d.retailTxs}</span></div>
                <div className="dvg-foot-stat"><span className="dvg-foot-label">W/R ratio</span><span className="dvg-foot-val">{(d.whaleTxs / d.retailTxs * 100).toFixed(0)}%</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
