import Link from 'next/link'
import { LogOut, ExternalLink, ShieldAlert } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const verified = cookieStore.get('admin_verified')
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?next=/admin')
  }

  // Verify that the user is actually an admin in the database
  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  const isAdmin = profile && (profile.is_admin === true || profile.is_admin === 1 || profile.is_admin === '1');
  if (!isAdmin) {
    redirect('/')
  }

  // If not verified by PIN, redirect to PIN verification page
  if (!verified || verified.value !== 'true') {
    redirect('/admin-verify')
  }

  const email = user?.email || 'admin@orvano.com'

  return (
    <div className="min-h-screen bg-[#080809] text-white flex flex-col md:flex-row">
      {/* Executive Sidebar */}
      <AdminSidebar email={email} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0C0C0E]">
        {/* Executive Top Bar */}
        <header className="h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 bg-[#0A0A0B] border-b border-white/10 sticky top-0 z-40">
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#D4AF37] animate-pulse shadow-[0_0_10px_#D4AF37]" />
            <h2 className="text-xs sm:text-sm font-extrabold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-white/90 truncate">
              ORVANO CONTROL PANEL
            </h2>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-6">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-xs uppercase tracking-widest text-white/60 hover:text-[#D4AF37] transition-colors flex items-center gap-1 sm:gap-1.5 font-bold"
            >
              <span className="hidden sm:inline">Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <div className="h-4 w-px bg-white/10" />

            <form action={async () => {
              'use server'
              const sb = await createClient()
              await sb.auth.signOut()
              const cookieStore = await cookies()
              cookieStore.set({
                name: 'admin_verified',
                value: '',
                expires: new Date(0),
                path: '/admin',
              })
              redirect('/login')
            }}>
              <button className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-[10px] sm:text-xs font-bold text-red-400 transition-all uppercase tracking-wider">
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </header>

        {/* Content View */}
        <div className="p-4 sm:p-6 md:p-8 flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  )
}
