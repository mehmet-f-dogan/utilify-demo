import { Html, Head, Main, NextScript } from 'next/document'
import { SWRConfig } from 'swr'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <SWRConfig
        value={{
          refreshInterval: 3000,
          fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
        }}
      >
        <body>
          <Main />
          <NextScript />
        </body>
      </SWRConfig>
    </Html>
  )
}
