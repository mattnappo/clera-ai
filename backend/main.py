from fastapi import FastAPI, File, UploadFile, Form
import base64
from typing import List, Optional
from pydantic import BaseModel
import json

import backend.ai as ai
import backend.state as state

class Course(BaseModel):
    user: str
    course: str
    summary: Optional[str]
    calendar: Optional[dict]
    gpa: Optional[dict]

app = FastAPI()
state = state.State()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/test/user/{user}")
def test_user(user: str):
    with open("test.json") as f:
        return json.loads(f.read())

@app.post("/upload/")
async def upload_syllabus(user: str = Form(), course: str = Form(), syllabus: UploadFile = Form()):
    course = course.lower()
    # Store in DB
    contents = syllabus.file.read()
    status = state.store_syllabus(user, course, syllabus.filename, contents)
    if status['status'] != 'ok':
        return status

    # Read text from pdf
    text = ai.extract_text(status['abspath'])
    # Do ML
    info_obj = await ai.get_class_info(text)

    #print(info_obj)
    #print(text)
    # Store output of ML in db
    status = state.store_ml(user, course, info_obj, text)
    return status

@app.post("/upload_all/fut/") # Future
def upload_syllabi(user: str = Form(), syllabi: List[UploadFile] = Form()):
    for syllabus in syllabi:
        upload_syllabus(user, syllabus)
    return {"status": "ok"}

@app.get("/user/{user}")
def get_user(user: str):
    return state.get_user(user)

@app.get("/clear")
def clear():
    state.clear()
    return {"status": "ok"}

