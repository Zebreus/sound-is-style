import { css } from "@emotion/react"
import { useOutfit } from "hooks/firestore/simple/useOutfit"

import dynamic from "next/dynamic"
import { useCallback, useState } from "react"

const TinderCard = dynamic(() => import("react-tinder-card"), {
  ssr: false,
})

type OutfitCardProps = {
  id: string
  image?: number
}

export const OutfitCard = ({ id, image = 0 }: OutfitCardProps) => {
  const outfit = useOutfit(id)
  const [done, setDone] = useState(false)
  const [removed, setRemoved] = useState(false)

  const onCardLeftScreen = useCallback(() => {
    setRemoved(true)
  }, [])

  const onSwipe = useCallback((direction: string) => {
    const like = direction === "right"
    console.log(`User ${like ? "liked" : "disliked"} outfit`)
    console.log("TODO: implement swiping logic")
    setDone(true)
  }, [])

  return (
    <>
      {!removed ? (
        <div
          css={css`
            background: transparent;
            width: 40vh;
            height: 80vh;
            position: absolute;
            ${done ? "pointer-events: none;" : ""}
          `}
        >
          {outfit ? (
            <TinderCard onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen()} preventSwipe={["down", "up"]}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                css={css`
                  background-color: green;
                  width: 50vh;
                  height: 80vh;
                  object-fit: contain;
                  border-radius: 1rem;
                  opacity: ${done ? 0 : 1};
                  transition: opacity 0.5s ease;
                `}
                src={outfit.images[image]}
                alt={"Texttext"}
              />
            </TinderCard>
          ) : (
            <span>loadign</span>
          )}
        </div>
      ) : null}
    </>
  )
}
