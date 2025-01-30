export const readJsonStream = async function* (
  stream: ReadableStream<Uint8Array>
) {
  const reader = stream.getReader()
  const decoder = new TextDecoder('utf-8')
  let unhandled = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      return
    }
    const text = decoder.decode(value)
    unhandled += text
    const parts = unhandled.split('\n')
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      const json = JSON.parse(part)
      yield json
    }
    unhandled = parts[parts.length - 1]
  }
}
