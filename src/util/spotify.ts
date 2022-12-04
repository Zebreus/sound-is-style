import SpotifyWebApi from "spotify-web-api-node"
import { BasicSpotifyTrack, SpotifyArtist, SpotifyRecentTrack, SpotifyTrack, SpotifyUser } from "types/user"

const client_id = process.env["NEXT_PUBLIC_SPOTIFY_CLIENT_ID"]
const client_secret = process.env["SPOTIFY_CLIENT_SECRET"]
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64")

const getAccessToken = async (refresh_token: string) => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  })

  const result = await response.json()
  console.log([result])
  const newToken = result["access_token"]
  return newToken
}

export const getUsersPlaylists = async (refresh_token: string) => {
  const access_token = await getAccessToken(refresh_token)
  return fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

const toTrackObject = (track: SpotifyApi.TrackObjectFull): BasicSpotifyTrack => ({
  name: track.name,
  id: track.id,
  popularity: track.popularity,
  numArtists: track.artists.length,
  artistIds: track.artists.map(artist => artist.id),
  albumId: track.album.id,
  duration: track.duration_ms,
  releaseDate: Date.parse(track.album.release_date),
  age: Date.now() - Date.parse(track.album.release_date),
  tracksOnAlbum: track.album.total_tracks,
})

const toArtistObject = (artist: SpotifyApi.ArtistObjectFull): SpotifyArtist => ({
  name: artist.name,
  id: artist.id,
  popularity: artist.popularity,
  followers: artist.followers.total,
  genres: artist.genres,
})

const addAudioFeatures = async (spotify: SpotifyWebApi, tracks: BasicSpotifyTrack[]): Promise<SpotifyTrack[]> => {
  const trackIds = tracks.map(track => track.id)
  const response = await spotify.getAudioFeaturesForTracks(trackIds)
  const multipleAudioFeatures = response.body.audio_features
  const fullTracks: SpotifyTrack[] = tracks.flatMap(track => {
    const audioFeatures = multipleAudioFeatures.find(audioFeatures => audioFeatures.id === track.id)
    if (!audioFeatures) {
      return []
    }

    return {
      ...track,
      danceability: audioFeatures.danceability,
      energy: audioFeatures.energy,
      key: audioFeatures.key,
      loudness: audioFeatures.loudness,
      mode: audioFeatures.mode,
      speechiness: audioFeatures.speechiness,
      acousticness: audioFeatures.acousticness,
      instrumentalness: audioFeatures.instrumentalness,
      liveness: audioFeatures.liveness,
      valence: audioFeatures.valence,
      tempo: audioFeatures.tempo,
    }
  })

  return fullTracks
}

const getTopTracks = async (spotify: SpotifyWebApi): Promise<SpotifyTrack[]> => {
  const firstFifty = await spotify.getMyTopTracks({ offset: 0, limit: 49 })
  const secondFifty = await spotify.getMyTopTracks({ offset: 49, limit: 50 })

  const topTracks = [...firstFifty.body.items, ...secondFifty.body.items]

  const basicTracks = topTracks.map(toTrackObject)

  const fullTracks = await addAudioFeatures(spotify, basicTracks)
  return fullTracks
}

const getRecentTracks = async (spotify: SpotifyWebApi) => {
  const firstFifty = await spotify.getMyRecentlyPlayedTracks({ after: 0, limit: 50 })
  const oldestTrack = firstFifty.body.items.reduce((oldest, current) => {
    const oldestTime = Date.parse(oldest.played_at)
    const currentTrackTime = Date.parse(current.played_at)
    return oldestTime < currentTrackTime ? oldest : current
  })
  const oldestTrackDate = Date.parse(oldestTrack.played_at)

  const secondFifty = oldestTrackDate
    ? (await spotify.getMyRecentlyPlayedTracks({ before: oldestTrackDate, limit: 50 })).body.items
    : []

  const recentTracks = [...firstFifty.body.items, ...secondFifty]

  const sortedRecentTracks = recentTracks
    .filter((track, index) => index === recentTracks.findIndex(otherTrack => otherTrack.track.id === track.track.id))
    .sort((a, b) => {
      const aTime = Date.parse(a.played_at)
      const bTime = Date.parse(b.played_at)
      return aTime - bTime
    })

  const basicTracks = sortedRecentTracks.map(({ track }) => track).map(toTrackObject)
  const tracks = await addAudioFeatures(spotify, basicTracks)

  const history: SpotifyRecentTrack[] = sortedRecentTracks.map(track => ({
    id: track.track.id,
    timestamp: Date.parse(track.played_at),
    context: track.context.type,
  }))

  return { history, tracks }
}

const getTopArtists = async (spotify: SpotifyWebApi): Promise<SpotifyArtist[]> => {
  const firstFifty = await spotify.getMyTopArtists({ offset: 0, limit: 49 })
  const secondFifty = await spotify.getMyTopArtists({ offset: 49, limit: 50 })

  const topArtists = [...firstFifty.body.items, ...secondFifty.body.items]

  const artists = topArtists.map(toArtistObject)

  return artists
}

export const getUserData = async (spotify: SpotifyWebApi) => {
  const topTracks = await getTopTracks(spotify)
  const recentTracks = await getRecentTracks(spotify)
  const topArtists = await getTopArtists(spotify)

  const userResponse = await spotify.getMe()
  const user = userResponse.body

  const relevantTrackList = [...topTracks, ...recentTracks.tracks]

  const relevantTracks: Record<string, SpotifyTrack> = Object.fromEntries(
    relevantTrackList.map(track => [track.id, track])
  )

  const relevantArtists: Record<string, SpotifyArtist> = Object.fromEntries(
    topArtists.map(artist => [artist.id, artist])
  )

  const spotifyUser: SpotifyUser = {
    followers: user.followers?.total ?? 0,
    id: user.id,
    relevantTracks,
    relevantArtists,
    topArtists: topArtists.map(artist => artist.id),
    topTracks: topTracks.map(track => track.id),
    trackHistory: recentTracks.history,
  }

  return spotifyUser
}
