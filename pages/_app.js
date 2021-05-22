import { AppProvider } from '~/containers/app'
import { Nav } from '~/components/nav'

import '~/styles/app.css'

const App = ({ Component, pageProps }) => {
  return (
    <AppProvider>
      <div className="w-full">
        <Nav />
        <Component {...pageProps} />
      </div>
    </AppProvider>
  )
}

export default App
