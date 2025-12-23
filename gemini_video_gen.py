from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

prompt = "A cinematic sunrise over a futuristic ocean city with AI-guided ships."

response = client.models.generate_videos(
    model="models/veo-3.1-generate-preview",
    prompt=prompt
)

with open("C:\\Users\\Jeremy Gosselin\\future_ocean_city.mp4", "wb") as f:
    f.write(response.videos[0].video_bytes)

print("✅ Video saved as future_ocean_city.mp4")



