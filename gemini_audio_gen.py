from google.cloud import texttospeech
import os

# Make sure GOOGLE_APPLICATION_CREDENTIALS points to your service account key JSON file
# You can set it in your terminal before running:
# setx GOOGLE_APPLICATION_CREDENTIALS "C:\path\to\your\service-account.json"

client = texttospeech.TextToSpeechClient()

text = "Together, we rise with intelligence and truth."

synthesis_input = texttospeech.SynthesisInput(text=text)
voice = texttospeech.VoiceSelectionParams(
    language_code="en-US",
    name="en-US-Studio-O",  # You can change to another voice if you like
)
audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

response = client.synthesize_speech(
    input=synthesis_input, voice=voice, audio_config=audio_config
)

with open("C:\\Users\\Jeremy Gosselin\\voice_message.mp3", "wb") as out:
    out.write(response.audio_content)
print("✅ Audio saved as voice_message.mp3")



