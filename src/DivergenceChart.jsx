import { useState, useMemo } from 'react'

const DIVERGENCE_DATA = [
  { token: 'VIRTUAL', icon: '🤖', price: 1.24, priceChange24h: -8.3, whaleNetFlow: 4200000, retailNetFlow: -1800000, whaleTxCount: 47, retailTxCount: 3120, signal: 'strong_buy', divergence: 94, desc: 'Whales accumulating heavily while retail capitulates' },
  { token: 'CLANKER', icon: '🤖', price: 0.034, priceChange24h: -12.7, whaleNetFlow: 2800000, retailNetFlow: -3100000, whaleTxCount: 29, retailTxCount: 5430, signal: 'strong_buy', divergence: 91, desc: 'Extreme divergence — smart money scooping retail bags' },
  { token: 'AERO', icon: '🛩️', price: 1.87, priceChange24h: -5.1, whaleNetFlow: 3100000, retailNetFlow: -2400000, whaleTxCount: 38, retailTxCount: 4210, signal: 'strong_buy', divergence: 88, desc: 'Massive whale buying, retail panic selling on dip' },
  { token: 'DEGEN', icon: '🎰', price: 0.028, priceChange24h: 15.4, whaleNetFlow: -1200000, retailNetFlow: 3400000, whaleTxCount: 18, retailTxCount: 6780, signal: 'strong_sell', divergence: 86, desc: 'Retail FOMO pump, whales dumping into strength' },
  { token: 'BRETT', icon: '🐸', price: 0.089, priceChange24h: -3.4, whaleNetFlow: 1900000, retailNetFlow: -900000, whaleTxCount: 22, retailTxCount: 2870, signal: 'buy', divergence: 72, desc: 'Whale accumulation on pullback, retail exiting' },
  { token: 'USDC', icon: '💵', price: 1.00, priceChange24h: 0.0, whaleNetFlow: 15000000, retailNetFlow: -4800000, whaleTxCount: 120, retailTxCount: 8900, signal: 'caution', divergence: 65, desc: 'Whales rotating to stables — potential sell-off incoming' },
  { token: 'Aave', icon: '👻', price: 287.40, priceChange24h: -2.1, whaleNetFlow: -400000, retailNetFlow: 600000, whaleTxCount: 8, retailTxCount: 780, signal: 'sell', divergence: 55, desc: 'Retail buying, whales quietly reducing exposure' },
  { token: 'WEETH', icon: '🟢', price: 3902.10, priceChange24h: 1.5, whaleNetFlow: 3200000, retailNetFlow: 1100000, whaleTxCount: 41, retailTxCount: 620, signal: 'buy', divergence: 48, desc: 'Whale preference over retail, mild divergence' },
  { token: 'UNI', icon: '🦄', price: 14.32, priceChange24h: -1.8, whaleNetFlow: 800000, retailNetFlow: -200000, whaleTxCount: 12, retailTxCount: 1340, signal: 'neutral', divergence: 32, desc: 'Mild whale buying, retail slightly exiting' },
  { token: 'rETH', icon: '🔴', price: 3878.90, priceChange24h: 1.1, whaleNetFlow: 1800000, retailNetFlow: 900000, whaleTxCount: 28, retailTxCount: 410, signal: 'neutral', divergence: 18, desc: 'Aligned — both sides accumulating' },
  { token: 'ETH', icon: '💎', price: 3847.20, priceChange24h: 1.2, whaleNetFlow: 8500000, retailNetFlow: 6200000, whaleTxCount: 89, retailTxCount: 12400, signal: 'neutral', divergence: 15, desc: 'Aligned — both sides accumulating' },
  { token: 'cbETH', icon: '🔵', price: 3851.40, priceChange24h: 0.8, whaleNetFlow: 2100000, retailNetFlow: 1800000, whaleTxCount: 34, retailTxCount: 890, signal: 'neutral', divergence: 8, desc: 'Low divergence — aligned accumulation' },
]

