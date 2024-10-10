'use client'

import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { editProfile } from '@/actions/skr/profile'
import { FormError } from '@/components/custom/form-error'
import SetupWrapper from '@/components/custom/setup-wrapper'
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProfileDescriptionSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/store/AuthStore'

export default function UserDescriptionPage() {
  const { refreshUser, user } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string>()
  const form = useForm<z.infer<typeof ProfileDescriptionSchema>>({
    resolver: zodResolver(ProfileDescriptionSchema),
    defaultValues: {
      shortDescription: '',
      longDescription: '',
      username: '',
    },
  })

  // Refresh user from store. User is redirected to this page after confirming email
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refreshUser(), [])

  useEffect(() => {
    if (!user) return

    form.reset({
      username: user.email?.split('@')[0],
    })
  }, [user, form])

  function onSubmit() {
    startTransition(() => {
      editProfile(form.getValues()).then((data) => {
        if (data?.error) return setError(data?.error)
      })
    })
  }
  return (
    <SetupWrapper
      title="Tell us about yourself"
      description="Fill out the following descriptions"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="space-y-2">
                  <h2 className="text-xl font-semibold">Username</h2>
                  <p className="text-sm text-muted-foreground">
                    This will help others identify your account.
                  </p>
                </FormLabel>
                <Input
                  {...field}
                />
              </FormItem>
            )}
          />


          {/* Short description */}
          <FormField
            control={form.control}
            name="shortDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="space-y-2">
                  <h2 className="text-xl font-semibold">What do you do?</h2>
                  <p className="text-sm text-muted-foreground">
                    Write a one line description about yourself.
                  </p>
                </FormLabel>
                <Input
                  placeholder="I'm..."
                  {...field}
                />
              </FormItem>
            )}
          />

          {/* Long description */}
          <FormField
            control={form.control}
            name="longDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="space-y-2">
                  <h2 className="text-xl font-semibold">Describe yourself</h2>
                </FormLabel>
                <Textarea
                  rows={10}
                  placeholder="Write a long description"
                  {...field}
                ></Textarea>
              </FormItem>
            )}
          />

          <FormError message={error} />
          <Button
            type="submit"
            disabled={isPending}
            className="ml-auto mt-4 w-max block"
          >
            Submit
          </Button>
        </form>
      </Form>
    </SetupWrapper>
  )
}
