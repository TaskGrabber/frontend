'use server'

import { RegisterSchema, RegisterWithRoleSchema } from '@/lib/schema'
import { formatErrorMessage } from '@/lib/utils'
import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import * as z from 'zod'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()

  const { error } = await supabase
    .rpc('user_exists_by_email', { _email: validatedFields.data.email })

  if (error) return { error: formatErrorMessage(error.message) }
}

export const registerWithRole = async (
  values: z.infer<typeof RegisterWithRoleSchema>,
) => {
  const validatedFields = RegisterWithRoleSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      error: 'Invalid fields!',
    }
  }

  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email: values.email,
    password: values.password,
    options: {
      data: {
        first_name: values.firstName,
        last_name: values.lastName,
        role_code: values.roleCode,
      },
    },
  })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  redirect(`/auth/verify/tell?email=${values.email}`)
}
