import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import Tabs from './components/Tabs/Tabs';
import { DataProvider } from "./context";
import { ThemeProvider } from "next-themes"
import SharedLayout from "./shared-layout";

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
          <html lang="en" suppressHydrationWarning className='dark'>
               <head>
                    <meta name="theme-color" content="#317EFB" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                    <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials"></link>
               </head>
               <body suppressHydrationWarning>
                    <ThemeProvider attribute="class">
                         <DataProvider>
                              <SharedLayout />
                              {children}
                              <Tabs />
                         </DataProvider>
                    </ThemeProvider>
               </body>
          </html>
     )
}