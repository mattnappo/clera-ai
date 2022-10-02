from fastapi import FastAPI, File, UploadFile, Form
from typing import Optional
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

@app.get("/test/user/{user}")
def test_user(user: str):
    with open("test.json") as f:
        return json.loads(f.read())

@app.post("/upload/")
async def upload_syllabus(user: str = Form(), course: str = Form(), syllabus: UploadFile = Form()):
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

