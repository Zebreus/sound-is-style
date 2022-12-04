import { NextApiHandler } from "next"
import { getToken } from "next-auth/jwt"
import SpotifyWebApi from "spotify-web-api-node"

const handler: NextApiHandler = async (req, res) => {
  const session = await getToken({ req })
  if (!session) {
    return res.status(400).json({})
  }
  const token = session["accessToken"] as string
  console.log({ token })
  // const playlists = await getUsersPlaylists(token)
  // const result = await playlists.json()

  //   const spotify = new SpotifyWebApi()
  //   spotify.setClientId(process.env["NEXT_PUBLIC_SPOTIFY_CLIENT_ID"] ?? "")
  //   spotify.setClientSecret(process.env["SPOTIFY_CLIENT_SECRET"] ?? "")
  //   spotify.setRefreshToken(token)
  //   const response = await spotify.refreshAccessToken()
  //   spotify.setAccessToken(response.body.access_token)

  const spotify = new SpotifyWebApi()
  spotify.setClientId(process.env["NEXT_PUBLIC_SPOTIFY_CLIENT_ID"] ?? "")
  spotify.setClientSecret(process.env["SPOTIFY_CLIENT_SECRET"] ?? "")
  spotify.setRefreshToken(token)
  const response = await spotify.refreshAccessToken()

  const refreshedToken = response.body.access_token

  res.status(200).json({ token: refreshedToken })
  return
}

export default handler
