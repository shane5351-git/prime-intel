import { useState, useEffect, useCallback, useRef } from 'react';

const BASE_RPC = 'https://mainnet.base.org';
const BASESCAN_API = 'https://api.basescan.org/api';

const ERC20_ABI = {
  balanceOf: '0x70a08231',
  decimals: '0x313ce567',
};

const KNOWN_TOKENS = [
  { symbol: 'ETH', address: null, cgId: 'ethereum', decimals: 18 },
  { symbol: 'WETH', address: '0x4200000000000000000000000000000000000006', cgId: 'ethereum', decimals: 18 },
  { symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', cgId: 'usd-coin', decimals: 6 },
  { symbol: 'AERO', address: '0x940181a673854A1F25a7ba6a3f9B6aC03b7b0D24', cgId: 'aerodrome-finance', decimals: 18 },
  { symbol: 'VIRTUAL', address: '0x0b3e328455C4059EEb9e3f01b2D1046D3367d004', cgId: 'virtual-protocol', decimals: 18 },
  { symbol: 'BRETT', address: '0x535f7a7C0B8eE0eE5d386020D4e3a1eDc7a5B28C', cgId: 'brett', decimals: 18 },
  { symbol: 'DAI', address: '0x50cF5d8aB3C792e17f9B4a8b0922f8cc2A8a2f1E', cgId: 'dai', decimals: 18 },
];

const PIE_COLORS = ['#8a8a8a','#6a6a6a','#5a5a5a','#4a4a4a','#3a3a3a','#2a2a2a','#1a1a1a'];

async function rpcCall(method, params) {
  const r = await fetch(BASE_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const d = await r.json();
  return d.result;
}

async function getEthBalance(addr) {
  const hex = await rpcCall('eth_getBalance', [addr, 'latest']);
  return parseInt(hex, 16) / 1e18;
}

async function getErc20Balance(tokenAddr, walletAddr) {
  const data = ERC20_ABI.balanceOf + walletAddr.slice(2).padStart(64, '0');
  const hex = await rpcCall('eth_call', [{ to: tokenAddr, data }, 'latest']);
  if (!hex || hex === '0x' || hex === '0x0') return 0;
  return parseInt(hex, 16);
}

async function getDecimals(tokenAddr) {
  const data = ERC20_ABI.decimals;
  const hex = await rpcCall('eth_call', [{ to: tokenAddr, data }, 'latest']);
  if (!hex || hex === '0x') return 18;
  return parseInt(hex, 16);
}

async function getPrices(cgIds) {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=' + cgIds.join(',') + '&vs_currencies=usd&include_24hr_change=true');
    return await r.json();
  } catch { return {}; }
}

async function getTransactions(addr) {
  try {
    const r = await fetch(BASESCAN_API + '?module=account&action=txlist&address=' + addr + '&startblock=0&endblock=99999999&sort=desc&page=1&offset=20');
    const d = await r.json();
    return (d.result || []).filter(t => typeof t === 'object' && t.hash);
  } catch { return []; }
}

export default function WalletTab() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [pnl24h, setPnl24h] = useState(0);
  const [txs, setTxs] = useState([]);
  const [sortBy, setSortBy] = useState('allocation');
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [fetching, setFetching] = useState(false);
  const intervalRef = useRef(null);

  const fetchPortfolio = useCallback(async (addr) => {
    if (fetching) return;
    setFetching(true);
    setError(null);
    try {
      const balArr = [];
      const ethBal = await getEthBalance(addr);
      balArr.push({ symbol: 'ETH', balance: ethBal, raw: ethBal, decimals: 18, cgId: 'ethereum', isNative: true });

      for (const tk of KNOWN_TOKENS.slice(1)) {
        try {
          const raw = await getErc20Balance(tk.address, addr);
          if (raw === 0) continue;
          const dec = await getDecimals(tk.address);
          const bal = raw / Math.pow(10, dec);
          balArr.push({ symbol: tk.symbol, balance: bal, raw, decimals: dec, cgId: tk.cgId, address: tk.address });
        } catch { /* skip */ }
      }

      const cgIds = [...new Set(balArr.map(b => b.cgId))];
      const prices = await getPrices(cgIds);

      let total = 0;
      let pnl = 0;
      const withPrices = balArr.map(b => {
        const p = prices[b.cgId];
        const price = p?.usd || 0;
        const change = p?.usd_24h_change || 0;
        const value = b.balance * price;
        total += value;
        pnl += value * (change / 100);
        return { ...b, price, change, value };
      }).filter(b => b.value > 0.01);

      setBalances(withPrices);
      setTotalValue(total);
      setPnl24h(pnl);
      setLastRefresh(new Date());

      const txData = await getTransactions(addr);
      setTxs(txData);
    } catch (e) {
      setError(e.message);
    }
    setFetching(false);
  }, [fetching]);

  const connect = useCallback(async () => {
    if (!window.ethereum) { setError('No wallet detected. Install MetaMask.'); return; }
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x2105') {
        try {
          await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x2105' }] });
        } catch {
          await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [{ chainId: '0x2105', chainName: 'Base', nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://mainnet.base.org'], blockExplorerUrls: ['https://basescan.org'] }] });
        }
      }
      setAccount(accounts[0]);
      setLoading(false);
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAccount(null);
    setBalances([]);
    setTotalValue(0);
    setPnl24h(0);
    setTxs([]);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (account) {
      fetchPortfolio(account);
      intervalRef.current = setInterval(() => fetchPortfolio(account), 60000);
      return () => clearInterval(intervalRef.current);
    }
  }, [account, fetchPortfolio]);

  const sorted = [...balances].sort((a, b) => {
    if (sortBy === 'allocation') return b.value - a.value;
    if (sortBy === 'value') return b.value - a.value;
    if (sortBy === 'change') return b.change - a.change;
    return 0;
  });

  const pieStr = sorted.map((b, i) => {
    const pct = totalValue > 0 ? (b.value / totalValue) * 100 : 0;
    const prevPct = sorted.slice(0, i).reduce((s, x) => s + (totalValue > 0 ? (x.value / totalValue) * 100 : 0), 0);
    return PIE_COLORS[i % PIE_COLORS.length] + ' ' + prevPct + '% ' + (prevPct + pct) + '%';
  }).join(', ');

  if (!account) {
    return (
      <div className="wallet-disconnected">
        <div className="wallet-hero">
          <h2>Connect Wallet</h2>
          <p>Connect your wallet to track your Base portfolio, token balances, and transaction history in real time.</p>
          {error && <div className="wallet-error">{error}</div>}
          <button className="wallet-btn" onClick={connect} disabled={loading}>{loading ? 'Connecting...' : 'Connect'}</button>
        </div>
        <div className="wallet-features">
          <div className="wallet-feature"><h4>Portfolio</h4><p>Real-time balance tracking</p></div>
          <div className="wallet-feature"><h4>Allocation</h4><p>Holdings breakdown</p></div>
          <div className="wallet-feature"><h4>Transactions</h4><p>On-chain history</p></div>
        </div>
      </div>
    );
  }

  if (fetching && balances.length === 0) {
    return (
      <div className="portfolio-loading">
        <div className="portfolio-spinner"></div>
        <p>Loading portfolio</p>
        <span className="portfolio-loading-sub">Fetching on-chain data from Base...</span>
      </div>
    );
  }

  return (
    <div className="portfolio-view">
      <div className="portfolio-header">
        <div className="portfolio-address">
          <span className="portfolio-label">Connected</span>
          <span className="portfolio-addr">{account.slice(0,6)}...{account.slice(-4)}</span>
          <a className="link" href={'https://basescan.org/address/' + account} target="_blank" rel="noreferrer">View</a>
        </div>
        <button className="wallet-btn connected" onClick={disconnect}>Disconnect</button>
      </div>

      {error && <div className="portfolio-warning">{error}</div>}

      <div className="portfolio-summary">
        <div>
          <div className="portfolio-total-label">Portfolio Value</div>
          <div className="portfolio-total-value">${totalValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
          <div className="portfolio-total-sub">
            <span className={pnl24h >= 0 ? 'change-positive' : 'change-negative'}>
              24h: {pnl24h >= 0 ? '+' : ''}${Math.abs(pnl24h).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
            </span>
          </div>
        </div>
        <div className="portfolio-pie" style={{background: 'conic-gradient(' + pieStr + ')'}}>
          <div className="portfolio-pie-inner"></div>
        </div>
      </div>

      <div className="portfolio-controls">
        <span className="portfolio-controls-label">Sort:</span>
        {['allocation','value','change'].map(s => (
          <button key={s} className={'portfolio-sort-btn' + (sortBy === s ? ' active' : '')} onClick={() => setSortBy(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
        <button className="portfolio-refresh-btn" onClick={() => fetchPortfolio(account)} disabled={fetching}>{fetching ? '...' : 'Refresh'}</button>
      </div>

      <div className="portfolio-tokens">
        {sorted.map((b, i) => (
          <div className="portfolio-token-row" key={b.symbol}>
            <div className="pt-left">
              <span className="pt-icon">{b.symbol === 'ETH' || b.symbol === 'WETH' ? 'E' : b.symbol === 'USDC' ? 'U' : b.symbol === 'DAI' ? 'D' : b.symbol.charAt(0)}</span>
              <div className="pt-info">
                <span className="pt-name">{b.symbol}</span>
                <span className="pt-balance">{b.balance.toLocaleString(undefined, {maximumFractionDigits:4})}</span>
              </div>
            </div>
            <div className="pt-bar">
              <div className="pt-bar-fill" style={{width: (totalValue > 0 ? (b.value / totalValue) * 100 : 0) + '%'}}></div>
              <span className="pt-bar-label">{totalValue > 0 ? ((b.value / totalValue) * 100).toFixed(1) : 0}%</span>
            </div>
            <div className="pt-right">
              <div className="pt-value">${b.value.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
              <div className={'pt-change ' + (b.change >= 0 ? 'change-positive' : 'change-negative')}>{b.change >= 0 ? '+' : ''}{b.change.toFixed(2)}%</div>
            </div>
          </div>
        ))}
      </div>

      {txs.length > 0 && (
        <div className="portfolio-tx-section">
          <h3 className="portfolio-tx-title">Recent Transactions</h3>
          <div className="portfolio-tx-list">
            {txs.slice(0, 10).map(tx => {
              const isSend = tx.from.toLowerCase() === account.toLowerCase();
              return (
                <div className="portfolio-tx-row" key={tx.hash}>
                  <span className={'ptx-type ' + (isSend ? 'send' : 'receive')}>{isSend ? 'Send' : 'Receive'}</span>
                  <span className="ptx-detail">{parseInt(tx.value, 16) / 1e18 > 0 ? (parseInt(tx.value, 16) / 1e18).toFixed(4) + ' ETH' : 'Contract call'}</span>
                  <span className="ptx-time">{new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString()}</span>
                  <a className="ptx-hash" href={'https://basescan.org/tx/' + tx.hash} target="_blank" rel="noreferrer">View</a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="portfolio-chain-badge">Base Mainnet</div>
      {lastRefresh && <div className="portfolio-last-refresh">Last refresh: {lastRefresh.toLocaleTimeString()}</div>}
    </div>
  );
}
