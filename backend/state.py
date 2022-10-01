import pymongo
import json
import os
import hashlib
from bson.json_util import dumps

DBNAME = 'dev_db'

# Map a filepath to uuid for each syllabus
def filepath_to_id(filepath):
    return hashlib.sha224(filepath.encode('utf-8')).hexdigest()[:16]

class State:
    def __init__(self):
        self.client = pymongo.MongoClient(host="localhost", port=27017)
        self.db = self.client[DBNAME]

    def clear(self):
        self.client.drop_database(DBNAME)

    def print_db(self):
        cursor = self.db.find({})
        for document in cursor:
            print(document)

    def store_syllabus(self, user, filename, contents):
        # Write file to disk
        path = os.path.abspath(f'./data/{user}/{filename}')
        os.system(f'mkdir -p {os.path.dirname(path)}')
        with open(path, 'wb') as f:
            f.write(contents)

        # Store entry in mongo
        user_obj = {
            "user": user,
            "syllabi": [
                {
                    # Metadata
                    "id": filepath_to_id(path), # ID field
                    "filepath": path,

                    # To be computed later by ML pipeline
                    "course_title": "",
                    "summary": "",
                    "calendar": {},
                    "gpa_weights": {},
                },
            ]
        }

        self.db.insert_one(user_obj)

    # Return all syllabi with summaries
    def get_user(self, user):
        cursor = self.db.find({"user": user})
        json_user = dumps(list(cursor), indent = 2)
        return json_user

    # Set the summary of a user's syllabus
    def set_summary(self, user, syllabus_id, summary):
        pass

    # Set calendar obj of syllabus
    def set_calendar(self, user, syllabus_id, calendar_obj):
        pass

    # Set gpa obj of syllabus
    def set_gpa(self, user, syllabus_id, gpa_obj):
        pass


