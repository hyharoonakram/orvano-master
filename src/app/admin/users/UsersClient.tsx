"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { UserCog, Shield, Users as UsersIcon, Search } from "lucide-react";

export function UsersClient({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const supabase = createClient();

  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    const email = user.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query) || user.id.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-white">
      {/* Title & Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#D4AF37]">
          Client Account Management
        </h1>
        <p className="text-white/50 text-xs uppercase tracking-wider mt-1">
          Registered customer accounts, roles, and security authorization
        </p>
      </div>

      {/* Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0D0D0F] p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search accounts by name or ID..."
            className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] pl-11 pr-4 py-2.5 rounded-xl text-xs text-white outline-none transition-colors"
          />
        </div>

        <div className="text-xs uppercase font-bold text-white/50 tracking-wider">
          Total Accounts: <span className="text-[#D4AF37]">{users.length}</span>
        </div>
      </div>

      {/* Users Table Container */}
      <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-white/80">
            <thead className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Client User</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Account Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-white/40 uppercase tracking-wider">
                    No client accounts found.
                  </td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <UserCog className="w-5 h-5 text-[#D4AF37]" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">
                          {user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}` : 'ORVANO VIP Client'}
                        </div>
                        <div className="text-[10px] text-white/40 font-mono mt-0.5">ID: #{user.id.substring(0, 8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/70">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.is_admin ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                        <Shield className="w-3 h-3" /> System Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/5 text-white/60 border border-white/10">
                        VIP Customer
                      </span>
                    )}
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
