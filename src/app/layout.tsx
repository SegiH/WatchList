import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import SharedLayout from "./shared-layout";
import { DataProvider } from "./data-context";
import Tabs from './components/Tabs';

const inter = Inter({ subsets: ['latin'] })

import "./page.css";

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

                    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossOrigin="anonymous"></link>
               </head>
               <body>
                    <DataProvider>
                         <SharedLayout />
                         {children}
                         <Tabs />
                    </DataProvider>
               </body>
          </html>
     )
}

/*const getDarkMode = () => {          
          // We cannot directly access the DataContext here so we need to parse DataProvider
          const dp = JSON.stringify(DataProvider.toString());
          const darkModeStr = "const [darkMode, setDarkMode] = useState(";

          const dmStartIndex = dp.indexOf(darkModeStr);

          // TODO: Check if dmStartIndex = -1
          const dmEndIndex = dp.indexOf(";", dmStartIndex + 1);

          const dmStr = dp.substring(dmStartIndex, dmEndIndex - 1);

          const nextStr = "useState(";

          const nextIndex = dmStr.indexOf(nextStr);

          // TODO: Check if nextIndex = -1

          const dmValue = dmStr.substring(nextIndex + nextStr.length)

          if (dmValue === "true") {
               return true;
          } else {
               return false;
          }
     }

     getDarkMode();*/