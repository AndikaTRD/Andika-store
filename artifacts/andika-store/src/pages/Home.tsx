import { Layout } from "@/components/layout";
import { WelcomePopup } from "@/components/welcome-popup";
import { useListProducts, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Check, ShieldCheck, Zap, Clock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const { data: products, isLoading } = useListProducts();
  const { sessionId } = useSession();
  const addToCart = useAddToCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mainProduct = products?.find(p => p.id === 1);

  const handleAddToCart = () => {
    if (!mainProduct) return;
    
    addToCart.mutate(
      { data: { sessionId, productId: mainProduct.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey({ sessionId }) });
          toast({
            title: "Added to cart",
            description: `${mainProduct.name} has been added to your cart.`,
          });
        }
      }
    );
  };

  return (
    <Layout>
      <WelcomePopup />
      
      <div className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full py-20 px-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="z-10"
          >
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
              <span className="neon-text">Upgrade</span> Your <br />
              Digital Reality
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Premium account packages guaranteed active and secure. Experience the next level of digital service.
            </p>
          </motion.div>
        </section>

        {/* Product Section */}
        <section className="w-full max-w-md px-4 pb-24 z-10">
          {isLoading ? (
            <div className="w-full h-96 rounded-2xl bg-card animate-pulse" />
          ) : mainProduct ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full bg-card neon-border rounded-2xl p-8 flex flex-col relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
              
              <div className="mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4 border border-primary/30">
                  Best Seller
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{mainProduct.name}</h2>
                <p className="text-muted-foreground text-sm">{mainProduct.description}</p>
              </div>
              
              <div className="mb-8">
                <span className="text-4xl font-black text-white neon-text">
                  {mainProduct.price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </span>
              </div>
              
              <div className="space-y-3 mb-8 flex-1">
                {mainProduct.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90 neon-glow text-white rounded-xl"
              >
                {addToCart.isPending ? "ADDING..." : "ADD TO CART"}
              </Button>
            </motion.div>
          ) : (
            <div className="text-center text-muted-foreground">Product not found.</div>
          )}
        </section>
      </div>
    </Layout>
  );
}
