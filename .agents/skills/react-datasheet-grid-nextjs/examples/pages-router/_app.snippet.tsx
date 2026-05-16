// pages/_app.tsx
import type { AppProps } from 'next/app'
import 'react-datasheet-grid/dist/style.css'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
