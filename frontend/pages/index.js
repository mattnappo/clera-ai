import Image from "next/image";
import React, { useState, useEffect } from "react";
import Header from "components/header";
import Loader from "components/loader";
import QuestionsGrid from "components/questionsGrid";
import axios from "axios";
import { RESPONSE_LIMIT_DEFAULT } from "next/dist/server/api-utils";
//require('dotenv').config();

export default function Home() {
    const [syllabiCount, setSyllabiCount] = useState(0);
    const [syllabi, setSyllabi] = useState([]);
    const [syllabiNames, setSyllabiNames] = useState([]);
    const [uploadingSyllabus, setUploadingSyllabus] = useState(false);
    const [loadingAnswer, setLoadingAnswer] = useState(false);
    const [userSubmitted, setUserSubmitted] = useState(false);
    const [question, setQuestion] = useState();
    const [user, setUser] = useState("");
    const [tempUser, setTempUser] = useState();
    const [answer, setAnswer] = useState("");
    const [courseSummary, setCourseSummary] = useState([]);

    useEffect(() => {
        if(user && user != undefined && user != ""){
            axios
                .get(process.env.NEXT_PUBLIC_BASE_URL + `/user/${user}`)
                .then((response) => {
                    setCourseSummary(response.data);
                })
                .catch((error) => {
                    console.log(error);
            });
        }
    }, [user]);

    useEffect(() => {
        setUser(window.localStorage.getItem("user"));
    }, []);

    useEffect(() => {
        window.localStorage.setItem("user", user);
    }, [user]);

    const deleteSyllabus = async (e, syllabusName) => {
        let syllabiTemp = syllabi.slice();
        let syllabiNamesTemp = syllabiNames.slice();

        const index = syllabiTemp.indexOf(e.target.value);
        const nameIndex = syllabiNamesTemp.indexOf(syllabusName);

        syllabiTemp.splice(index, 1);
        syllabiNamesTemp.splice(nameIndex, 1);

        setSyllabiNames(syllabiNamesTemp);
        setSyllabi(syllabiTemp);

        const path = e.target.value;

        //await axios.delete(`/api/upload/delete/${path}`)
    };

    const askQuestion = async (e) => {
        setLoadingAnswer(true);

        //API call to get answer
        const request = {
            "user": user,
            "prompt": question
        };

        console.log("getting QA")

        const { data } = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + '/full_qa', request)
        console.log("QA ans")
        console.log(data)

        if(data.answer == ""){
            setAnswer("Sorry, I do not understand")
        }
        else{
            setAnswer(data.answer);
        }

        setLoadingAnswer(false);
    };

    const uploadFileHandler = async (e) => {
        let syllabiTemp = syllabi;
        let syllabiNamesTemp = syllabiNames;

        try {
            setUploadingSyllabus(true);

            // for (let i = 0; i < e.target.files.length; i += 1) {
            //     const file = e.target.files[i]
            //     const formData = new FormData()
        
            //     formData.append('syllabus', file)
            //     formData.append('user', user)
            //     formData.append('course', file.name)

            //     //const { data } = await axios.post('/api/upload', formData, config)
            //     //syllabiTemp.push(data)

            //     syllabiTemp.push(formData);

            //     syllabiNamesTemp.push(file.name);
            // }


            const file = e.target.files[0]
            const formData = new FormData()
    
            formData.append('syllabus', file)
            formData.append('user', user)
            formData.append('course', file.name)

            syllabiTemp.push(formData);

            syllabiNamesTemp.push(file.name);

            // setSyllabi(syllabiTemp);
            // setSyllabiNames(syllabiNamesTemp);
            // setUploadingSyllabus(false);

        const config = {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }

        const { data } = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + '/upload', formData, config)

        syllabiTemp.push(data)

        //syllabiTemp.push(formData)

        syllabiNamesTemp.push(file.name)
      
        setSyllabi(syllabiTemp)
        setSyllabiNames(syllabiNamesTemp)
        setUploadingSyllabus(false)

        updateQuestionsSummary()

      } catch (error) {
        console.error(error)
        setUploadingSyllabus(false)
      }
    }

    function updateQuestionsSummary(){
        axios
            .get(process.env.NEXT_PUBLIC_BASE_URL + `/user/${user}`)
            .then((response) => {
                setCourseSummary(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function changeUser(e) {
          setUser();
          window.localStorage.setItem('user', null);
      }

    return (
        <>
            {/* <Header changeUser={changeUser} /> */}
            {(!user || user == "" || user == undefined) ? (
                <main className="text-center">
                    <h1 className="text-3xl text-gray-200 mb-2 "></h1>

                    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-200">
                                Enter a username to login or create an account
                            </h2>
                        </div>

                        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                                <form
                                    className="space-y-6"
                                    action="#"
                                    method="POST"
                                >
                                    <div>
                                        <label
                                            htmlFor="user"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Username
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="user"
                                                name="user"
                                                type="user"
                                                autoComplete="user"
                                                onChange={(e) =>
                                                    setTempUser(e.target.value)
                                                }
                                                required
                                                className="block w-full a bg-gray-100 ppearance-none rounded-md border text-gray-800 border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            onClick={(e) => {
                                                setUser(tempUser);
                                                setUserSubmitted(true);
                                            }}
                                            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Sign in/sign up
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            ) : (
                <main className="lg:min-h-screen lg:overflow-hidden lg:flex lg:flex-row-reverse">
                    <section
                        aria-labelledby="summary-heading"
                        className="hidden bg-gray-900 w-full max-w-md flex-col lg:flex"
                    >
                        <h2 id="summary-heading" className="sr-only">
                            Syllabi list
                        </h2>
                        <div className="flex justify-between">
                            <h2
                                id="order-heading"
                                className="ml-6 mt-6 text-lg font-medium text-gray-200"
                            >
                                Upload center
                            </h2>
                            <button
                              onClick={(e) => {
                                  changeUser(e);
                                  //   console.log(window.localStorage.getItem('user'));

                                  //   console.log("RUNNING");
                                  //   window.localStorage.setItem('user', "anythingelse");
                                  //   console.log(window.localStorage.getItem('user'));
                                  //window.location.href = "/";
                              }}
                              // onClick={this.props.changeUser}

                              className="mr-6 mt-4 rounded-md items-right justify-right content-right py-2 text-lg font-medium text-gray-200 hover:bg-gray-700 hover:text-white"
                            >
                              Change user
                            </button>
                        </div>
                        {uploadingSyllabus ? (
                            <Loader />
                        ) : (
                            <ul className="flex-auto overflow-y-auto divide-y divide-gray-200 px-6">
                                {
                                    //check if user has added syllabi
                                    courseSummary &&
                                    courseSummary.length > 0 &&
                                        courseSummary.map((syllabus, index) => (
                                            <li
                                                key={syllabus.id}
                                                className="flex py-6 space-x-4"
                                            >
                                                <Image
                                                    src={require("../images/fileImage.png")}
                                                    alt={"Syllabus"}
                                                    width={100}
                                                    height={100}
                                                    className="flex-none aspect-auto object-center object-cover bg-gray-200 rounded-md"
                                                />
                                                <div className="flex flex-col justify-between space-y-2">
                                                    <div className="flex space-x-4">
                                                        <h1>
                                                            {
                                                                syllabus.course
                                                            }
                                                        </h1>
                                                        {/* <button
                                                            type="button"
                                                            className="text-sm font-medium text-red-500 hover:text-red-700"
                                                            value={syllabus}
                                                            key={syllabus}
                                                            onClick={(e) =>
                                                                deleteSyllabus(
                                                                    e,
                                                                    syllabiNames[
                                                                        index
                                                                    ]
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button> */}
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                }
                                <form className="mt-4">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-200 mt-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            vectorEffect="non-scaling-stroke"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                        />
                                    </svg>

                                    <div className="mt-2 text-sm font-medium text-gray-200 text-center mb-6 content-center">
                                        <h3 className="mt-2 text-sm font-medium text-gray-200 text-center mb-6">
                                            Upload a syllabus
                                        </h3>
                                        <input
                                            type="file"
                                            onChange={(e) => {
                                                setSyllabiCount(
                                                    syllabiCount + 1
                                                );
                                                uploadFileHandler(e);
                                            }}
                                            defaultValue=""
                                            className="mt-2 ml-36 text-sm text-gray-900 font-medium text-center mb-6 content-center"
                                        />
                                    </div>
                                </form>
                            </ul>
                        )}
                    </section>

                    {courseSummary && courseSummary.length > 0 ? (
                        <>
                            {/* Chatbot section */}
                            <section
                                aria-labelledby="chatbot"
                                className="flex-auto overflow-y-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-12 lg:pb-24"
                            >
                            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-200 mb-2">
                                Hi, {user}
                            </h2>
                                <div className="flex items-start">
                                    <div className="w-full grid-1 mr-6">
                                        <label
                                            htmlFor="comment"
                                            className="sr-only"
                                        >
                                            Ask your question
                                        </label>
                                        <input
                                            name="comment"
                                            id="comment"
                                            className="p-4 w-full resize-none bg-gray-100 rounded-md border-0 border-b border-transparent focus:border-indigo-600 focus:ring-0 sm:text-md text-gray-900"
                                            placeholder="Ask Clera here..."
                                            defaultValue={""}
                                            onChange={(e) =>
                                                setQuestion(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="grid-2">
                                        <div className=" relative inset-y-0 right-2 flex items-center">
                                            <div className="">
                                                <button
                                                    onClick={askQuestion}
                                                    className="inline-flex py-4 items-center rounded-md border border-transparent bg-indigo-600 px-8 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                >
                                                    Ask
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    {(loadingAnswer || uploadingSyllabus) ? (
                                        <Loader />
                                    ) : (
                                        <>
                                            {answer && answer != "" && (
                                                <div class="pt-3 w-full mt-10 bg-gray-800 border-4 border-gray-500 grid grid-cols-12">
                                                    <div className="">
                                                        <Image
                                                            width={160}
                                                            height={160}
                                                            className="hidden lg:block"
                                                            src={require("images/logo.png")}
                                                            alt="HackMIT 2022"
                                                        />
                                                    </div>
                                                    <p className="w-full pt-3 pl-3 pb-6 justify-left text-4xl text-gray-200 col-span-9">
                                                        {answer}
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                <QuestionsGrid questionsList={courseSummary} />
                            </section>
                        </>
                    ) : (
                        <section
                            aria-labelledby="firstUploadSyllabus"
                            className="flex-auto overflow-y-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-12 lg:pb-24"
                        >
                            <h1 className="pt-32 flex-1 text-center center text-5xl text-gray-200 mb-2 ">
                                Welcome to Clera!
                            </h1>
                            <h1 className="pt-6 flex-1 text-center center text-1xl text-gray-200 mb-2 ">
                                Your personal AI academic assistant
                            </h1>
                        </section>
                    )}
                </main>
            )}
        </>
    );
}
