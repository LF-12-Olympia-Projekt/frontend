"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import * as Popover from "@radix-ui/react-popover"

export interface ComboboxOption {
  value: string
  label: string
  sublabel?: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  loading?: boolean
  disabled?: boolean
  className?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found",
  loading = false,
  disabled = false,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const filtered = React.useMemo(() => {
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.sublabel?.toLowerCase().includes(q) ||
        o.value.toLowerCase().includes(q)
    )
  }, [options, query])

  const selected = options.find((o) => o.value === value)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={`w-full justify-between font-normal ${!selected ? "text-muted-foreground" : ""} ${className || ""}`}
        >
          <span className="truncate">
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-[var(--radix-popover-trigger-width)] rounded-md border bg-popover p-0 shadow-md"
          align="start"
          sideOffset={4}
        >
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-1">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">{emptyText}</div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                    setQuery("")
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${value === option.value ? "opacity-100" : "opacity-0"}`}
                  />
                  <div className="flex-1 text-left">
                    <div>{option.label}</div>
                    {option.sublabel && (
                      <div className="text-xs text-muted-foreground">{option.sublabel}</div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
