import React from 'react'

const Loader = () => {
  let circleCommonClasses = 'h-3 w-3 bg-mainTheme rounded-full';

  return (
    <>
      <div className='flex w-full justify-center pt-6'>
        <div className={`${circleCommonClasses} mr-1 animate-bounce`}></div>
        <div
            className={`${circleCommonClasses} mr-1 animate-bounce200`}
        ></div>
        <div className={`${circleCommonClasses} animate-bounce400`}></div>
      </div>
    </>
  )
}

export default Loader