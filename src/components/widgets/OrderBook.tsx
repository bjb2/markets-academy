import { useState } from "react";

type Level = { price: number; size: number };
type Fill = { side: "buy" | "sell"; qty: number; vwap: number; slippageBp: number };

const initialBids: Level[] = [
  { price: 99.95, size: 300 },
  { price: 99.90, size: 500 },
  { price: 99.85, size: 800 },
  { price: 99.80, size: 1200 },
  { price: 99.75, size: 2000 },
];
const initialAsks: Level[] = [
  { price: 100.05, size: 300 },
  { price: 100.10, size: 500 },
  { price: 100.15, size: 800 },
  { price: 100.20, size: 1200 },
  { price: 100.25, size: 2000 },
];

function walk(book: Level[], qty: number): { filled: Level[]; remaining: Level[]; rest: number } {
  const filled: Level[] = [];
  const remaining: Level[] = [];
  let need = qty;
  for (const lvl of book) {
    if (need <= 0) {
      remaining.push(lvl);
      continue;
    }
    if (lvl.size <= need) {
      filled.push({ ...lvl });
      need -= lvl.size;
    } else {
      filled.push({ price: lvl.price, size: need });
      remaining.push({ price: lvl.price, size: lvl.size - need });
      need = 0;
    }
  }
  return { filled, remaining, rest: need };
}

export default function OrderBook() {
  const [bids, setBids] = useState<Level[]>(initialBids);
  const [asks, setAsks] = useState<Level[]>(initialAsks);
  const [lastFill, setLastFill] = useState<Fill | null>(null);

  const bestBid = bids[0]?.price ?? 0;
  const bestAsk = asks[0]?.price ?? 0;
  const mid = (bestBid + bestAsk) / 2;
  const spread = bestAsk - bestBid;

  function marketBuy(qty: number) {
    const { filled, remaining, rest } = walk(asks, qty);
    if (filled.length === 0) return;
    const filledQty = qty - rest;
    const totalCost = filled.reduce((s, l) => s + l.price * l.size, 0);
    const vwap = totalCost / filledQty;
    const slippageBp = ((vwap - mid) / mid) * 10000;
    setAsks(remaining);
    setLastFill({ side: "buy", qty: filledQty, vwap, slippageBp });
  }

  function marketSell(qty: number) {
    const { filled, remaining, rest } = walk(bids, qty);
    if (filled.length === 0) return;
    const filledQty = qty - rest;
    const totalProceeds = filled.reduce((s, l) => s + l.price * l.size, 0);
    const vwap = totalProceeds / filledQty;
    const slippageBp = ((mid - vwap) / mid) * 10000;
    setBids(remaining);
    setLastFill({ side: "sell", qty: filledQty, vwap, slippageBp });
  }

  function reset() {
    setBids(initialBids);
    setAsks(initialAsks);
    setLastFill(null);
  }

  const maxSize = Math.max(...bids.map((l) => l.size), ...asks.map((l) => l.size), 1);
  const barWidth = (size: number) => (size / maxSize) * 100;

  return (
    <div className="my-6 border border-rule rounded-lg p-5 bg-paper">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/70 mb-4 mt-0">
        Order book simulator
      </h4>
      <div className="grid grid-cols-2 gap-4 mb-4 font-mono text-sm">
        <div>
          <div className="text-xs uppercase tracking-wide text-ink/60 mb-2">Asks (sellers)</div>
          {[...asks].reverse().map((lvl) => (
            <div key={`a${lvl.price}`} className="relative h-7 flex items-center justify-between border-b border-rule/40 px-2">
              <div className="absolute inset-y-0 right-0 bg-red-100" style={{ width: `${barWidth(lvl.size)}%` }} />
              <span className="relative text-red-700">${lvl.price.toFixed(2)}</span>
              <span className="relative text-ink/70">{lvl.size.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-ink/60 mb-2">Bids (buyers)</div>
          {bids.map((lvl) => (
            <div key={`b${lvl.price}`} className="relative h-7 flex items-center justify-between border-b border-rule/40 px-2">
              <div className="absolute inset-y-0 right-0 bg-green-100" style={{ width: `${barWidth(lvl.size)}%` }} />
              <span className="relative text-green-700">${lvl.price.toFixed(2)}</span>
              <span className="relative text-ink/70">{lvl.size.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs text-ink/70 mb-3 font-mono">
        Best bid {bestBid.toFixed(2)} / Best ask {bestAsk.toFixed(2)} / Spread {(spread * 100).toFixed(1)}¢ / Mid {mid.toFixed(3)}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <button onClick={() => marketBuy(200)} className="px-3 py-1 text-xs rounded bg-red-700 text-white hover:bg-red-800">
          Market Buy 200
        </button>
        <button onClick={() => marketBuy(1000)} className="px-3 py-1 text-xs rounded bg-red-700 text-white hover:bg-red-800">
          Market Buy 1,000
        </button>
        <button onClick={() => marketBuy(3000)} className="px-3 py-1 text-xs rounded bg-red-900 text-white hover:bg-red-950">
          Market Buy 3,000 (size!)
        </button>
        <button onClick={() => marketSell(200)} className="px-3 py-1 text-xs rounded bg-green-700 text-white hover:bg-green-800">
          Market Sell 200
        </button>
        <button onClick={() => marketSell(1000)} className="px-3 py-1 text-xs rounded bg-green-700 text-white hover:bg-green-800">
          Market Sell 1,000
        </button>
        <button onClick={() => marketSell(3000)} className="px-3 py-1 text-xs rounded bg-green-900 text-white hover:bg-green-950">
          Market Sell 3,000 (size!)
        </button>
        <button onClick={reset} className="px-3 py-1 text-xs rounded bg-ink/20 text-ink hover:bg-ink/30">
          Reset book
        </button>
      </div>
      {lastFill && (
        <div className="text-xs font-mono border-l-4 border-blue-400 bg-blue-50 p-2 rounded">
          Filled {lastFill.qty.toLocaleString()} sh {lastFill.side === "buy" ? "buy" : "sell"} @ VWAP ${lastFill.vwap.toFixed(4)}.
          Slippage vs mid: <span className="font-bold">{lastFill.slippageBp.toFixed(1)} bp</span>.
        </div>
      )}
      <p className="text-xs text-ink/60 mt-3 italic">
        A market order eats the opposite side of the book from the inside out. Small orders pay the half-spread; large orders eat through multiple levels, paying a VWAP worse than mid. That excess is market impact.
      </p>
    </div>
  );
}
