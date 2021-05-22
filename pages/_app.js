import { Nav } from '~/components/nav'

import '~/styles/app.css'

const App = ({ Component, pageProps }) => {
  return (
    <div className="w-full">
      <Nav />
      <Component {...pageProps} />
    </div>
  )
}

export default App
