import { CommonHead } from "components/CommonHead"
import { useInitialize } from "hooks/useInitialize"
import { NextPage } from "next"
import { AppProps } from "next/dist/shared/lib/router/router"
// eslint-disable-next-line import/no-named-as-default
import { ReactElement, ReactNode } from "react"

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useInitialize()

  const getLayout = Component.getLayout ?? (page => page)

  return (
    <>
      <CommonHead />
      {getLayout(<Component {...pageProps} />)}
    </>
  )
}

export default MyApp
