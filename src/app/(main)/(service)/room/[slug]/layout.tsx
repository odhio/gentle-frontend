import React from 'react'

export default function RoomLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div className="bg-gray-900 h-full">{children}</div>
}
