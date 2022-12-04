import { getDocument, useDocument } from "hooks/firestore/core/useDocument"
import { getOutfitRef } from "hooks/firestore/getRefs"

// ts-prune-ignore-next
export function useOutfit(outfitId: string | undefined) {
  const { document } = useDocument(getOutfitRef(outfitId))
  return document
}

// ts-prune-ignore-next
export async function getOutfit(outfitId: string) {
  return await getDocument(getOutfitRef(outfitId))
}
