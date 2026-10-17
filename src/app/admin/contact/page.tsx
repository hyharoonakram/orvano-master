import { createClient } from '@/utils/supabase/server'
import { ContactClient } from './ContactClient'

export default async function AdminContactPage() {
  const supabase = await createClient()
  
  // Fetch messages
  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    
  // Fetch store settings for social handles
  const { data: settings } = await supabase
    .from('store_settings')
    .select('phone_number, whatsapp_number, instagram_url, tiktok_url, facebook_url')
    .eq('id', 1)
    .single()

  return <ContactClient initialMessages={messages || []} initialSettings={settings || {}} />
}
