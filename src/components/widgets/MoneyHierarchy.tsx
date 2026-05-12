import { useState } from "react";

interface Level {
  label: string;
  detail: string;
  examples: string;
  color: string;
}

const levels: Level[] = [
  {
    label: "Gold / external anchor",
    detail: "Historically the top of the hierarchy. Outside any national balance sheet, accepted globally as final settlement. Modern role limited but symbolically still 'money outside money.'",
    examples: "Physical gold, BIS gold accounts",
    color: "bg-amber-100 border-amber-400",
  },
  {
    label: "Central bank money",
    detail: "Federal Reserve liabilities — currency in circulation + bank reserves at the Fed. The dollar bill in your wallet. The Treasury's general account.",
    examples: "Currency, bank reserves at Fed, TGA",
    color: "bg-emerald-100 border-emerald-500",
  },
  {
    label: "Commercial bank money",
    detail: "Deposit balances at private banks. Most of M1 and M2. Each deposit is a promise from the bank to pay you Fed money on demand.",
    examples: "Checking, savings, money-market deposits",
    color: "bg-sky-100 border-sky-500",
  },
  {
    label: "Securities (Treasury + safe credit)",
    detail: "Treasuries, agency debt, repo, top-tier commercial paper. Near-money in normal times; haircuts widen during stress.",
    examples: "Treasuries, repo, Aaa corporate paper",
    color: "bg-indigo-100 border-indigo-500",
  },
  {
    label: "Other private credit",
    detail: "Everything else. Loans, IOUs, corporate bonds further down the credit spectrum. Furthest from final settlement.",
    examples: "HY bonds, bank loans, private credit",
    color: "bg-purple-100 border-purple-500",
  },
];

/**
 * Mehrling's money hierarchy as an interactive pyramid. Click a level
 * to expand. Visual reinforcement of the chained-promises structure.
 */
export default function MoneyHierarchy() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="my-6 border border-rule rounded-lg p-5 bg-paper">
      <h4 className="text-sm font-semibold uppercase tracking-wide text-ink/70 mb-4 mt-0">
        Mehrling's hierarchy of money — click each level
      </h4>
      <div className="space-y-2">
        {levels.map((l, i) => {
          const width = 100 - i * 12;
          const isOpen = openIdx === i;
          return (
            <div key={l.label} style={{ width: `${width}%`, marginInline: "auto" }}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className={`w-full text-left border-2 rounded px-4 py-3 transition-all ${l.color} ${isOpen ? "shadow-md" : ""} hover:shadow-sm`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{l.label}</span>
                  <span className="text-xs text-ink/60">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && (
                  <div className="mt-3 text-sm space-y-2">
                    <p className="text-ink/90 mb-1">{l.detail}</p>
                    <p className="text-ink/60 text-xs italic">Examples: {l.examples}</p>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-ink/60 mt-4 italic">
        Each level is a promise to pay the level above. In a crisis, promises further down get questioned first — that's the "flight to quality" you'll see in every market panic.
      </p>
    </div>
  );
}
