import pymongo
import json
import os
import hashlib
from bson.json_util import dumps

DBNAME = 'dev_db'

# Map a filepath to uuid for each syllabus
def syllabus_id(filename, course):
    return hashlib.sha224((filename + course).encode('utf-8')).hexdigest()[:16]

class State:
    def __init__(self):
        self.client = pymongo.MongoClient(host="localhost", port=27017)
        self.db = self.client[DBNAME]

        # Each user is their own collection

    def clear(self):
        self.client.drop_database(DBNAME)

    def print_db(self):
        print(self.db.list_collection_names())
        for collection in self.db.list_collection_names():
            print(collection)
            cursor = self.db.collection.find({})
            for document in cursor:
                print(json.loads(dumps(document), indent=4))

    def store_syllabus(self, user, course, filename, contents):
        # Write file to disk
        path = os.path.abspath(f'./data/{user}/{filename}')
        os.system(f'mkdir -p {os.path.dirname(path)}')
        with open(path, 'wb') as f:
            f.write(contents)

        # Store entry in mongo
        syllabus_obj = {
            # Metadata
            "id": syllabus_id(path, course), # ID field
            "course": course,
            "filepath": path,
            "course": "",

            # To be computed later by ML pipeline
            "summary": "",
            "calendar": {},
            "gpa_weights": {},
            "questions": {},
        }

        self.db[user].create_index([('id', pymongo.TEXT)],
            unique=True, name='index')

        try:
            self.db[user].insert_one(syllabus_obj)
            return {"status": "ok"}
        except pymongo.errors.DuplicateKeyError: # Doesn't work
            return {"status": "document already exists"}

    # Return all syllabi with summaries
    def get_user(self, user):
        cursor = self.db[user].find({})
        json_user = dumps(list(cursor), indent = 2)
        return json.loads(json_user)

    # Set the summary of a user's syllabus
    def set_summary(self, user, course, summary):
        self.db[user].update_one({"course": course}, {"$set": {"summary": summary}})

    # Set calendar obj of syllabus
    def set_calendar(self, user, syllabus_id, calendar_obj):
        pass

    # Set gpa obj of syllabus
    def set_gpa(self, user, syllabus_id, gpa_obj):
        pass


