import { AppProvider } from '~/containers/app'
import { AuthProvider } from '~/containers/auth'
import { Footer } from '~/components/footer'
import { Nav } from '~/components/nav'
import { Processing } from '~/components/processing'

import '~/styles/app.css'

const App = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <AuthProvider>
        <div className="flex flex-col md:min-h-screen relative w-full">
          <Nav />
          <Component {...pageProps} />
          <Footer />
          <Processing />
        </div>
      </AuthProvider>
    </AppProvider>
  )
}

export default App
