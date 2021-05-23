import { AppProvider } from '~/containers/app'
import { Footer } from '~/components/footer'
import { Nav } from '~/components/nav'

import '~/styles/app.css'

const App = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <div className="flex flex-col md:min-h-screen w-full">
        <Nav />
        <Component {...pageProps} />
        <Footer />
      </div>
    </AppProvider>
  )
}

export default App
