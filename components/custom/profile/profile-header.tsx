'use client'

import { CollapsibleDesc } from '@/components/custom/collapsible-desc'
import { EditForm } from '@/components/custom/profile/edit-form'
import {
  SeekerVerificationList,
  VerificationList,
} from '@/components/custom/profile/verification-list'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { PROFILE_STORE_FIELDS } from '@/lib/constants'
import { useAuthStore } from '@/store/AuthStore'
import { createClient } from '@/utils/supabase/client'
import { AvatarImage } from '@radix-ui/react-avatar'
import { Edit, Share2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { EditAddressForm } from './edit-address-form'
import { ProfileRating } from './rating'
import { ProfilePicture } from './picture'
import { SeekerSkillsList } from './skills-list'

export function OwnProfileHeader() {
  const { profile, user } = useAuthStore()

  const joinedDate = new Date(profile?.created_at).toLocaleDateString('PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Card className="shadow-lg rounded-md max-w-4xl mx-auto md:p-4 xl:p-6">
      <CardHeader className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 space-y-4 sm:space-y-0">
        {/* Avatar and Edit Button */}
        <ProfilePicture profile={profile} />

        {/* Profile Information */}
        <div className="flex-grow text-center sm:text-left space-y-3">
          <div className="flex flex-col space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              {profile?.first_name} {profile?.last_name}
            </h1>
            <span className="text-md text-gray-500">
              {profile?.username
                ? `@ ${profile.username}`
                : 'Username not provided'}
            </span>
          </div>
          {/* Rating Section */}
          <div className="flex justify-center sm:justify-start items-center space-x-2">
            <ProfileRating profile={profile} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Short Description and Address */}
        <div className="space-y-2 text-center md:text-left flex flex-col items-center md:items-start justify-center">
          <h2 className="text-lg sm:text-xl font-semibold text-primary">
            {profile?.short_desc || 'No short description available'}
          </h2>
          <EditAddressForm address={profile?.addresses?.[0] || null} />
          <div className="text-gray-500 text-sm">
            <span>Joined {joinedDate}</span>
          </div>
        </div>

        {/* Collapsible Long Description */}
        <CollapsibleDesc
          content={profile?.long_desc || 'No detailed description provided'}
          className="break-words text-center md:text-left"
        />

        {/* Button Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex justify-center sm:justify-start gap-x-4">
            <Button
              size="icon"
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              <Share2 />
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-full bg-primary text-white px-6 hover:bg-primary-dark mx-auto sm:mx-0">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full sm:w-[720px] max-w-[unset]">
              <EditForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Skills List */}
        {user?.user_metadata.role_code === "SKR" && <SeekerSkillsList skills={profile?.profile_skills} />}

        {/* Verification List */}
        <VerificationList />
      </CardContent>
    </Card>
  )
}

interface SeekerProfileHeaderProps {
  username: string
}
export function SeekerProfileHeader({ username }: SeekerProfileHeaderProps) {
  const supabase = createClient()
  const [profile, setProfile] = useState<Record<string, any>>({})
  const avatarSrc = 'https://placehold.co/150'
  const router = useRouter()

  useEffect(() => {
    supabase
      .from('profiles')
      .select(PROFILE_STORE_FIELDS)
      .eq('username', username)
      .single()
      .then(({ data, error }) => {
        if (error) return console.error(error)

        if (!data.is_completed) router.push('/skr/profile')
        setProfile(data)
      })
  }, [supabase, username, router])

  const joinedDate = new Date(profile?.created_at).toLocaleDateString('PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="space-y-4">
      <Avatar className="size-[150px] relative rounded-md">
        <AvatarImage src={avatarSrc} />
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-2 right-2 rounded-sm"
        >
          <Edit />
        </Button>
      </Avatar>
      <section className="grid grid-flow-col grid-cols-[1fr_auto] gap-y-4 grid-rows-[repeat(5,auto)]">
        <h1 className="text-2xl font-bold">
          {profile?.first_name} {profile?.last_name}{' '}
          <span className="font-normal">@{profile?.username}</span>
        </h1>
        <ProfileRating profile={profile} />
        <h2 className="text-lg font-bold">{profile?.short_desc}</h2>
        <div className="flex gap-x-2 items-center">
          <span className="font-bold">·</span>
          <span>Joined {joinedDate}</span>
        </div>

        <CollapsibleDesc content={profile?.long_desc} />

        <div className="row-span-full ">
          <SeekerVerificationList username={username} />
        </div>
      </section>
    </header>
  )
}

interface ProviderProfileHeaderProps {
  username: string
}
export function ProviderProfileHeader({
  username,
}: ProviderProfileHeaderProps) {
  const supabase = createClient()
  const [profile, setProfile] = useState<Record<string, any>>({})
  const avatarSrc = 'https://placehold.co/150'
  const router = useRouter()

  useEffect(() => {
    supabase
      .from('profiles')
      .select(PROFILE_STORE_FIELDS)
      .eq('username', username)
      .single()
      .then(({ data, error }) => {
        if (error) return console.error(error)
        setProfile(data)
      })
  }, [supabase, username, router])

  const joinedDate = new Date(profile?.created_at).toLocaleDateString('PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="space-y-4">
      <Avatar className="size-[150px] relative rounded-md">
        <AvatarImage src={avatarSrc} />
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-2 right-2 rounded-sm"
        >
          <Edit />
        </Button>
      </Avatar>
      <section className="grid grid-flow-col grid-cols-[1fr_auto] gap-y-4 grid-rows-[repeat(3,auto)]">
        <h1 className="text-2xl font-bold">
          {profile?.first_name} {profile?.last_name}{' '}
          <span className="font-normal">@{profile?.username}</span>
        </h1>
        <ProfileRating profile={profile} />
        <div className="flex gap-x-2 items-center">
          <span>Joined {joinedDate}</span>
        </div>

        <div className="row-span-full">
          <SeekerVerificationList username={username} />
        </div>
      </section>
    </header>
  )
}
