import json
from fastapi import FastAPI, Request
from dotenv import load_dotenv
import openai, os, PyPDF2

load_dotenv()

OPENAI_KEY = os.getenv('KEY')
openai.api_key = OPENAI_KEY

app = FastAPI()

files = ["syllabus.pdf"]

class_prompts = ["What is this class about?", "What is the class schedule?", "Who teaches the course?", "What is the grading?", "What is the academic honesty policy?", "When is the first exam?"]

def get_class_info(file_name):
    info = {}
    
    text = extract_text(file_name)
    
    info["Summary"] = summarize(text)
    
    for prompt in class_prompts:
        info[prompt] = q_and_a(text, prompt)
    
    return info

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
    
    return response['choices'][0]['text']

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
    
@app.get("/get_classes_info")
async def get_classes():
    info = {}
    
    for file in files:
        info[file] = get_class_info(file)
    
    return info
    