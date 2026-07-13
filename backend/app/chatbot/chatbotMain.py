import os
from fastapi import APIRouter, HTTPException
from app.chatbot.chatbotClasses import ChatRequest
from app.config import settings
from google import genai
from google.genai import types

router = APIRouter(
    prefix="/chatbot",
    tags=["chatbot"],
)

SYSTEM_PROMPT = """
You are an academic advisor of the National University of Singapore.
Your role is to help students with FAQs regarding NUS, such as finding graduation requirements, module information, and navigating university life.
Keep your answers concise, friendly, and helpful. 
If a student asks something outside your knowledge or outside NUS scope, please let them know that you are unable to provide that information.
"""

@router.post("/message")
async def chat_with_bot(request: ChatRequest):
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API key is not configured.")

    try:
        client = genai.Client(api_key=api_key)
        
        contents = []
        for msg in request.messages:

            role = "user" if msg.role == "user" else "model"
            contents.append(
                types.Content(role=role, parts=[types.Part.from_text(text=msg.content)])
            )
            
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
            ),
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
