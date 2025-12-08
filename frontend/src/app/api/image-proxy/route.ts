export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const imageUrl = searchParams.get('url')
  const apiKey = process.env.NEXT_PUBLIC_BUNNY_API_KEY
  if (!imageUrl) {
    return new Response('Missing url query parameter', { status: 400 })
  }

  const response = await fetch(imageUrl, {
    headers: {
      AccessKey: apiKey || '',
    },
  })

  if (!response.ok) {
    return new Response('Error fetching image', { status: response.status })
  }

  const buffer = await response.arrayBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/jpeg',
    },
  })
}
