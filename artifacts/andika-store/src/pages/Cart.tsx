import { Layout } from "@/components/layout";
import { useGetCart, useRemoveFromCart, getGetCartQueryKey, useClearCart } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Trash2, ArrowRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function Cart() {
  const { sessionId } = useSession();
  const { data: cart, isLoading } = useGetCart({ sessionId }, { query: { enabled: !!sessionId } });
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();
  const queryClient = useQueryClient();

  const handleRemove = (productId: number) => {
    removeFromCart.mutate(
      { sessionId, productId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
        }
      }
    );
  };

  const handleClear = () => {
    clearCart.mutate(
      { sessionId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
        }
      }
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-8 flex items-center gap-3">
          Your Cart <span className="w-12 h-1 bg-primary inline-block rounded-full"></span>
        </h1>

        {isLoading ? (
          <div className="w-full h-40 bg-card rounded-xl animate-pulse" />
        ) : cart && cart.items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.productId} 
                  className="bg-card neon-border rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-bold text-lg text-white">{item.productName}</h3>
                    <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
                    <p className="text-primary font-medium mt-1">
                      {item.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemove(item.productId)}
                    disabled={removeFromCart.isPending}
                    className="text-destructive hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </motion.div>
              ))}
              
              <div className="flex justify-end">
                <Button 
                  variant="ghost" 
                  onClick={handleClear}
                  disabled={clearCart.isPending}
                  className="text-muted-foreground hover:text-white"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-card neon-border rounded-xl p-6 sticky top-24">
                <h3 className="font-bold text-xl text-white mb-4">Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{cart.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                  </div>
                  <div className="h-px w-full bg-border" />
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span className="neon-text">{cart.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 neon-glow text-white font-bold h-12">
                    PROCEED TO CHECKOUT <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-xl border border-border/50">
            <h2 className="text-2xl font-bold text-muted-foreground mb-4">Your cart is empty</h2>
            <Link href="/">
              <Button className="bg-primary/20 text-primary hover:bg-primary/30">
                BROWSE STORE
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
