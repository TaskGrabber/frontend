"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { useAuthStore } from "@/store/AuthStore"
import { SeekerProfileHeader } from "@/components/custom/profile/profile-header"

interface Props {
  params: {
    username: string
  }
}

export default function SkrProfilePage({ params: { username } }: Props) {
  const { profile } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!profile) return
    if (profile.username === username) router.push("/skr/profile")
  }, [profile, router, username])

  return (
    <section className="container mx-auto h-screen">
      <SeekerProfileHeader username={username} />
    </section>
  )
}
