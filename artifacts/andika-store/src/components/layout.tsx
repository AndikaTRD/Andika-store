import { Link } from "wouter";
import { Store } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center purple-glow-sm">
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-widest uppercase text-white">
              ANDIKA STORE
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-1.5 rounded-lg text-sm font-semibold tracking-wider uppercase text-white bg-white/5 hover:bg-violet-600/20 hover:text-violet-300 transition-all duration-200"
              data-testid="nav-member"
            >
              MEMBER
            </Link>
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/30 hover:text-white/60 transition-colors"
              data-testid="nav-admin"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-white/5 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-white/25 text-xs tracking-widest uppercase">
            © {new Date().getFullYear()} ANDIKA STORE
          </p>
        </div>
      </footer>
    </div>
  );
}
