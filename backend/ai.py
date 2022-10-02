from fastapi import FastAPI, Request
from dotenv import load_dotenv
import openai, os, PyPDF2
import time

load_dotenv()

OPENAI_KEY = os.getenv('KEY')
openai.api_key = OPENAI_KEY

class_prompts = ["What is the name of the course?", "At what time is the course?", "What is this class about?", "What is the class schedule?", "Who teaches the course?", "What is the grading?", "What books are needed?", "When is the first exam?"]

def extract_text(file_name):
    reader = PyPDF2.PdfFileReader(file_name).pages
    doc = []
    for i in range(len(reader)):
        doc.append(reader[i].extract_text())
    return '\n'.join(doc)

async def get_class_info(text):
    info = {}

    print("text")
    print(text)
    print("\n\n")
    
    summary = await summarize(text)

    print("summary")
    print(summary)
    print(type(summary))
    print("\n\n")

    info['summary'] = summary
    
    info['questions'] = []
    for i, prompt in enumerate(class_prompts):
        info['questions'].append({
            "question": prompt,
            "answer": q_and_a(text, prompt)
        })

    return info

async def summarize(text):
    response = openai.Completion.create(
        model="text-davinci-002",
        prompt=f"Summarize this syllabus:\n\n{text}",
        temperature=0.4,
        max_tokens=150,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0,
        stop=["\n\n"]
    )

    time.sleep(3)

    #print([response['choices'][i] for i in range(len(response['choices']))
    
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

# -- dev -- #

'''
async def chat(question: Request):
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
    
'''
