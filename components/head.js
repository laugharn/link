import NextHead from 'next/head'

export const Head = ({ children }) => {
  return (
    <NextHead>
      {children}
      <link href="/site.webmanifest" key="site-manifest" rel="manifest" />
      <link
        href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="
        key="icon"
        rel="icon"
      />
      <link href="/img/192.png" rel="apple-touch-icon" />

      <meta
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
        name="viewport"
      />
      <meta
        content="This is Links, a website for sharing links, things of that nature."
        key="description"
        name="description"
      />
      <meta content="Links" name="apple-mobile-web-app-title" />
    </NextHead>
  )
}
