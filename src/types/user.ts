export type BasicSpotifyTrack = {
  name: string
  id: string
  popularity: number
  numArtists: number
  artistIds: string[]
  albumId: string
  duration: number
  releaseDate: number
  age: number
  tracksOnAlbum: number
}

export type SpotifyTrack = BasicSpotifyTrack & {
  // Analysis
  danceability: number
  energy: number
  key: number
  loudness: number
  mode: number
  speechiness: number
  acousticness: number
  instrumentalness: number
  liveness: number
  valence: number
  tempo: number
}

export type SpotifyArtist = {
  name: string
  id: string
  popularity: number
  genres: string[]
  followers: number
}

export type SpotifyRecentTrack = {
  id: string
  timestamp: number
  context: SpotifyApi.ContextObject["type"]
}

export type SpotifyUser = {
  id: string
  followers: number
  relevantTracks: Record<string, SpotifyTrack>
  relevantArtists: Record<string, SpotifyArtist>
  topTracks: string[]
  topArtists: string[]
  trackHistory: SpotifyRecentTrack[]
}
