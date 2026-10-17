"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useCurrencyStore } from "@/store/currencyStore";
import { ShoppingCart, Search, CreditCard, Clock, CheckCircle2, Truck, AlertCircle, Trash2 } from "lucide-react";

export function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const formatPrice = useCurrencyStore((state) => state.formatPrice);
  
  const router = useRouter();
  const supabase = createClient();

  const statuses = ["All", "pending", "awaiting_payment", "paid", "shipped", "delivered", "cancelled"];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.shipping_address?.trx_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setLoading(orderId);
    
    try {
      await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus })
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      router.refresh();
    } catch {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (!error) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        router.refresh();
      } else {
        alert("Error updating status: " + error.message);
      }
    }
    
    setLoading(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    setLoading(orderId);

    try {
      await fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' });
      setOrders(orders.filter(o => o.id !== orderId));
      router.refresh();
    } catch {
      await supabase.from('order_items').delete().eq('order_id', orderId);
      const { error } = await supabase.from('orders').delete().eq('id', orderId);

      if (error) {
        alert("Failed to delete order: " + error.message);
      } else {
        setOrders(orders.filter(o => o.id !== orderId));
        router.refresh();
      }
    }
    setLoading(null);
  };

  const handleClearAllOrders = async () => {
    if (!confirm("⚠️ Are you sure you want to clear ALL test orders and reset revenue to zero? This action cannot be undone.")) return;
    setLoading("clearing_all");

    try {
      await fetch('/api/orders?clearAll=true', { method: 'DELETE' });
      setOrders([]);
      alert("All orders cleared successfully! Revenue is now reset to PKR 0.");
      router.refresh();
    } catch {
      await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { error } = await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      if (error) {
        alert("Failed to clear orders: " + error.message);
      } else {
        setOrders([]);
        alert("All orders cleared successfully! Revenue is now reset to PKR 0.");
        router.refresh();
      }
    }
    setLoading(null);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-white">
      {/* Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#D4AF37]">
            Order Fulfillment Management
          </h1>
          <p className="text-white/50 text-xs uppercase tracking-wider mt-1">
            Track customer payments, dispatch statuses, and order totals
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearAllOrders}
          disabled={loading === "clearing_all" || orders.length === 0}
          className={`font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all flex items-center gap-2 w-fit ${
            orders.length === 0 
              ? 'bg-white/5 border-white/5 text-white/30 cursor-not-allowed' 
              : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>{loading === "clearing_all" ? "Resetting..." : "Clear All Orders (Reset Revenue)"}</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0D0D0F] p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, Email, or TRX ID..."
            className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] pl-11 pr-4 py-2.5 rounded-xl text-xs text-white outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-xl text-[11px] uppercase tracking-wider font-bold transition-all whitespace-nowrap ${
                statusFilter === status
                  ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                  : "bg-white/5 text-white/60 hover:text-white border border-white/10"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-white/80">
            <thead className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Order Ref</th>
                <th className="px-6 py-4">Customer & Payment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Items Summary</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40 uppercase tracking-wider">
                    No client orders found.
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-white">
                    #{order.id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-white text-xs">
                      {order.user?.first_name || 'Guest'} {order.user?.last_name || 'Client'}
                    </p>
                    <p className="text-white/40 text-[11px] font-mono mt-0.5">
                      {order.shipping_address?.email || order.user_email || 'No email'}
                    </p>
                    {order.shipping_address?.payment_method && (
                      <div className="text-[10px] mt-2 font-bold tracking-wider text-white/60 bg-white/5 p-2 rounded-lg border border-white/5">
                        <span>Method: <span className="text-[#D4AF37] uppercase">{order.shipping_address.payment_method}</span></span>
                        {order.shipping_address.trx_id && (
                          <span className="block mt-1">TRX ID: <span className="text-emerald-400 font-mono select-all">{order.shipping_address.trx_id}</span></span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-white/70">
                    {new Date(order.created_at).toLocaleDateString()}<br/>
                    <span className="text-[10px] text-white/40">{new Date(order.created_at).toLocaleTimeString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[220px] space-y-1">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="text-[11px] truncate text-white/80 font-medium">
                          <span className="text-[#D4AF37] font-bold mr-1">{item.quantity}x</span> 
                          {item.product?.name || "Product"}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-extrabold text-[#D4AF37] text-sm">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select 
                        value={order.status}
                        disabled={loading === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-[#050506] border border-white/10 text-white font-bold text-xs rounded-xl px-3 py-2 outline-none focus:border-[#D4AF37] cursor-pointer"
                      >
                        <option value="pending">🟡 Pending</option>
                        <option value="awaiting_payment">⏳ Awaiting Payment</option>
                        <option value="paid">💳 Paid</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="delivered">✅ Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={loading === order.id}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                        title="Delete Order"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
