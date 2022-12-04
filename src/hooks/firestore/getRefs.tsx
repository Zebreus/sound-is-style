import { collection, doc, DocumentData, DocumentReference, getFirestore } from "firebase/firestore"
import { genericConverter, WithRef } from "hooks/firestore/FirestoreDocument"
import { Outfit } from "types/outfit"
import { SpotifyUser } from "types/user"

function getConvertedCollection<T extends DocumentData>(path: string) {
  const ref = collection(getFirestore(), path)
  return ref.withConverter(genericConverter<T>())
}

function getConvertedDocument<T extends DocumentData>(path: string) {
  const ref = doc(getFirestore(), path)
  return ref.withConverter(genericConverter<T>())
}

// ts-prune-ignore-next
export function getUsersRef() {
  return getConvertedCollection<SpotifyUser>(`users`)
}

// ts-prune-ignore-next
export function getUserRef(userId: string): DocumentReference<WithRef<SpotifyUser>>
export function getUserRef(userId: string | undefined): undefined | DocumentReference<WithRef<SpotifyUser>>
export function getUserRef(userId: string | undefined): undefined | DocumentReference<WithRef<SpotifyUser>> {
  return userId ? getConvertedDocument<SpotifyUser>(`users/${userId}`) : undefined
}

// ts-prune-ignore-next
export function getOutfitsRef() {
  return getConvertedCollection<Outfit>(`outfits`)
}

// ts-prune-ignore-next
export function getOutfitRef(outfitId: string): DocumentReference<WithRef<Outfit>>
export function getOutfitRef(outfitId: string | undefined): undefined | DocumentReference<WithRef<Outfit>>
export function getOutfitRef(outfitId: string | undefined): undefined | DocumentReference<WithRef<Outfit>> {
  return outfitId ? getConvertedDocument<Outfit>(`outfits/${outfitId}`) : undefined
}
