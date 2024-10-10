'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as z from 'zod'

import { ProfileDescriptionSchema } from '@/lib/schema'
import { createClient } from '@/utils/supabase/server'

export const editProfile = async (
  values: z.infer<typeof ProfileDescriptionSchema>,
) => {
  const supabase = createClient()
  const validatedFields = ProfileDescriptionSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user!.id)
    .single()

  const { error } = await supabase
    .from('profiles')
    .update({
      short_desc: values.shortDescription,
      long_desc: values.longDescription,
      username: values.username,
    })
    .eq('id', profile!.id)
  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect('/skr/setup/address')
}
