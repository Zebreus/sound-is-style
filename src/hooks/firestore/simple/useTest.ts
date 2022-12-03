import { getDocument, useDocument } from "hooks/firestore/core/useDocument"
import { getTestRef } from "hooks/firestore/getRefs"

// ts-prune-ignore-next
export function useTest(testId: string | undefined) {
  const { document } = useDocument(getTestRef(testId))
  return document
}

// ts-prune-ignore-next
export async function getTest(testId: string) {
  return await getDocument(getTestRef(testId))
}
