from fastapi import FastAPI, Request
from dotenv import load_dotenv
import openai, os, PyPDF2

load_dotenv()

OPENAI_KEY = os.getenv('KEY')
openai.api_key = OPENAI_KEY

app = FastAPI()

files = ["syllabus.pdf"]
prompts = ["What are the key points?", "List the times of all exams", "Who is class taugh by?"]

options = [] # add short long answer

def extract_text(file_name):
    reader = PyPDF2.PdfFileReader(os.path.join(os.getcwd(), file_name)).pages[0]
    text = reader.extract_text()
    
    return text

def summarize(text):
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

def q_and_a(knowledge, question):
    response = openai.Completion.create(
        model="text-davinci-002",
        prompt=f"{knowledge}\n\nQ: {question}\n Give a brief answer. A:",
        temperature=0,
        max_tokens=100,
        top_p=1,
        frequency_penalty=0.0,
        presence_penalty=0.0,
        stop=["\n\n"]
    )
    
    return response['choices'][0]['text']

@app.post("/chat")
async def chat(question : Request):
    q = await question.json()
    text = extract_text(files[0])
    
    a = q_and_a(text, q['question'])
    
    return {
        "answer" : a
    }
    
@app.post("/summarize")
async def get_summary(file_name : Request):
    file_name = await file_name.json()
    text = extract_text(files[0])
    
    summary = summarize(text, file_name['file'])
    
    return {
        "summary" : summary
    }
    