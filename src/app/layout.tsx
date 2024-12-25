import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import SharedLayout from "./shared-layout";
import { DataProvider } from "./data-context";
import Tabs from './components/Tabs';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
     title: 'WatchList',
     description: 'Track the movies and shows you watch',
}

export default function RootLayout({
     children,
}: {
     children: React.ReactNode
}) {
     return (
          <html lang="en" suppressHydrationWarning>
               <head>
                    <meta name="theme-color" content="#317EFB" />

                    <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials"></link>
               </head>
               <body suppressHydrationWarning>
                    <DataProvider>
                         <SharedLayout />
                         {children}
                         <Tabs />
                    </DataProvider>
               </body>
          </html>
     )
}