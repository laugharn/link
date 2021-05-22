import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html className="dark:bg-black dark:text-white">
        <Head>
          <link href="https://rsms.me" rel="preconnect" />
          <link
            href="https://rsms.me/inter/inter-display.css"
            rel="stylesheet"
          />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
