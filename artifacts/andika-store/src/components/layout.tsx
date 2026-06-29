import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useGetCart } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { ShoppingCart, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const { sessionId } = useSession();
  const { data: cart } = useGetCart({ sessionId }, { query: { enabled: !!sessionId } });
  
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;
  
  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border/50 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-primary to-secondary flex items-center justify-center neon-glow">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              ANDIKA STORE
            </span>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Admin
            </Link>
            <Link href="/cart" className="relative group">
              <div className="p-2 rounded-full hover:bg-white/5 transition-colors">
                <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
              </div>
              {cartItemCount > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-white neon-glow-pink"
                >
                  {cartItemCount}
                </motion.div>
              )}
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      
      <footer className="border-t border-border/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ANDIKA STORE. Digital Services.
          </p>
        </div>
      </footer>
    </div>
  );
}
