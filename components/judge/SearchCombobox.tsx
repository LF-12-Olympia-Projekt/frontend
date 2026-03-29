// components/judge/SearchCombobox.tsx | Reusable search-as-you-type combobox
"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export interface SearchItem {
  id: string
  label: string
  sublabel?: string
}

interface SearchComboboxProps {
  id?: string
  placeholder?: string
  onSearch: (query: string) => Promise<SearchItem[]>
  onSelect: (item: SearchItem) => void
  initialLabel?: string
  required?: boolean
}

export function SearchCombobox({
  id,
  placeholder,
  onSearch,
  onSelect,
  initialLabel = "",
  required,
}: SearchComboboxProps) {
  const [query, setQuery] = useState(initialLabel)
  const [items, setItems] = useState<SearchItem[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setQuery(initialLabel)
  }, [initialLabel])

  const doSearch = (q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const results = await onSearch(q)
        setItems(results)
        setOpen(results.length > 0)
      } finally {
        setLoading(false)
      }
    }, 300)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value
    setQuery(q)
    doSearch(q)
  }

  const handleFocus = () => {
    if (!open && items.length === 0) {
      doSearch(query)
    } else {
      setOpen(items.length > 0)
    }
  }

  const handleSelect = (item: SearchItem) => {
    setQuery(item.label)
    setItems([])
    setOpen(false)
    onSelect(item)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          id={id}
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
        />
        {loading && (
          <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {open && (
        <ul className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border bg-popover shadow-md py-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-col px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
              onMouseDown={() => handleSelect(item)}
            >
              <span className="font-medium">{item.label}</span>
              {item.sublabel && (
                <span className="text-xs text-muted-foreground">{item.sublabel}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
