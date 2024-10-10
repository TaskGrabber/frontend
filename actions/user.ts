"use server"

import { PROFILE_STORE_FIELDS } from "@/lib/constants"
import { createAdminClient, createClient } from "@/utils/supabase/server"


/**
 * Refetches the authenticated user.
 *
 * Used after redirected from email confirmation.
 */
export async function refreshUser() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, profile: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select(PROFILE_STORE_FIELDS)
    .eq('user_id', user!.id)
    .single()

  return { user, profile }
}


export async function getUserByUsername(username: string) {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select(PROFILE_STORE_FIELDS)
    .eq('username', username)
    .single()

  const adminSupabase = createAdminClient()

  const { data: { user } } = await adminSupabase.auth.admin.getUserById(profile.user_id)

  return user
}
