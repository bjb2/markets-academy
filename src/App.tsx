import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./routes/Home";
import LayerPage from "./routes/LayerPage";
import Lesson from "./routes/Lesson";
import Review from "./routes/Review";
import Resources from "./routes/Resources";

export default function App() {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-rule bg-paper sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold tracking-tight text-lg">
            Markets Academy
          </Link>
          <nav className="text-sm flex gap-5">
            <NavLink to="/" current={location.pathname === "/"}>Home</NavLink>
            <NavLink to="/review" current={location.pathname === "/review"}>Review</NavLink>
            <NavLink to="/resources" current={location.pathname === "/resources"}>Resources</NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/layer/:layerId" element={<LayerPage />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/review" element={<Review />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </main>
      <footer className="border-t border-rule text-xs text-ink/60 py-4 text-center">
        Free sources only · Progress stored locally · <a className="underline" href="https://github.com/bjb2/markets-academy">repo</a>
      </footer>
    </div>
  );
}

function NavLink({ to, current, children }: { to: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link to={to} className={current ? "text-accent font-medium" : "text-ink/70 hover:text-ink"}>
      {children}
    </Link>
  );
}
