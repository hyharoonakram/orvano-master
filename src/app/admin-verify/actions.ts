'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function verifyPin(formData: FormData) {
  const pin = formData.get('pin') as string
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?next=/admin-verify')
  }

  // Get the user's admin_pin and is_admin from the database
  const { data: profile } = await supabase
    .from('users')
    .select('admin_pin, is_admin')
    .eq('id', user.id)
    .single()

  const isAdmin = profile && (profile.is_admin === true || profile.is_admin === 1 || profile.is_admin === '1');

  if (isAdmin && profile.admin_pin && profile.admin_pin === pin) {
    const cookieStore = await cookies()
    cookieStore.set('admin_verified', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    redirect('/admin')
  } else {
    redirect('/admin-verify?error=Invalid PIN or Unauthorized')
  }
}
