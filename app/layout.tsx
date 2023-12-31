import './globals.css';
import { Toaster } from 'sonner';
import UIProvider from './providers/UIProvider';
import basicMetadata from './util/metadata';
import { UserContextProvider } from './context/UserContext';

export const metadata = basicMetadata();
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors />

        <UIProvider>
          <UserContextProvider>
            {children}
          </UserContextProvider>
        </UIProvider>
      </body>
    </html>
  )
}
