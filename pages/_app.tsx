import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

function MyApp ({ Component, pageProps }: AppProps) {
  return <div><Component {...pageProps} /><Toaster /></div>
}

export default MyApp
