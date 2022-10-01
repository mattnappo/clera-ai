from fastapi import FastAPI, Request
from dotenv import load_dotenv
import openai, os, PyPDF2

load_dotenv()

OPENAI_KEY = os.getenv('KEY')
openai.api_key = OPENAI_KEY

app = FastAPI()

prompts = ["What are the key points?", "List the times of all exams", "Who is class taugh by?"]

def summarize(file_name):
    reader = PyPDF2.PdfFileReader(os.path.join(os.getcwd(), file_name)).pages[0]
    text = reader.extract_text()
    
    response = openai.Completion.create(
        model="text-davinci-002",
        prompt=f"Summarize this syllabus:\n\n{text}",
        temperature=0.4,
        max_tokens=150,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0
    )
    
    return text, response['choices'][0]['text']

@app.post("/summarize")
async def get_summary(file_name : Request):
    req_info = await file_name.json()
    text, summary = summarize(req_info["file"])
    
    return {
        "status" : "SUCCESS",
        "text" : text,
        "summary" : summary
    }
    