function formatM(n) {
  if (Math.abs(n) >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (Math.abs(n) >= 1e3) return (n / 1e3).toFixed(0) + 'K'
  return n.toFixed(0)
}

function signalColor(s) {
  if (s === 'strong_buy') return 'var(--green)'
  if (s === 'buy') return '#4ade80'
  if (s === 'strong_sell') return 'var(--red)'
  if (s === 'sell') return '#f87171'
  if (s === 'caution') return 'var(--yellow)'
  return 'var(--text-secondary)'
}

function signalIcon(s) {
  if (s === 'strong_buy') return '🟢🟢'
  if (s === 'buy') return '🟢'
  if (s === 'strong_sell') return '🔴🔴'
  if (s === 'sell') return '🔴'
  if (s === 'caution') return '🟡'
  return '⚪'
}

function signalLabel(s) {
  const m = { strong_buy: 'STRONG BUY', buy: 'BUY', neutral: 'NEUTRAL', sell: 'SELL', strong_sell: 'STRONG SELL', caution: 'CAUTION' }
  return m[s] || s.toUpperCase()
}

function DivergenceBar({ value, max, color, label }) {
  const pct = Math.min(Math.abs(value) / max * 100, 100)
  const isNeg = value < 0
  return (
    <div className="dvg-bar-row">
      <div className="dvg-bar-label">{label}</div>
      <div className="dvg-bar-track">
        <div className="dvg-bar-center" />
        {!isNeg && <div className="dvg-bar-fill" style={{ width: pct + '%', background: color, left: '50%' }} />}
        {isNeg && <div className="dvg-bar-fill dvg-bar-fill-left" style={{ width: pct + '%', background: color, right: '50%' }} />}
      </div>
      <div className={'dvg-bar-val ' + (isNeg ? 'value-negative' : 'value-positive')}>
        {isNeg ? '' : '+'}${formatM(Math.abs(value))}
      </div>
    </div>
  )
}

export default function DivergenceChart() {
  const [filter, setFilter] = useState('all')

  const sorted = useMemo(() => {
    let data = [...DIVERGENCE_DATA]
    if (filter === 'buy') data = data.filter(d => d.signal === 'strong_buy' || d.signal === 'buy')
    else if (filter === 'sell') data = data.filter(d => d.signal === 'strong_sell' || d.signal === 'sell')
    else if (filter === 'extreme') data = data.filter(d => d.divergence >= 70)
    return data.sort((a, b) => b.divergence - a.divergence)
  }, [filter])

  const maxFlow = Math.max(...DIVERGENCE_DATA.flatMap(d => [Math.abs(d.whaleNetFlow), Math.abs(d.retailNetFlow)]))

  const totalWhaleBuy = DIVERGENCE_DATA.reduce((s, d) => s + (d.whaleNetFlow > 0 ? d.whaleNetFlow : 0), 0)
  const totalWhaleSell = DIVERGENCE_DATA.reduce((s, d) => s + (d.whaleNetFlow < 0 ? Math.abs(d.whaleNetFlow) : 0), 0)
  const totalRetailBuy = DIVERGENCE_DATA.reduce((s, d) => s + (d.retailNetFlow > 0 ? d.retailNetFlow : 0), 0)
  const totalRetailSell = DIVERGENCE_DATA.reduce((s, d) => s + (d.retailNetFlow < 0 ? Math.abs(d.retailNetFlow) : 0), 0)
  const extremeDivergence = DIVERGENCE_DATA.filter(d => d.divergence >= 70).length

  return (
    <div className="dvg-container">
      {/* Summary Stats */}
      <div className="dvg-summary">
        <div className="dvg-sum-card dvg-sum-whale">
          <div className="dvg-sum-icon">🐋</div>
          <div className="dvg-sum-info">
            <div className="dvg-sum-label">Whale Net Flow</div>
            <div className="dvg-sum-val value-positive">+${formatM(totalWhaleBuy - totalWhaleSell)}</div>
          </div>
        </div>
        <div className="dvg-sum-card dvg-sum-retail">
          <div className="dvg-sum-icon">👥</div>
          <div className="dvg-sum-info">
            <div className="dvg-sum-label">Retail Net Flow</div>
            <div className={'dvg-sum-val ' + ((totalRetailBuy - totalRetailSell) >= 0 ? 'value-positive' : 'value-negative')}>
              {(totalRetailBuy - totalRetailSell) >= 0 ? '+' : ''}{formatM(totalRetailBuy - totalRetailSell)}
            </div>
          </div>
        </div>
        <div className="dvg-sum-card dvg-sum-div">
          <div className="dvg-sum-icon">⚡</div>
          <div className="dvg-sum-info">
            <div className="dvg-sum-label">Extreme Divergences</div>
            <div className="dvg-sum-val" style={{ color: 'var(--yellow)' }}>{extremeDivergence} tokens</div>
          </div>
        </div>
        <div className="dvg-sum-card dvg-sum-signal">
          <div className="dvg-sum-icon">📊</div>
          <div className="dvg-sum-info">
            <div className="dvg-sum-label">Strongest Signal</div>
            <div className="dvg-sum-val" style={{ color: signalColor('strong_buy') }}>🟢🟢 BUY</div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="dvg-filters">
        {['all', 'extreme', 'buy', 'sell'].map(f => (
          <button key={f} className={'dvg-filter-btn' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>
            {f === 'all' ? '📊 All' : f === 'extreme' ? '⚡ High Divergence' : f === 'buy' ? '🟢 Whale Buying' : '🔴 Whale Selling'}
          </button>
        ))}
      </div>

      {/* Divergence Cards */}
      <div className="dvg-list">
        {sorted.map((d, i) => (
          <div key={d.token} className="dvg-card">
            {/* Header */}
            <div className="dvg-card-header">
              <div className="dvg-token-info">
                <span className="dvg-token-icon">{d.icon}</span>
                <span className="dvg-token-name">{d.token}</span>
                <span className="dvg-token-price">${d.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}</span>
                <span className={'dvg-token-change ' + (d.priceChange24h >= 0 ? 'change-positive' : 'change-negative')}>
                  {d.priceChange24h >= 0 ? '+' : ''}{d.priceChange24h}%
                </span>
              </div>
              <div className="dvg-signal-row">
                <span className="dvg-signal-icon">{signalIcon(d.signal)}</span>
                <span className="dvg-signal-label" style={{ color: signalColor(d.signal) }}>{signalLabel(d.signal)}</span>
              </div>
            </div>

            {/* Divergence Meter */}
            <div className="dvg-meter-row">
              <span className="dvg-meter-label">Divergence</span>
              <div className="dvg-meter-track">
                <div className="dvg-meter-fill" style={{
                  width: d.divergence + '%',
                  background: d.divergence >= 70 ? 'linear-gradient(90deg, var(--yellow), var(--red))' : d.divergence >= 40 ? 'linear-gradient(90deg, var(--green), var(--yellow))' : 'var(--green)'
                }} />
              </div>
              <span className="dvg-meter-val">{d.divergence}%</span>
            </div>

            {/* Flow Bars */}
            <div className="dvg-bars">
              <DivergenceBar value={d.whaleNetFlow} max={maxFlow} color="var(--accent)" label="🐋 Whale" />
              <DivergenceBar value={d.retailNetFlow} max={maxFlow} color="var(--cyan)" label="👥 Retail" />
            </div>

            {/* Description */}
            <div className="dvg-desc">{d.desc}</div>

            {/* Footer Stats */}
            <div className="dvg-footer">
              <div className="dvg-foot-stat">
                <span className="dvg-foot-label">Whale Txns</span>
                <span className="dvg-foot-val">{d.whaleTxCount}</span>
              </div>
              <div className="dvg-foot-stat">
                <span className="dvg-foot-label">Retail Txns</span>
                <span className="dvg-foot-val">{d.retailTxCount.toLocaleString()}</span>
              </div>
              <div className="dvg-foot-stat">
                <span className="dvg-foot-label">Ratio</span>
                <span className="dvg-foot-val">1:{Math.round(d.retailTxCount / d.whaleTxCount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="dvg-legend">
        <div className="dvg-legend-item">
          <div className="dvg-legend-swatch" style={{ background: 'var(--accent)' }} />
          <span>Whale Flow (left=selling, right=buying)</span>
        </div>
        <div className="dvg-legend-item">
          <div className="dvg-legend-swatch" style={{ background: 'var(--cyan)' }} />
          <span>Retail Flow (left=selling, right=buying)</span>
        </div>
        <div className="dvg-legend-item">
          <span style={{ color: 'var(--yellow)' }}>⚡ Divergence 70%+ = actionable signal</span>
        </div>
      </div>
    </div>
  )
}
