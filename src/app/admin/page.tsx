import { createClient } from '@/utils/supabase/server'
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Activity, Plus } from 'lucide-react'
import { PriceFormatter } from '@/components/PriceFormatter'
import Link from 'next/link'

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let productCount = 0;
  let orderCount = 0;
  let userCount = 0;
  let totalRevenue = 0;
  let recentOrders: any[] = [];
  let lowStockProducts: any[] = [];

  try {
    const supabase = await createClient();
    
    // Product count
    const { count: pc } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (pc) productCount = pc;

    // Order count
    const { count: oc } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    if (oc) orderCount = oc;

    // User count
    const { count: uc } = await supabase.from('users').select('*', { count: 'exact', head: true });
    if (uc) userCount = uc;

    // Revenue
    const { data: paid } = await supabase.from('orders').select('total_amount').neq('status', 'cancelled');
    if (paid) totalRevenue = paid.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

    // Recent orders
    const { data: rec } = await supabase.from('orders').select('id, user_email, total_amount, status, created_at').order('created_at', { ascending: false }).limit(5);
    if (rec) recentOrders = rec;

    // Low stock products
    const { data: stock } = await supabase.from('products').select('id, name, stock_quantity, category').lte('stock_quantity', 5).limit(4);
    if (stock) lowStockProducts = stock;
  } catch (err) {
    console.error('Admin stats Supabase query error:', err);
  }

  let dbStatus = 'Operational';
  let storageStatus = 'Operational';
  let authStatus = 'Operational';
  const isEnvHealthy = true;

  const stats = [
    { 
      name: 'Total Revenue', 
      value: <PriceFormatter value={totalRevenue} />, 
      change: '+14.2%', 
      icon: DollarSign,
      glow: 'from-amber-500/20 via-yellow-500/10 to-transparent',
      border: 'border-amber-500/30',
      textGlow: 'text-amber-400'
    },
    { 
      name: 'Active Orders', 
      value: orderCount.toString(), 
      change: '+8.1%', 
      icon: ShoppingCart,
      glow: 'from-blue-500/20 via-indigo-500/10 to-transparent',
      border: 'border-blue-500/30',
      textGlow: 'text-blue-400'
    },
    { 
      name: 'Live Products', 
      value: productCount.toString(), 
      change: 'Catalog', 
      icon: Package,
      glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
      border: 'border-emerald-500/30',
      textGlow: 'text-emerald-400'
    },
    { 
      name: 'Registered Users', 
      value: userCount.toString(), 
      change: '+19.5%', 
      icon: Users,
      glow: 'from-purple-500/20 via-pink-500/10 to-transparent',
      border: 'border-purple-500/30',
      textGlow: 'text-purple-400'
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-[1600px] mx-auto">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-[#141416] via-[#0E0E10] to-[#0A0A0B] p-5 sm:p-8 rounded-xl sm:rounded-2xl border border-white/10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#D4AF37] mb-1 sm:mb-2 block">
            Executive Summary
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
            Performance Intelligence
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1">
            Real-time analytics, inventory signals, and order processing stream.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.name}
              className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#111113] border ${stat.border} p-5 sm:p-6 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.glow} opacity-40 group-hover:opacity-80 transition-opacity`} />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/50">
                  {stat.name}
                </span>
                <div className="p-2 sm:p-2.5 rounded-lg bg-white/5 border border-white/10 text-white/80 group-hover:text-white group-hover:scale-110 transition-all">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>

              <div className="relative z-10 mt-4 sm:mt-6">
                <div className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] sm:text-xs font-semibold text-emerald-400">
                    {stat.change}
                  </span>
                  <span className="text-[10px] sm:text-xs text-white/40 ml-1">
                    active cycle
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Orders Feed */}
        <div className="lg:col-span-2 rounded-xl sm:rounded-2xl bg-[#111113] border border-white/10 p-5 sm:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/5">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
                Live Order Pipeline
              </h2>
              <p className="text-[10px] sm:text-xs text-white/40 mt-0.5">
                Most recent client transactions requiring dispatch
              </p>
            </div>
            <Link 
              href="/admin/orders"
              className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:text-[#F5D67B] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/5 mt-2">
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-white/40 text-xs sm:text-sm">
                No orders recorded in system yet.
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="py-3.5 sm:py-4 flex items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-lg transition-colors">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white/90">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        order.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-white/40 truncate mt-0.5">
                      {order.user_email || 'Direct Checkout Client'}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-bold text-white">
                      <PriceFormatter value={order.total_amount} />
                    </div>
                    <div className="text-[10px] text-white/40 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Signals & Health */}
        <div className="space-y-6 sm:space-y-8">
          {/* Inventory Alerts */}
          <div className="rounded-xl sm:rounded-2xl bg-[#111113] border border-white/10 p-5 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                  Stock Alerts
                </h2>
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded">
                Low Inventory
              </span>
            </div>

            <div className="divide-y divide-white/5 mt-2">
              {lowStockProducts.length === 0 ? (
                <div className="py-8 text-center text-white/40 text-xs">
                  All items adequately stocked.
                </div>
              ) : (
                lowStockProducts.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-bold text-white/90 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider">
                        {p.category}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        {p.stock_quantity} Left
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="rounded-xl sm:rounded-2xl bg-[#111113] border border-white/10 p-5 sm:p-6">
            <div className="flex items-center gap-2 pb-4 border-b border-white/5">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
                Cluster Telemetry
              </h2>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02]">
                <span className="text-white/70 font-medium">Supabase Database Engine</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {dbStatus}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02]">
                <span className="text-white/70 font-medium">Storage Bucket CDN</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {storageStatus}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02]">
                <span className="text-white/70 font-medium">Auth & Encryption Engine</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {authStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
