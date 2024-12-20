'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ComboboxItem } from '@/lib/types'
import { cn } from '@/lib/utils'

export interface ComboboxProps<TValue = string> {
  items: ComboboxItem[]
  placeholder: string
  value: TValue
  onValueChange: (value: TValue) => void
  disabled?: boolean
}

/** TODO: make the following components
 * - Combobox (Not strict)
 * - AsyncCombobox (Not strict)
 * - StrictCombobox
 */

export function AsyncStrictCombobox({
  items,
  placeholder,
  value,
  onValueChange,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        asChild
        disabled={disabled}
        className={`${disabled && 'cursor-not-allowed'}`}
      >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            disabled && 'cursor-not-allowed',
          )}
          disabled={disabled}
        >
          {value
            ? items.find((item) => item.value === value)?.label ||
              'Select one...'
            : 'Select one...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {!items.length && <CommandItem disabled>Loading...</CommandItem>}
              {!!items.length &&
                items.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 size-4',
                        value === item.value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
