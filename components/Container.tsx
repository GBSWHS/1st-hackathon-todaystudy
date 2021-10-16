// eslint-disable-next-line no-use-before-define
import React from 'react'

export default function Container ({ children }: { children: React.ReactElement | React.ReactElement[] }) {
  return (
    <div className="flex justify-center p-3">
      <div className="container">
        {children}
      </div>
    </div>
  )
}
