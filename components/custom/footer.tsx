'use client'

import useNavbarRoutes from '@/hooks/useNavbarRoutes'
import { UserRole } from '@/lib/types'
import { useAuthStore } from '@/store/AuthStore'
import Link from 'next/link'

export const Footer = () => {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const role = user?.user_metadata?.role_code as UserRole
  const navbarRoutes = useNavbarRoutes(role)

  if (isLoading) return null
  return (
    <footer className="w-full px-6 2xl:px-0 pt-8 text-background bg-primary">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About */}
        <div>
          <h3 className="text-md font-bold mb-4">Task Grabber</h3>
          <p className="text-sm">
            a go-to platform for posting tasks and finding opportunities.
            Whether you&apos;re looking to get help or offer your skills,
            we&apos;ve got you covered.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-md font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {navbarRoutes.map((route) => (
              <li
                key={route.path}
                className="text-sm"
              >
                <Link href={route.path}>{route.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="text-sm">
          <h3 className="text-md font-bold mb-4">Contact Us</h3>
          <p>Email: support@taskgrabber.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>{' '}
      <div className="mt-8 text-sm py-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Task Grabber. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
