import { css } from "@emotion/react"
import { OutfitCard } from "components/OutfitCard"

const Page = () => {
  return (
    <>
      <div
        css={css`
          position: fixed;
          inset: 0;
          background: grey;
        `}
      >
        <div
          css={css`
            margin: 1rem;
            background: white;
            width: auto;
            height: 100%;
            position: relative;
          `}
        >
          <OutfitCard id={"13710"} image={0} />
          <OutfitCard id={"13710"} image={1} />
          <OutfitCard id={"13710"} image={2} />
          <OutfitCard id={"13710"} image={3} />
        </div>
      </div>
    </>
  )
}

export default Page
