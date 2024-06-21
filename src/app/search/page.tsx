import { Input } from '@/components/ui/input'
import React from 'react'

function page() {
  return (
    <div className="container flex flex-col items-center justify-start xl:col-span-8 sm:col-span-9 col-span-10 py-10">
      <Input className="w-1/2" placeholder="Search" />
    </div>
  )
}

export default page