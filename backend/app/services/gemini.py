import os, json
import google.generativeai as genai
from google.api_core import exceptions
 
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

MODEL_NAME = "gemini-3.1-flash-lite-preview"
model = genai.GenerativeModel(MODEL_NAME)
 
async def ask_gemini_json(prompt: str) -> dict:
    try:
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        return json.loads(response.text)
    except exceptions.ResourceExhausted as e:
        raise Exception(f"Gemini API Quota Exceeded (Limit 0). Check region/plan: {str(e)}")
    except Exception as e:
        raise Exception(f"Gemini API Error: {str(e)}")
 
async def ask_gemini_text(prompt: str) -> str:
    """Send prompt, return plain text."""
    response = model.generate_content(prompt)
    return response.text
 
def stream_gemini(prompt: str):
    """Generator for SSE streaming responses."""
    for chunk in model.generate_content(prompt, stream=True):
        if chunk.text:
            yield chunk.text