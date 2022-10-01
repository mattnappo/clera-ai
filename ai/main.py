from fastapi import FastAPI, Request
from dotenv import load_dotenv
import openai, os, PyPDF2

load_dotenv()

OPENAI_KEY = os.getenv('KEY')
openai.api_key = OPENAI_KEY

app = FastAPI()

files = ["syllabus.pdf"]
prompts = ["What are the key points?", "List the times of all exams", "Who is class taugh by?"]

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
        prompt=f"{knowledge}\n\nQ: {question}",
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
        "answer" : a[a.index(":") + 2:]
    }
    