from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

prompt = "A futuristic city blending nature and AI at golden hour, cinematic quality."

response = client.models.generate_images(
    model="models/imagen-4.0-ultra-generate-001",
    prompt=prompt
)

with open("C:\\Users\\Jeremy Gosselin\\ai_city.png", "wb") as f:
    f.write(response.images[0].image_bytes)

print("✅ Image saved as ai_city.png")

