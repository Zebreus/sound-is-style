import { getDocument, useDocument } from "hooks/firestore/core/useDocument"
import { getUserRef } from "hooks/firestore/getRefs"

// ts-prune-ignore-next
export function useUser(userId: string | undefined) {
  const { document } = useDocument(getUserRef(userId))
  return document
}

// ts-prune-ignore-next
export async function getUser(userId: string) {
  return await getDocument(getUserRef(userId))
}
