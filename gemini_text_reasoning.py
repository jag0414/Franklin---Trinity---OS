from google import genai
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

prompt = "Write a visionary essay about the future of human-AI collaboration."
response = client.models.generate_content(model="models/gemini-2.5-pro", contents=prompt)
print(response.text)
