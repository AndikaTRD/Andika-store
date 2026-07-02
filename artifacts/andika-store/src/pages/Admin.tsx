import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogOut, RefreshCw, ExternalLink, CheckCircle2, Clock, XCircle, ShieldCheck, ArrowLeft } from "lucide-react";

function formatRp(n: number) {
  return "Rp" + n.toLocaleString("id-ID");
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
    " " +
    d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
  );
}

type Order = {
  id: number;
  orderId: string;
  customerName: string;
  status: string;
  total: number;
  paymentMethod: string;
  proofUrl: string | null;
  items: Array<{ productName: string; price: number; quantity: number }>;
  createdAt: string;
};

type Stats = {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: { label: "Pending", color: "text-yellow-400 bg-yellow-500/15 border-yellow-500/30", icon: <Clock className="w-3 h-3" /> },
    proof_uploaded: { label: "Bukti Dikirim", color: "text-blue-400 bg-blue-500/15 border-blue-500/30", icon: <Clock className="w-3 h-3" /> },
    confirmed: { label: "Confirmed", color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30", icon: <CheckCircle2 className="w-3 h-3" /> },
    cancelled: { label: "Cancelled", color: "text-red-400 bg-red-500/15 border-red-500/30", icon: <XCircle className="w-3 h-3" /> },
  };
  const s = map[status] ?? { label: status, color: "text-white/40 bg-white/5 border-white/10", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${s.color}`}>
      {s.icon}{s.label}
    </span>
  );
}

export default function Admin() {
  const goHome = () => {
    window.location.href = "/";
  };
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function checkSession() {
    try {
      const res = await fetch("/api/admin/me");
      const data = await res.json() as { isAdmin: boolean };
      setIsAdmin(data.isAdmin);
    } catch {
      setIsAdmin(false);
    }
  }

  async function fetchData() {
    setLoading(true);
    const [oRes, sRes] = await Promise.all([
      fetch("/api/admin/orders"),
      fetch("/api/admin/stats"),
    ]);
    if (oRes.ok) setOrders(await oRes.json() as Order[]);
    if (sRes.ok) setStats(await sRes.json() as Stats);
    setLoading(false);
  }

  useEffect(() => { checkSession(); }, []);
  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoginLoading(false);
    if (res.ok) {
      setIsAdmin(true);
      setPassword("");
    } else {
      setLoginError("Password salah. Coba lagi.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAdmin(false);
    setOrders([]);
    setStats(null);
  }

  async function updateStatus(orderId: string, status: string) {
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  }

  // Loading session check
  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#080812] flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Login form
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#080812] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="rounded-2xl border border-violet-500/20 bg-[#0d0d1b] overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500" />
            <div className="p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-violet-400" />
                </div>
                <h1 className="text-lg font-black text-white">Admin Panel</h1>
                <p className="text-xs text-white/35 mt-1">ANDIKA STORE</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" />
                    <input
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Masukkan password admin..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
                      autoFocus
                    />
                  </div>
                  {loginError && <p className="text-xs text-pink-400 mt-1.5">{loginError}</p>}
                </div>
                <button
                  type="submit"
                  disabled={!password || loginLoading}
                  className="w-full h-11 rounded-xl font-bold text-sm tracking-wider uppercase bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:opacity-90"
                >
                  {loginLoading ? "Memeriksa..." : "MASUK"}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen bg-[#080812] text-white">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0d0d1b]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">

              <button
                onClick={goHome}
                className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-violet-400 font-bold">
                  Admin Panel
                </p>

                <h1 className="text-sm font-black text-white">
                  ANDIKA STORE
                </h1>
              </div>

            </div>

            <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all text-xs font-semibold"
            >
              <LogOut className="w-3 h-3" /> Keluar
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-5 space-y-5">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Total Order", value: stats.totalOrders },
              { label: "Pending", value: stats.pendingOrders },
              { label: "Confirmed", value: stats.confirmedOrders },
              { label: "Order Hari Ini", value: stats.todayOrders },
              { label: "Revenue Hari Ini", value: formatRp(stats.todayRevenue) },
              { label: "Total Revenue", value: formatRp(stats.totalRevenue) },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-white/6 bg-[#0d0d1b] px-4 py-3">
                <p className="text-[10px] uppercase tracking-widest text-white/35 font-bold">{s.label}</p>
                <p className="text-lg font-black text-white mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Orders list */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/35 font-bold mb-3">
            Semua Order ({orders.length})
          </p>
          {orders.length === 0 && !loading && (
            <div className="rounded-xl border border-white/6 bg-[#0d0d1b] p-8 text-center text-white/25 text-sm">
              Belum ada order masuk.
            </div>
          )}
          <div className="space-y-2">
            {orders.map(order => (
              <div key={order.id} className="rounded-xl border border-white/6 bg-[#0d0d1b] overflow-hidden">
                <button
                  className="w-full px-4 py-3 flex items-start justify-between text-left hover:bg-white/3 transition-all"
                  onClick={() => setExpanded(expanded === order.orderId ? null : order.orderId)}
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-white font-mono">{order.orderId}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <span className="text-[11px] text-white/50">
                      {order.customerName} · {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <span className="text-sm font-black text-violet-300 shrink-0 ml-3">{formatRp(order.total)}</span>
                </button>

                <AnimatePresence>
                  {expanded === order.orderId && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden border-t border-white/5"
                    >
                      <div className="px-4 py-3 space-y-3">
                        {/* Items */}
                        <div className="space-y-1">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-white/60">{item.productName} ×{item.quantity}</span>
                              <span className="text-white font-semibold">{formatRp(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-white/35 uppercase tracking-wider font-bold">Metode:</span>
                          <span className="text-xs text-white font-semibold">{order.paymentMethod}</span>
                        </div>

                        {/* Bukti link */}
                        {order.proofUrl && (
                          <a
                            href={order.proofUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 font-semibold transition-all"
                          >
                            <ExternalLink className="w-3 h-3" /> Lihat Bukti Pembayaran
                          </a>
                        )}

                        {/* Status buttons */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {(["pending", "confirmed", "cancelled"] as const).map(s => (
                            <button
                              key={s}
                              disabled={order.status === s}
                              onClick={() => updateStatus(order.orderId, s)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                order.status === s
                                  ? "border-violet-500/50 bg-violet-500/15 text-violet-300 cursor-default"
                                  : "border-white/10 bg-white/4 text-white/40 hover:border-white/25 hover:text-white/70"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
