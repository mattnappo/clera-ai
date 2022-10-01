from fastapi import FastAPI, File, UploadFile, Form
import base64
from typing import List, Optional
from pydantic import BaseModel

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

@app.post("/upload/")
def upload_syllabus(user: str = Form(), course: str = Form(), syllabus: UploadFile = Form()):
    # Store in DB
    contents = syllabus.file.read()
    status = state.store_syllabus(user, course, syllabus.filename, contents)
    if status['status'] != 'ok':
        return status

    # Read text from pdf
    text = ai.extract_text(status['abspath'])
    print(text)
    # Do ML
    info_obj = ai.get_class_info(text)

    #print(info_obj)
    #print(text)
    # Store output of ML in db
    state.store_ml(user, course, info_obj, text)

    #state.print_db()

@app.post("/upload_all/DEP/") # Deprecated
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


# DEV ROUTES
@app.post("/dev/set_summary/")
def dev_set_summary(req: Course):
    state.set_summary(req.user, req.course, req.summary)
    return {"status": "ok"}

@app.post("/dev/set_calendar/")
def dev_set_calendar(user: str, course: str, calendar: dict):
    state.set_calendar(user, course, calendar)
    return {"status": "ok"}

@app.post("/dev/set_gpa/")
def dev_set_gpa(user: str, course: str, gpa: dict):
    state.set_gpa(user, course, gpa)
    return {"status": "ok"}

