import { css } from "@emotion/react"
import { increment, setDoc } from "firebase/firestore"
import { getTestRef } from "hooks/firestore/getRefs"
import { useTest } from "hooks/firestore/simple/useTest"

export const Demo = () => {
  const test = useTest("alpha")

  const mynum = test?.id ?? 0

  return (
    <button
      onClick={() => {
        setDoc(getTestRef("alpha"), { id: increment(1) }, { merge: true })
      }}
      css={css`
        background-color: ${mynum % 2 === 0 ? "red" : "blue"};
      `}
    >
      Click to increment the current number {mynum}
    </button>
  )
}
