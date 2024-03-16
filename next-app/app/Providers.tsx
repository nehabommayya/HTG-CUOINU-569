'use client'

import React, { FC, ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

interface ProvidersProps {
  children: ReactNode
}

const Providers: FC<ProvidersProps> = ({children}) => {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default Providers