import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import React, { useState } from 'react';
import SyllabiList from 'components/syllabiList'
import Header from 'components/header'
import { PlusIcon } from '@heroicons/react/20/solid'

const uploadFileHandler = async (e) => {
  let syllabiTemp = syllabi

  try {
    setUploading(true)

    for (let i = 0; i < e.target.files.length; i += 1) {
      const file = e.target.files[i]
      const formData = new FormData()
      formData.append('image', file)

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      syllabiTemp.push(data)
    }

    setSyllabi(syllabiTemp)
    setUploading(false)
  } catch (error) {
    console.error(error)
    setUploading(false)
  }
}


export default function Home() {
  const [syllabiCount, setSyllabiCount] = useState(0);
  const [syllabi, setSyllabi] = useState([]);
  

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
            className='ml-6 mt-6 text-lg font-medium text-gray-200'
          >
            Syllabi
          </h2>

          <ul className='flex-auto overflow-y-auto divide-y divide-gray-200 px-6'>
            {
              //check if user has added syllabi
              syllabi && syllabi.length > 0 && syllabi[0].length > 1 ? (
                syllabi.map((imageItem) => (
                  <li key={imageItem} className='flex py-6 space-x-6'>
                    <img
                      src={imageItem}
                      alt={'Offer'}
                      className='flex-none w-60 aspect-auto max-h-100 object-center object-cover bg-gray-200 rounded-md'
                    />
                    <div className='flex flex-col justify-between space-y-2'>
                      <div className='flex space-x-4'>
                        <button
                          type='button'
                          className='text-sm font-medium text-mainTheme hover:text-mainTheme'
                          value={imageItem}
                          key={imageItem}
                          onClick={deleteImage}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                //else show default offer image
                <li key='1' className='flex py-6 space-x-6'>
                  <img
                    src={require('images/fileImage.png')}
                    alt={'Default offer image'}
                    className='flex-none w-60 aspect-auto max-h-100 object-center object-cover bg-gray-200 rounded-md'
                  />
                  <div className='flex flex-col justify-between space-y-2'></div>
                </li>
              )
            }
        <form className='mt-4'>
            <svg
            className="mx-auto h-12 w-12 text-gray-200"
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

          <h3 className="mt-2 text-sm font-medium text-gray-200 text-center mb-6">Upload a syllabus</h3>             
          <input type='file' onChange="" multiple className="mt-2 text-sm font-medium text-gray-200 text-center mb-6 content-center"/>
        </form>
        </ul>
      </section>

        <div className="text-center">

        {(syllabiCount == 0) ? (
          <>
            <h1 className="mt-6 text-lg font-medium text-gray-300 mb-6">Get started by uploading a syllabus</h1>
          </>
        ) : (
        <>
          <SyllabiList/>
        </>
        )}

        <svg
          className="mx-auto h-12 w-12 text-gray-200"
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

        <h3 className="mt-2 text-sm font-medium text-gray-300">Upload a syllabus</h3>
          <div className="mt-6">
          <input type="file" name="file"/>

            <button
              type="button"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              Upload
            </button>
          </div>
      </div>

      </main>
    </>
  )
}
