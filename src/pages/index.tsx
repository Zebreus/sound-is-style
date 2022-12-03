import { Demo } from "components/Demo"
import { SignIn } from "components/SignIn"

const Page = () => {
  return (
    <div>
      <SignIn />
      <h1>My page</h1>
      <p>Content</p>
      <Demo />
    </div>
  )
}

export default Page
