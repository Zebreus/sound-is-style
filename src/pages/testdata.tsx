import { Demo } from "components/Demo"
import { SignIn } from "components/SignIn"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { getSpotify } from "util/getSpotify"
import { getUserData } from "util/spotify"

const Page = () => {
  const [data, setData] = useState<string>()
  const session = useSession()
  console.log(session)
  return (
    <div>
      <SignIn />
      <h1>My page</h1>
      <p>Content</p>
      <Demo />
      <button
        onClick={async () => {
          const spotify = await getSpotify()
          if (!spotify) {
            setData("No spotify object")
            return
          }
          const data = await getUserData(spotify)
          setData(JSON.stringify(data, undefined, 2))
        }}
      >
        get data
      </button>
      <p>{data}</p>
    </div>
  )
}

export default Page
