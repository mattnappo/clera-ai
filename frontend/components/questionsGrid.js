import { Fragment } from 'react'

const locations = [
  {
    name: 'Edinburgh',
    people: [
      { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
      { name: 'Courtney Henry', title: 'Designer', email: 'courtney.henry@example.com', role: 'Admin' },
    ],
  },
  // More people...
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function QuestionsGrid({questionsList}) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-200">Summary</h1>
          <p className="mt-2 text-sm text-gray-200">
            A summary of common questions for each course you are taking.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full">
                <tbody className="bg-white">
                  {questionsList.map((course) => (
                    <Fragment key={course.id}>
                      <tr className="border-t border-gray-200">
                        <th
                          colSpan={5}
                          scope="colgroup"
                          className="bg-gray-50 px-4 py-2 text-left text-sm font-bold text-gray-900 sm:px-6 h-auto"
                        >
                          {course.course}
                        </th>
                      </tr>
                      {course.questions.map((questionItem, questionIdx) => (
                        <tr
                          key={questionItem.question}
                          className={classNames(questionIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t text-clip')}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 text-clip">
                            {questionItem.question}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{questionItem.answer}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
