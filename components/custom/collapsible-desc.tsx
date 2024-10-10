'use client'

import { Button } from '@/components/ui/button'
import { CardDescription } from '@/components/ui/card'
import { cn, formatDescription } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

interface Props {
  className?: string
  buttonClassName?: string
  content: React.ReactNode
}

export function CollapsibleDesc({
  className,
  buttonClassName,
  content,
}: Props) {
  const [collapsed, setCollapsed] = useState(true)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const element = descriptionRef.current
    if (element) {
      setIsOverflowing(element.scrollHeight > element.clientHeight)
    }
  }, [content])

  return (
    <>
      <CardDescription
        ref={descriptionRef}
        className={cn(
          `whitespace-pre-line leading-relaxed text-gray-600 transition-all duration-300 ${collapsed ? 'line-clamp-3' : ''}`,
          className,
        )}
        dangerouslySetInnerHTML={{
          __html: !!content && formatDescription(content as string),
        }}
      />
      {isOverflowing && (
        <Button
          variant="link"
          className={cn(
            'text-primary font-medium hover:underline p-0 mt-2',
            buttonClassName,
          )}
          onClick={() => setCollapsed(!collapsed)}
        >
          See {collapsed ? 'more' : 'less'}
        </Button>
      )}
    </>
  )
}
