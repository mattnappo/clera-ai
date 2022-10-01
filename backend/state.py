import redis
import json
import os

class State:
    def __init__(self):
        self.r = redis.Redis(host='localhost', port=6379, db=0)
        
    def store_syllabus(self, user, filename, contents):
        # Write file to disk
        path = os.path.abspath(f'./data/{user}/{filename}')
        os.system(f'mkdir -p {os.path.dirname(path)}')
        with open(path, 'wb') as f:
            f.write(contents)

        # Store entry in redis
        user_obj = {
            "user": user,
            "syllabi": [
                {
                    # Metadata
                    "filepath": path,

                    # To be computed later by ML pipeline
                    "course_title": "",
                    "summary": "",
                    "calendar": {},
                    "gpa_weights": {},
                },
            ]
        }
        json_user = json.dumps(user_obj)
        self.r.set(user, json_user)

    # Return all syllabi with summaries
    def user(self, user):
        pass


