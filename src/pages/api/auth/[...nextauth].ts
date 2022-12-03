import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"

const spotifyScopes = [
  "user-read-email",
  "playlist-read-private",
  "user-library-read",
  "user-top-read",
  "user-read-recently-played",
  "user-follow-read",
]

export default NextAuth({
  providers: [
    SpotifyProvider({
      authorization: `https://accounts.spotify.com/authorize?scope=${spotifyScopes.join(",")}`,
      clientId: process.env["NEXT_PUBLIC_SPOTIFY_CLIENT_ID"] ?? "",
      clientSecret: process.env["SPOTIFY_CLIENT_SECRET"] ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      console.log(token)
      if (account) {
        token["accessToken"] = account.refresh_token
      }
      return token
    },
    async session({ session, user }) {
      console.log("Session", { session, user })
      session.user = user
      return session
    },
  },
})
