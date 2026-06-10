import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata = {
  title: 'CallZ Concierge',
  description: 'Layanan concierge pribadi Anda',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/images/logo.jpg" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}