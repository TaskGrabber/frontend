import { uploadProfilePicture } from '@/actions/profile-picture'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Profile, useAuthStore } from '@/store/AuthStore'
import { createClient } from '@/utils/supabase/client'
import { Edit } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState, useTransition } from 'react'

function ProfilePictureForm() {
  // Not using react-hook-form kasi idk pano magpasa ng `File` sa server action nang naka schema
  // Check `actions/profile-picture.ts`. Doon ko na vinavalidate ang form data
  const { profile } = useAuthStore()
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState('')
  const close = useRef<HTMLButtonElement>(null)
  //const form = useForm<z.infer<typeof ProfilePictureSchema>>({
  //  resolver: zodResolver(ProfilePictureSchema),
  //})

  function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!profile) return
    startTransition(() => {
      const form = new FormData(event.currentTarget)
      form.append('name', profile.id)

      uploadProfilePicture(form).then((data) => {
        if (data?.error) return console.error(data.error)
        close.current!.click()
      })
    })
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target
    const image = files?.item(0)

    if (!image) return
    setPreview(URL.createObjectURL(image))
  }

  return (
    <>
      <form
        onSubmit={upload}
        id="profile-picture-form"
        className="space-y-4"
      >
        <Input
          type="file"
          name="profile_picture"
          onChange={handleFileChange}
        />
        {!!preview && (
          <Image
            alt="profile picture preview"
            className="rounded-md w-auto h-auto"
            height={0}
            width={0}
            src={preview}
          />
        )}
      </form>
      <DialogClose ref={close}></DialogClose>
      <DialogFooter>
        <Button
          type="submit"
          form="profile-picture-form"
          disabled={isPending}
        >
          Upload
        </Button>
      </DialogFooter>
    </>
  )
}

interface ProfilePictureProps {
  profile: Profile | null
  isEditable?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function ProfilePicture({
  profile,
  isEditable = false,
  size = 'md',
}: ProfilePictureProps) {
  const supabase = createClient()
  const [avatarSrc, setAvatarSrc] = useState(
    '/images/profile_picture_placeholder.webp',
  )
  useEffect(() => {
    if (!profile) return
    const { data } = supabase.storage
      .from('profile_pictures')
      .getPublicUrl(profile.id)

    setAvatarSrc(data.publicUrl)
  }, [profile, supabase])

  return (
    <div className="relative mx-auto sm:mx-0">
      <Avatar
        className={cn(
          'rounded-full shadow-md border-primary',
          size == 'sm'
            ? 'border'
            : size == 'lg'
            ? 'border-5 size-36'
            : 'border-4 size-32',
        )}
      >
        <AvatarImage
          src={avatarSrc}
          alt="Profile Avatar"
        />
        <AvatarFallback>
          {/* TODO: fix. not working. */}
          <AvatarImage
            src="/images/profile_picture_placeholder.webp"
            alt="Profile Avatar Placeholder"
          />
        </AvatarFallback>
      </Avatar>
      {isEditable && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="absolute bottom-2 right-2 rounded-full p-2 shadow-m"
            >
              <Edit size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile Picture</DialogTitle>
              <DialogDescription>
                Upload a new profile picture
              </DialogDescription>
            </DialogHeader>
            <ProfilePictureForm />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
