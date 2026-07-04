import React from 'react'

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="absolute left-4 top-4 z-50 -translate-y-16 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-transform focus:translate-y-0 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-ring"
    >
      Skip to main content
    </a>
  )
}
