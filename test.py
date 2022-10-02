import openai, os, PyPDF2
from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_KEY = os.getenv('KEY')
openai.api_key = OPENAI_KEY

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


s = """
CSC 256/456 Syllabus
John Criswell
Fall 2020
1 Instructors
Instructor TA
Name John Criswell Benjamin Valpey
Email criswell@cs bvalpey@cs
Oce Hours TBD N/A
2 Class Location and Time
For the safety of the students, TA, and instructor, this semester's course will
be conducted entirely online: there will be no in-person contact . We will
use the ocial class time for online lectures and discussion. Information on
                                       able reasons include, but are not limited                                                                                        [36/20664]
to, documented illness and family emergencies. The instructor reserves the right
to request documentation (e.g., a doctor's note) to verify claims of illness, emer-
gency, etc. However, due to the COVID-19 pandemic, the instructor will
waive this right except in suspicious or extraordinary circumstances .
Students requesting an extension should consult with the instructor at least
a week before the assignment's deadline.
10 Oce Hours
If you have questions and cannot make it to the oce hours, please email the
instructor for a one-on-one appointment. The email should contain the phrase
\CSC256 Oce Hours" or \CSC456 Oce Hours" in the subject.
5
11 Academic Honesty
All assignments and activities associated with this course must be performed in
accordance with the University of Rochester's Academic Honesty Policy. More
information is available at http://www.rochester.edu/college/honesty.
Violations of academic honesty include, but are not limited to , the following:
Copying code from another group on a programming assignment
Working in groups larger than those authorized by the instructor
Copying answers on written homework assignments
Copying text from a paper without quoting the paper (even if it cites the
original paper)
Copying text from a paper and modifying the text without quoting the
original paper (even if it cites the original paper)
6
12 Tentative Topics
Below is a tentative list of topics for the course. The instructor reserves the
right to change the list of topics at his discretion.
Processes, Signals, and Pipes
System calls, Kernel mode, and Process Implementation
Inter-process communication and threads
Synchronization
Deadlocks
CPU Scheduling
Basic memory management
Virtual Memory
Page replacement policies
I/O systems and Storage devices
File Systems
Security and Protection
Network Stack Implementation
Operating System Kernel Vulnerabilities and Defenses
Microkernels
7"""

print(summarize(s))
