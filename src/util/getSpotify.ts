import SpotifyWebApi from "spotify-web-api-node"
import { getFreshToken } from "util/getFreshToken"

export const getSpotify = async () => {
  const token = await getFreshToken()

  if (!token) {
    return undefined
  }

  console.log(token)

  const spotify = new SpotifyWebApi()
  spotify.setClientId(process.env["NEXT_PUBLIC_SPOTIFY_CLIENT_ID"] ?? "")

  spotify.setAccessToken(token)
  return spotify
}
