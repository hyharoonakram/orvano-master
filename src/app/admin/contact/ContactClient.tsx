"use client";

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2, CheckCircle2, Trash2, Mail, Phone, Share2 } from 'lucide-react'

export function ContactClient({ initialMessages, initialSettings }: { initialMessages: any[], initialSettings: any }) {
  const [messages, setMessages] = useState(initialMessages)
  const [settings, setSettings] = useState(initialSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setMessage('')
    try {
      const { error } = await supabase
        .from('store_settings')
        .update({
          phone_number: settings.phone_number,
          whatsapp_number: settings.whatsapp_number,
          instagram_url: settings.instagram_url,
          tiktok_url: settings.tiktok_url,
          facebook_url: settings.facebook_url
        })
        .eq('id', 1)

      if (error) throw error
      setMessage('Contact & Social links saved successfully!')
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id)
      if (error) throw error
      setMessages(messages.filter(m => m.id !== id))
    } catch (err: any) {
      alert(`Failed to delete message: ${err.message}`)
    }
  }

  const handleMarkAsRead = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const { error } = await supabase.from('contact_messages').update({ status: newStatus }).eq('id', id)
      if (error) throw error
      setMessages(messages.map(m => m.id === id ? { ...m, status: newStatus } : m))
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto text-white">
      {/* Title & Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-[#D4AF37]">
          Client Concierge & Social Channels
        </h1>
        <p className="text-white/50 text-xs uppercase tracking-wider mt-1">
          Read client concierge messages and update official social media links
        </p>
      </div>

      {/* Contact Messages Table */}
      <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37] flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#D4AF37]" /> Customer Inquiries ({messages.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-white/80">
            <thead className="text-[10px] text-white/40 uppercase tracking-widest bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Message Content</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-white/40 uppercase tracking-wider">
                    No customer inquiries received yet.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className={`hover:bg-white/[0.02] transition-colors ${msg.status === 'unread' ? 'bg-[#D4AF37]/5' : ''}`}>
                    <td className="px-6 py-4 text-white/60 whitespace-nowrap">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {msg.first_name || ''} {msg.last_name || ''}
                    </td>
                    <td className="px-6 py-4">
                      <a href={`mailto:${msg.email}`} className="text-[#D4AF37] hover:underline font-mono">
                        {msg.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-white/80" title={msg.message}>
                      {msg.message}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                        msg.status === 'unread' 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                          : 'bg-white/5 text-white/50 border border-white/10'
                      }`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleMarkAsRead(msg.id, msg.status)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/10 transition-all"
                        title="Toggle Read Status"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-red-400 border border-white/10 transition-all"
                        title="Delete Message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Social & Phone Settings */}
      <div className="bg-[#0D0D0F] rounded-2xl border border-white/10 p-6 shadow-2xl space-y-6">
        <h2 className="text-lg font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 pb-3 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#D4AF37]" /> Official Contact & Social Channel URLs
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Phone Contact Number</label>
              <input 
                type="text" 
                value={settings.phone_number || ''} 
                onChange={e => setSettings({...settings, phone_number: e.target.value})} 
                placeholder="+92 300 0138707"
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Official WhatsApp Number</label>
              <input 
                type="text" 
                value={settings.whatsapp_number || ''} 
                onChange={e => setSettings({...settings, whatsapp_number: e.target.value})} 
                placeholder="+92 300 0138707"
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Instagram Channel URL</label>
              <input 
                type="text" 
                value={settings.instagram_url || ''} 
                onChange={e => setSettings({...settings, instagram_url: e.target.value})} 
                placeholder="https://instagram.com/wearorvano"
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">TikTok Channel URL</label>
              <input 
                type="text" 
                value={settings.tiktok_url || ''} 
                onChange={e => setSettings({...settings, tiktok_url: e.target.value})} 
                placeholder="https://tiktok.com/@wearorvano"
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/70">Facebook Page URL</label>
              <input 
                type="text" 
                value={settings.facebook_url || ''} 
                onChange={e => setSettings({...settings, facebook_url: e.target.value})} 
                placeholder="https://facebook.com/wearorvano"
                className="w-full bg-[#050506] border border-white/10 focus:border-[#D4AF37] px-4 py-3 text-sm rounded-xl text-white outline-none transition-colors" 
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          {message && (
            <p className={`text-xs font-bold ${message.includes('Error') ? 'text-red-400' : 'text-emerald-400'}`}>
              {message}
            </p>
          )}
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="ml-auto flex items-center gap-2 bg-[#D4AF37] hover:bg-[#F5D67B] text-black font-extrabold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Channel Links</span>
          </button>
        </div>
      </div>
    </div>
  )
}
