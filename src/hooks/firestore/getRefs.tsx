import { collection, doc, DocumentData, DocumentReference, getFirestore } from "firebase/firestore"
import { genericConverter, WithRef } from "hooks/firestore/FirestoreDocument"
import { Test } from "types/test"

function getConvertedCollection<T extends DocumentData>(path: string) {
  const ref = collection(getFirestore(), path)
  return ref.withConverter(genericConverter<T>())
}

function getConvertedDocument<T extends DocumentData>(path: string) {
  const ref = doc(getFirestore(), path)
  return ref.withConverter(genericConverter<T>())
}

// ts-prune-ignore-next
export function getTestsRef() {
  return getConvertedCollection<Test>(`tests`)
}

// ts-prune-ignore-next
export function getTestRef(testId: string): DocumentReference<WithRef<Test>>
export function getTestRef(testId: string | undefined): undefined | DocumentReference<WithRef<Test>>
export function getTestRef(testId: string | undefined): undefined | DocumentReference<WithRef<Test>> {
  return testId ? getConvertedDocument<Test>(`tests/${testId}`) : undefined
}
