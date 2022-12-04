export const getFreshToken = async (): Promise<string | undefined> => {
  const response = await fetch("/api/getFreshToken")
  const json = (await response.json()) as { token: string }
  return json.token ?? undefined
}
