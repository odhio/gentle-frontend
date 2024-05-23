import React from 'react'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col size-full">
      <main className="flex-1 size-full px-4 py-2">{children}</main>
    </div>
  )
}
