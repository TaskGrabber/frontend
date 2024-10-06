'use client'

import { OwnProfileHeader } from '@/components/custom/profile/profile-header'
import Spinner from '@/components/custom/spinner'
import { useAuthStore } from '@/store/AuthStore'
import { useEffect } from 'react'

export default function ProfilePage() {
  const { refreshUser, isLoading } = useAuthStore()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => refreshUser(), [])

  if (isLoading) return <Spinner />

  return <OwnProfileHeader />

}
