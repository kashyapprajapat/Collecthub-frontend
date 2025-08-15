import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  // Basic SEO
  title: {
    default: 'CollectHub - Your Personal Collections, All in One Place',
    template: '%s | CollectHub'
  },
  description: 'CollectHub is the ultimate platform to organize, track, and showcase your personal collections. From games and music to vehicles and programming languages - manage all your collections in one beautiful, intuitive interface.',
  
  // Keywords for SEO
  keywords: [
    'collection management',
    'personal collections',
    'organize collections',
    'collection tracker',
    'digital collection',
    'hobby management',
    'game collection',
    'music collection',
    'vehicle collection',
    'collection organizer',
    'collection database',
    'hobby tracker',
    'collectibles management',
    'personal inventory',
    'collection app'
  ],
  
  // Author and creator info
  authors: [{ name: 'Kashyap Prajapati' }],
  creator: 'Kashyap Prajapati',
  
  // Open Graph tags for social media
  openGraph: {
    title: 'CollectHub - Your Personal Collections, All in One Place',
    description: 'The ultimate platform to organize, track, and showcase all your personal collections. Games, music, vehicles, and more - all in one beautiful interface.',
    url: 'https://collecthub.vercel.app/', 
    siteName: 'CollectHub',
    images: [
      {
        url: '/og-image.jpg', 
        width: 1200,
        height: 630,
        alt: 'CollectHub - Personal Collection Management Platform',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter Card tags
  twitter: {
    card: 'summary_large_image',
    title: 'CollectHub - Your Personal Collections, All in One Place',
    description: 'Organize, track, and showcase all your personal collections in one beautiful platform.',
    images: ['/twitter-image.jpg'], 
    creator: '@Kashyap14112003', 
  },
  
  // Additional meta tags
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Favicon and icons
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  
  // Manifest for PWA support
  manifest: '/site.webmanifest',
  
  // Additional SEO meta tags
  category: 'technology',
  classification: 'Collection Management Software',
  
  
  // App-specific meta tags
  appleWebApp: {
    title: 'CollectHub',
    statusBarStyle: 'default',
    capable: true,
  },
  
  // Format detection
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Additional meta tags that can't be set via metadata object */}
          <meta name="theme-color" content="#000000" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          
          {/* Structured data for better SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "CollectHub",
                "description": "The ultimate platform to organize, track, and showcase your personal collections.",
                "url": "https://collecthub.vercel.app/",
                "applicationCategory": "ProductivityApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "creator": {
                  "@type": "Person",
                  "name": "Kashyap Prajapat"
                }
              })
            }}
          />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}