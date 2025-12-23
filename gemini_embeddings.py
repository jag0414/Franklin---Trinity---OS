from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

text = "AI is the mirror of human will."
embedding = client.models.embed_content(
    model="models/text-embedding-004",
    contents=text
)

print("✅ Embedding vector length:", len(embedding.embeddings[0].values))


