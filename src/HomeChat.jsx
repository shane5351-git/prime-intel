import { useState, useRef, useEffect } from 'react';

const PRESETS = [
  'Which tokens are whales accumulating right now?',
  'Show me whale vs retail divergence for AERO',
  'What are the top 3 whale wallets doing today?',
  'Is VIRTUAL still being accumulated by smart money?',
  'Any unusual whale activity on Base in the last hour?',
];

const RESPONSES = {
  accumulation: {
    keywords: ['accumul', 'buying', 'buy', 'accum', 'loading', 'scoop', 'stack'],
    generate: () => {
      const tokens = [
        { name: 'AERO', whales: 3, flow: '+$2.4M', signal: 'Strong Accumulation', pct: 87 },
        { name: 'VIRTUAL', whales: 2, flow: '+$1.8M', signal: 'Accumulation', pct: 74 },
        { name: 'CLANKER', whales: 4, flow: '+$3.1M', signal: 'Strong Accumulation', pct: 92 },
        { name: 'BRETT', whales: 2, flow: '+$890K', signal: 'Moderate', pct: 61 },
      ];
      const picks = tokens.sort(() => Math.random() - 0.5).slice(0, 3);
      return {
        title: 'Whale Accumulation Report',
        summary: `${picks.length} tokens showing active whale accumulation on Base in the last 24h.`,
        tokens: picks,
        footer: 'Data sourced from on-chain flow analysis. Signals refresh every 15 min.'
      };
    }
  },
  divergence: {
    keywords: ['diverg', 'retail', 'retail vs', 'vs retail', 'contrarian', 'opposite'],
    generate: () => ({
      title: 'Whale vs Retail Divergence',
      summary: '2 high-conviction divergences detected on Base right now.',
      divergences: [
        { token: 'AERO', whaleFlow: '+$2.4M', retailFlow: '-$890K', divergence: 87, signal: 'STRONG BUY - Whales accumulating while retail sells', interpretation: 'Classic smart money accumulation. 3 mega whales added AERO positions in the last 6h while retail exited. Historically, 70%+ divergence on AERO resolves upward within 48h.' },
        { token: 'DEGEN', whaleFlow: '-$1.2M', retailFlow: '+$780K', divergence: 79, signal: 'STRONG SELL - Whales exiting while retail buys', interpretation: 'Retail FOMO pump detected. 2 mega whales and 4 whale-tier wallets reduced DEGEN exposure. Divergence has been building for 12h. Consider reducing exposure.' },
      ],
      footer: 'Divergence signals above 70% have historically predicted 5d price direction with 68% accuracy on Base tokens.'
    })
  },
  top: {
    keywords: ['top', 'biggest', 'largest', 'who', 'leading', 'rank'],
    generate: () => ({
      title: 'Top Whale Activity Today',
      summary: '3 mega whales account for 62% of large-tier volume on Base today.',
      whales: [
        { addr: '0x8f3a...d4e2', ens: 'basebuilder.eth', action: 'Accumulating AERO, VIRTUAL', volume: '$8.2M', winRate: '82%', note: '5 consecutive winning trades. Largest AERO position increase in 30 days.' },
        { addr: '0x2d7c...a1f3', ens: 'whaleking.base', action: 'Exiting DEGEN, adding CLANKER', volume: '$5.4M', winRate: '78%', note: 'Rotating out of meme positions. Added 340K CLANKER in 3 transactions.' },
        { addr: '0xb4e1...c7d9', ens: '0xb4e1', action: 'Building ETH long via WETH', volume: '$3.1M', winRate: '71%', note: 'Consistent ETH accumulation pattern. 12 buys, 0 sells in 48h.' },
      ],
      footer: 'Win rates calculated over last 90 days. Volume includes all Base-chain transactions above $100K.'
    })
  },
  unusual: {
    keywords: ['unusual', 'anomal', 'alert', 'strange', 'weird', 'spike', 'surge', 'big move'],
    generate: () => ({
      title: 'Anomaly Alert',
      summary: '2 unusual whale patterns detected in the last hour.',
      alerts: [
        { severity: 'HIGH', token: 'CLANKER', detail: '4 mega whales moved $4.2M USDC to Base in the last 45 min. Possible coordinated buy. No public announcement detected.', time: '45 min ago' },
        { severity: 'MEDIUM', token: 'ETH', detail: 'Whale 0x8f3a...d4e2 moved 1,200 WETH from Ethereum L1 to Base via the bridge. Largest single L1->Base transfer for this wallet in 60 days.', time: '1h ago' },
      ],
      footer: 'Anomaly detection monitors transaction volume, cross-chain flows, and wallet behavior deviations from 30d baselines.'
    })
  },
};

function getResponse(input) {
  const lower = input.toLowerCase();
  for (const [key, config] of Object.entries(RESPONSES)) {
    if (config.keywords.some(k => lower.includes(k))) {
      return { type: key, data: config.generate() };
    }
  }
  return {
    type: 'general',
    data: {
      title: 'Whale Intelligence',
      summary: 'Based on current on-chain activity, whale sentiment on Base is net bullish. Accumulation outpaces distribution by 1.3x across top 20 tokens. The strongest signals are in AERO and CLANKER right now.',
      suggestion: 'Try asking about specific tokens, whale accumulation, divergence signals, or unusual activity for detailed analysis.',
      footer: 'Prime:Intel monitors 2,400+ whale-class wallets across Base chain.'
    }
  };
}

