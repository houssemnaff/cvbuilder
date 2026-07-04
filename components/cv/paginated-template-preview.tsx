"use client"

import type { ReactNode } from "react"

interface PaginatedTemplatePreviewProps {
  children: ReactNode
}

export function PaginatedTemplatePreview({ children }: PaginatedTemplatePreviewProps) {
  return (
    <div className="w-full overflow-auto bg-slate-100 py-6 sm:py-10 print:bg-white print:p-0">
      <div className="mx-auto w-full max-w-[210mm] min-h-[297mm] bg-white shadow-2xl ring-1 ring-slate-200 print:mx-0 print:max-w-none print:min-h-0 print:shadow-none print:ring-0">
        {children}
      </div>
    </div>
  )
}