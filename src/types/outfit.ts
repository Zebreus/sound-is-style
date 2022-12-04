export type Outfit = {
  id: string
  link: string
  outfitArtist: string
  outfitName: string
  sex: "female" | "male"
  likes: number
  images: string[]
  products: { id: string; link: string }[]
}
