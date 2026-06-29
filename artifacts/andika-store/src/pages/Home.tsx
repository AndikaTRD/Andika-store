import { useState } from "react";
import { Layout } from "@/components/layout";
import { PurchasePopup } from "@/components/purchase-popup";
import { motion } from "framer-motion";
import { Shield, Zap, Clock, Headphones, ChevronRight, Star } from "lucide-react";

const FEATURES = [
  { icon: Shield, label: "Akun baru & fresh" },
  { icon: Zap, label: "Proses cepat" },
  { icon: Clock, label: "Garansi aktif" },
  { icon: Headphones, label: "Support 24 jam" },
];

export default function Home() {
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <Layout>
      <PurchasePopup open={popupOpen} onClose={() => setPopupOpen(false)} />

      {/* Hero */}
      <section className="w-full pt-16 pb-10 px-4 flex flex-col items-center text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124,58,237,0.18) 0%, transparent 80%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/25 bg-violet-500/8 mb-5">
            <Star className="w-3 h-3 text-violet-400 fill-violet-400" />
            <span className="text-xs font-semibold text-violet-300 uppercase tracking-widest">
              Terpercaya & Berkualitas
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none mb-4">
            <span className="gradient-text">ANDIKA</span>
            {" "}STORE
          </h1>
          <p className="text-sm md:text-base text-white/45 max-w-md mx-auto leading-relaxed">
            Layanan aktivasi akun member fresh berkualitas tinggi dengan garansi dan proses cepat.
          </p>
        </motion.div>
      </section>

      {/* Product Card */}
      <section className="w-full max-w-md mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="rounded-2xl border border-violet-500/20 bg-[#0c0c1a] overflow-hidden purple-glow-sm"
          data-testid="card-product-1"
        >
          {/* Card top bar */}
          <div className="h-0.5 bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600" />

          <div className="p-6 md:p-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/12 border border-violet-500/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-violet-300">
                Available
              </span>
            </div>

            {/* Product name */}
            <h2 className="text-2xl font-black text-white mb-0.5 tracking-tight">
              NEW MEMBER FRESH
            </h2>
            <p className="text-sm text-white/45 mb-6">Aktivasi Member Fresh</p>

            {/* Price */}
            <div className="mb-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-black text-white">Rp6.500</span>
                <span className="text-sm text-white/40 font-medium">/ Member</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <span className="text-xs text-violet-300 font-semibold">
                  Beli 10 member atau lebih → <span className="text-white">Rp6.000</span> / Member
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 mb-5" />

            {/* Features */}
            <div className="grid grid-cols-2 gap-2.5 mb-7">
              {FEATURES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-violet-500/12 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-violet-400" />
                  </div>
                  <span className="text-xs text-white/60 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => setPopupOpen(true)}
              className="w-full h-12 rounded-xl btn-primary text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 group"
              data-testid="button-beli"
            >
              BELI SEKARANG
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Trust note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-xs text-white/20 mt-4"
          data-testid="text-trust-note"
        >
          Proses aman & terpercaya. Konfirmasi via WhatsApp.
        </motion.p>
      </section>
    </Layout>
  );
}