function renderResponse(response) {
  const { type, data } = response;

  if (type === 'accumulation') {
    return (
      <div className="chat-card">
        <div className="chat-card-title">{data.title}</div>
        <div className="chat-card-summary">{data.summary}</div>
        <div className="chat-accum-list">
          {data.tokens.map((t, i) => (
            <div className="chat-accum-row" key={i}>
              <div className="chat-accum-token">{t.name}</div>
              <div className="chat-accum-meter">
                <div className="chat-accum-bar" style={{ width: t.pct + '%' }}></div>
              </div>
              <div className="chat-accum-pct">{t.pct}%</div>
              <div className="chat-accum-detail">
                <span className="chat-accum-signal">{t.signal}</span>
                <span className="chat-accum-flow">{t.flow}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-card-footer">{data.footer}</div>
      </div>
    );
  }

  if (type === 'divergence') {
    return (
      <div className="chat-card">
        <div className="chat-card-title">{data.title}</div>
        <div className="chat-card-summary">{data.summary}</div>
        {data.divergences.map((d, i) => (
          <div className="chat-div-item" key={i}>
            <div className="chat-div-header">
              <span className="chat-div-token">{d.token}</span>
              <span className="chat-div-badge">{d.divergence}%</span>
            </div>
            <div className="chat-div-flows">
              <div className="chat-div-flow">Whale: <span className="chat-pos">{d.whaleFlow}</span></div>
              <div className="chat-div-flow">Retail: <span className="chat-neg">{d.retailFlow}</span></div>
            </div>
            <div className="chat-div-signal">{d.signal}</div>
            <div className="chat-div-interp">{d.interpretation}</div>
          </div>
        ))}
        <div className="chat-card-footer">{data.footer}</div>
      </div>
    );
  }

  if (type === 'top') {
    return (
      <div className="chat-card">
        <div className="chat-card-title">{data.title}</div>
        <div className="chat-card-summary">{data.summary}</div>
        {data.whales.map((w, i) => (
          <div className="chat-whale-item" key={i}>
            <div className="chat-whale-header">
              <span className="chat-whale-ens">{w.ens}</span>
              <span className="chat-whale-addr">{w.addr}</span>
            </div>
            <div className="chat-whale-action">{w.action}</div>
            <div className="chat-whale-stats">
              <span>Vol: {w.volume}</span>
              <span>Win: {w.winRate}</span>
            </div>
            <div className="chat-whale-note">{w.note}</div>
          </div>
        ))}
        <div className="chat-card-footer">{data.footer}</div>
      </div>
    );
  }

  if (type === 'unusual') {
    return (
      <div className="chat-card">
        <div className="chat-card-title">{data.title}</div>
        <div className="chat-card-summary">{data.summary}</div>
        {data.alerts.map((a, i) => (
          <div className={'chat-alert-item chat-alert-' + a.severity.toLowerCase()} key={i}>
            <div className="chat-alert-header">
              <span className="chat-alert-sev">{a.severity}</span>
              <span className="chat-alert-token">{a.token}</span>
              <span className="chat-alert-time">{a.time}</span>
            </div>
            <div className="chat-alert-detail">{a.detail}</div>
          </div>
        ))}
        <div className="chat-card-footer">{data.footer}</div>
      </div>
    );
  }

  return (
    <div className="chat-card">
      <div className="chat-card-title">{data.title}</div>
      <div className="chat-card-summary">{data.summary}</div>
      <div className="chat-card-suggestion">{data.suggestion}</div>
      <div className="chat-card-footer">{data.footer}</div>
    </div>
  );
}

export default function HomeChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const resp = getResponse(msg);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', content: resp }]);
    }, 800 + Math.random() * 700);
  };

  return (
    <div className="home-chat">
      <div className="home-hero">
        <div className="home-title">PRIME : INTEL</div>
        <div className="home-sub">On-chain whale intelligence for Base</div>
        <div className="home-tagline">Ask Prime about whale accumulation</div>
      </div>

      <div className="chat-window">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="chat-empty-icon">P</div>
              <div className="chat-empty-text">Ask about whale wallets, accumulation signals, or market divergence</div>
            </div>
          )}
          {messages.map((m, i) => (
            <div className={'chat-msg chat-msg-' + m.role} key={i}>
              {m.role === 'user' ? (
                <div className="chat-bubble chat-bubble-user">{m.content}</div>
              ) : (
                <div className="chat-bubble chat-bubble-assistant">
                  <div className="chat-label">Prime</div>
                  {renderResponse(m.content)}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="chat-msg chat-msg-assistant">
              <div className="chat-bubble chat-bubble-assistant">
                <div className="chat-label">Prime</div>
                <div className="chat-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef}></div>
        </div>

        <div className="chat-presets">
          {PRESETS.map((p, i) => (
            <button className="chat-preset-btn" key={i} onClick={() => send(p)}>{p}</button>
          ))}
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Ask about whale accumulation..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isTyping && send()}
            disabled={isTyping}
          />
          <button className="chat-send-btn" onClick={() => send()} disabled={isTyping || !input.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}
