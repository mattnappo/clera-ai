from fastapi import FastAPI, File, UploadFile, Form
import base64
import state
from typing import List

app = FastAPI()
state = state.State()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/upload/")
def upload_syllabus(user: str = Form(), syllabus: UploadFile = Form()):
    contents = syllabus.file.read()
    state.store_syllabus(user, syllabus.filename, contents)

    ''' DO ML STUFF HERE '''

    return {"status": "ok"}

@app.post("/upload_all/")
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
