import React from 'react'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col h-[calc(100vh-70px)]">
      <main className="flex-1 w-full size-full px-4 py-2">{children}</main>
    </div>
  )
}
