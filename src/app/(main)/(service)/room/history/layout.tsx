import React from 'react'

export default function HistoryLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="px-5 py-2">{children}</div>
}
