video should be loaded
as public and protected for that bun
ny get request differently

first i should make request to bunny server for free
second i should make request for protected routes

for that i should understand how bunny server works and how can i make free and protected requests
so than how i understood user send jwt token based on protected route so i think
i should configure somehow working with my jwt and if user paid i should include in credentials of that protected url
watching paid urls

i should consider how can i make that

Frontend requests video URL -> Backend generates signed URL -> Backend returns signed URL -> Frontend player streams video

async getProtectedVideoUrl(videoId: string): Promise<string> {
const apiKey = process.env.BUNNY_API_KEY
const libraryId = process.env.BUNNY_LIBRARY_ID

// Example Bunny API request to generate a signed URL
const response = await axios.post(
`https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}/access`,
{},
{ headers: { AccessKey: apiKey } }
)

return response.data.signedUrl // Time-limited playable URL
}

# frontend usage

// Fetch signed URL from backend
const { signedUrl } = await fetch(`/api/courses/video/${videoId}/signed-url`).then(r => r.json())

// Use in player

<iframe src={signedUrl} width="640" height="360" allowfullscreen></iframe>

so i think i should make logic like user make request to backend with jwt, if user paid i will return signed url and user can play it 
