import { SignIn } from "components/SignIn"
import { setDoc } from "firebase/firestore"
import { getOutfitRef } from "hooks/firestore/getRefs"
import { useState } from "react"
import { Outfit } from "types/outfit"

const Page = () => {
  const [text, setText] = useState("")
  const [products, setProducts] = useState<Outfit[]>()
  return (
    <div>
      <SignIn />
      <h1>Outfits importer page</h1>

      <textarea
        maxLength={10_000_000}
        placeholder="Insert outfits json array here"
        onChange={e => setText(e.target.value)}
      ></textarea>
      <button
        onClick={async () => {
          const json = JSON.parse(text) as Outfit[]
          if (!Array.isArray(json)) {
            alert("Json is no array")
            return
          }
          if (!Array.isArray(json[0]?.products)) {
            alert("doesnot look like a product")
          }
          const processedJson = json.map(outfit => {
            console.log(outfit.products)
            return {
              ...outfit,
              id: "" + outfit.id,
              products: outfit.products?.map(product => ({ id: "" + product.id, link: product.link })) ?? [],
            }
          })
          setProducts(processedJson)
        }}
      >
        process json
      </button>
      <button
        onClick={async () => {
          const outfits = products
          if (!outfits) {
            alert("voll doof")
            return
          }
          for (const outfit of outfits) {
            await setDoc(getOutfitRef(outfit.id), outfit)
          }
        }}
      >
        insert {products?.length} outfits into the database
      </button>
    </div>
  )
}

export default Page
