import { Layout } from "@/components/layout";
import { useAdminListOrders, useAdminGetStats, useAdminUpdateOrderStatus, getAdminListOrdersQueryKey, getAdminGetStatsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle, XCircle, Clock, Search, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Admin() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const queryParams = statusFilter === "ALL" ? {} : { status: statusFilter };
  const { data: orders, isLoading: ordersLoading } = useAdminListOrders({ query: queryParams });
  const { data: stats } = useAdminGetStats();
  const updateStatus = useAdminUpdateOrderStatus();
  const queryClient = useQueryClient();

  const handleUpdateStatus = (orderId: string, status: string) => {
    updateStatus.mutate(
      { orderId, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getAdminListOrdersQueryKey() });
          queryClient.invalidateQueries({ queryKey: getAdminGetStatsQueryKey() });
        }
      }
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-black text-white uppercase tracking-wider mb-8">
          Command Center
        </h1>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-card neon-border rounded-xl p-6">
              <p className="text-sm text-muted-foreground font-medium mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-white neon-text">{stats.totalOrders}</p>
            </div>
            <div className="bg-card border border-yellow-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <p className="text-sm text-yellow-500/70 font-medium mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-400">{stats.pendingOrders}</p>
            </div>
            <div className="bg-card border border-green-500/30 rounded-xl p-6 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
              <p className="text-sm text-green-500/70 font-medium mb-1">Confirmed</p>
              <p className="text-3xl font-bold text-green-400">{stats.confirmedOrders}</p>
            </div>
            <div className="bg-card border border-primary/30 rounded-xl p-6 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
              <p className="text-sm text-primary/70 font-medium mb-1">Revenue</p>
              <p className="text-2xl font-bold text-primary">
                {stats.totalRevenue.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
              </p>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Orders</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Order ID</TableHead>
                  <TableHead className="text-muted-foreground">Customer</TableHead>
                  <TableHead className="text-muted-foreground">Total</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Date</TableHead>
                  <TableHead className="text-right text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id} className="border-border hover:bg-white/5">
                    <TableCell className="font-mono text-primary">{order.orderId}</TableCell>
                    <TableCell>
                      <div className="font-medium text-white">{order.customerName}</div>
                      <div className="text-xs text-muted-foreground">{order.paymentMethod}</div>
                    </TableCell>
                    <TableCell className="font-bold">
                      {order.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                        order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {order.paymentProofUrl && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" className="border-primary/50 hover:bg-primary/20">
                                <Eye className="w-4 h-4 text-primary" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-card border-border sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Payment Proof</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4">
                                <img src={order.paymentProofUrl} alt="Proof" className="w-full h-auto rounded-lg border border-border" />
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        {order.status === 'PENDING' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => handleUpdateStatus(order.orderId, 'CONFIRMED')}
                              className="border-green-500/50 hover:bg-green-500/20"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleUpdateStatus(order.orderId, 'REJECTED')}
                              className="border-red-500/50 hover:bg-red-500/20"
                            >
                              <XCircle className="w-4 h-4 text-red-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {orders?.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
