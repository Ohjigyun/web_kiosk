import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Gamja_Flower } from 'next/font/google'

const myFont = Gamja_Flower({
    subsets: ['latin'],
    weight: ['400']
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={myFont.className}>
        <Component {...pageProps} />
    </main>
  )
}
