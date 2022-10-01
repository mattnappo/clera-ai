import Image from 'next/image'
import React, { useState } from 'react';
import Header from 'components/header'

export default function Home() {
  const [syllabiCount, setSyllabiCount] = useState(0);
  const [syllabi, setSyllabi] = useState([]);
  const [syllabiNames, setSyllabiNames] = useState([]);
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState("Clark Kent")

  const deleteSyllabus = async (e, syllabusName) => {
    let syllabiTemp = syllabi.slice()
    let syllabiNamesTemp = syllabiNames.slice()

    const index = syllabiTemp.indexOf(e.target.value)
    const nameIndex = syllabiNamesTemp.indexOf(syllabusName)
  
    syllabiTemp.splice(index, 1)
    syllabiNamesTemp.splice(nameIndex, 1)

    setSyllabiNames(syllabiNamesTemp)
    setSyllabi(syllabiTemp)
  
    const path = e.target.value

    //await axios.delete(`/api/upload/delete/${path}`)
  }

  const uploadFileHandler = async (e) => {
    let syllabiTemp = syllabi
    let syllabiNamesTemp = syllabiNames

    try {
      setUploading(true)

      for (let i = 0; i < e.target.files.length; i += 1) {
        const file = e.target.files[i]
        const formData = new FormData()
        formData.append('syllabus', file)

        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }

        //const { data } = await axios.post('/api/upload', formData, config)
        //syllabiTemp.push(data)

        syllabiTemp.push(formData)

        syllabiNamesTemp.push(file.name)
      }

      setSyllabi(syllabiTemp)
      setSyllabiNames(syllabiNamesTemp)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  return (
    <>
      <Header/>
      <main className='lg:min-h-screen lg:overflow-hidden lg:flex lg:flex-row-reverse'>

      <section
          aria-labelledby='summary-heading'
          className='hidden bg-gray-800 w-full max-w-md flex-col lg:flex'
        >
          <h2 id='summary-heading' className='sr-only'>
            Syllabi list
          </h2>
          <h2
            id='order-heading'
            className='ml-6 mt-2 text-lg font-medium text-gray-200'
          >
            Syllabi
          </h2>

          <ul className='flex-auto overflow-y-auto divide-y divide-gray-200 px-6'>
            {
              //check if user has added syllabi
              syllabi && syllabi.length > 0 && (
                syllabi.map((syllabus,index) => (
                  <li key={syllabiNames[index]} className='flex py-6 space-x-4'>
                    <Image
                      src={require('../images/fileImage.png')}
                      alt={'Syllabus'}
                      width={100}
                      height={100}
                      className='flex-none aspect-auto object-center object-cover bg-gray-200 rounded-md'
                    />
                    <div className='flex flex-col justify-between space-y-2'>
                      <div className='flex space-x-4'>
                        <h1>{syllabiNames[index]}</h1>
                        <button
                          type='button'
                          className='text-sm font-medium text-red-500 hover:text-red-700'
                          value={syllabus}
                          key={syllabus}
                          onClick={e => deleteSyllabus(e, syllabiNames[index])}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )
            }
        <form className='mt-4'>
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
          <h3 className="mt-2 text-sm font-medium text-gray-200 text-center mb-6">Upload a syllabus</h3>             
          <input type='file' onChange={e =>{
            setSyllabiCount(syllabiCount + 1);
            uploadFileHandler(e);
          }}
           multiple className="mt-2 ml-24 text-sm font-medium text-gray-200 text-center mb-6 content-center"/>
        </div>
        </form>
        </ul>
      </section>

 



      {/* Chatbot section */}
      <section
          aria-labelledby='chatbot'
          className='flex-auto overflow-y-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-12 lg:pb-24'
        >
          <h1 className="text-3xl text-gray-200 mb-2 ">Hi, {user}</h1>
        <div className="flex items-start space-x-4">
          <div className="min-w-0 flex-1">
            <form action="#">
              <div className="border-b border-gray-200 focus-within:border-indigo-600">
                <label htmlFor="comment" className="sr-only">
                  Add your comment
                </label>
                <textarea
                  rows={2}
                  name="comment"
                  id="comment"
                  className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 focus:border-indigo-600 focus:ring-0 sm:text-md text-gray-900"
                  placeholder=" Ask your question..."
                  defaultValue={''}
                />
              </div>
              <div className="flex justify-between pt-2">
                <div className="flex-shrink-0">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-8 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Ask
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

    </main>
    </>
  )
}
