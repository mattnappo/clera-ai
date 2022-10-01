from fastapi import FastAPI
from dotenv import load_dotenv
import os

import openai

load_dotenv()

OPENAI_KEY = os.getenv('KEY')
print(OPENAI_KEY)
openai.api_key = OPENAI_KEY

app = FastAPI()

@app.get("/")
async def root():
    gpt_prompt = "Correct this to standard English:\n\nShe no went to the market."

    response = openai.Completion.create(
    engine="text-davinci-002",
    prompt=gpt_prompt,
    temperature=0.5,
    max_tokens=256,
    top_p=1.0,
    frequency_penalty=0.0,
    presence_penalty=0.0
    )

    return {"message": response['choices'][0]['text']}

print("hey")