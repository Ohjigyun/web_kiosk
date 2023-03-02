import '../styles/globals.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor} from '../app/store'
import type { AppProps } from 'next/app'
import { Gamja_Flower } from 'next/font/google'

const myFont = Gamja_Flower({
    subsets: ['latin'],
    weight: ['400']
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <main className={myFont.className}>
            <Component {...pageProps} />
        </main>
      </PersistGate>
    </Provider>
  )
}
