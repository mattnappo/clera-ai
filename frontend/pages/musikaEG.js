import React, { useEffect } from 'react'
import { Fragment, useState } from 'react'
import { Listbox, Transition, Disclosure } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { createOffer } from '../actions/offerActions'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { getUserDetails } from '../actions/userActions'
import Loader from '../components/Loader'

const categories = [
  { id: 1, category: 'Commercial supplies' },
  { id: 2, category: 'Electronics' },
  { id: 3, category: 'Fashion' },
  { id: 4, category: 'Home and garden' },
  { id: 5, category: 'Properties' },
  { id: 6, category: 'Services' },
  { id: 7, category: 'Vehicles' },
  { id: 8, category: 'Other' },
]

const yesOrNos = [
  { id: 1, decision: 'Yes' },
  { id: 2, decision: 'No' },
]

const conditions = [
  { id: 1, condition: 'New' },
  { id: 2, condition: 'Used' },
]

//country code of user's phone
const countryCodes = [
  { id: 1, countryCode: '+1' },
  { id: 2, countryCode: '+27' },
  { id: 3, countryCode: '+44' },
  { id: 4, countryCode: '+234' },
  { id: 5, countryCode: '+244' },
  { id: 6, countryCode: '+258' },
  { id: 7, countryCode: '+260' },
  { id: 8, countryCode: '+263' },
  { id: 9, countryCode: '+266' },
  { id: 10, countryCode: '+267' },
  { id: 11, countryCode: '+268' },
]

//locations for offer
const locations = [
  { id: 1, location: 'Bulawayo' },
  { id: 2, location: 'Chitungwiza' },
  { id: 3, location: 'Harare' },
  { id: 4, location: 'Kwekwe' },
  { id: 5, location: 'Marondera' },
  { id: 6, location: 'Mutare' },
  { id: 7, location: 'Victoria Falls' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const CreateOfferScreen = ({ history }) => {
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDetails = useSelector((state) => state.userDetails)
  const { user } = userDetails

  useEffect(() => {
    if (userInfo) {
      if (!user || !user.name) {
        dispatch(getUserDetails('profile'))
      } else {
      }
    }
  }, [dispatch, userInfo, user])

  const [priceNegotiableSelected, setPriceNegotiableSelected] = useState(false)
  const [price, setPrice] = useState(0)
  const [categorySelected, setCategorySelected] = useState(categories[0])
  const [locationSelected, setLocationSelected] = useState(locations[2])
  const [countryCodeSelected, setCountryCodeSelected] = useState(
    countryCodes[7]
  )
  const [conditionSelected, setConditionSelected] = useState(conditions[0])
  const [deliverySelected, setDeliverySelected] = useState(yesOrNos[0])
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  const [name, setName] = useState('')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)

  const deleteImage = async (e) => {
    let imagesTemp = images.slice()
    const index = imagesTemp.indexOf(e.target.value)

    imagesTemp.splice(index, 1)

    setImages(imagesTemp)

    const path = e.target.value.substring(9)

    await axios.delete(`/api/upload/delete/${path}`)
  }

  const uploadFileHandler = async (e) => {
    let imagesTemp = images

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

        imagesTemp.push(data)
      }

      setImages(imagesTemp)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  function submitCreateOffer(e) {
    e.preventDefault()

    dispatch(
      createOffer(
        user._id,
        name,
        categorySelected.category,
        description,
        countryCodeSelected.countryCode + phone,
        locationSelected.location,
        price,
        images,
        deliverySelected.decision === 'Yes' ? true : false,
        priceNegotiableSelected,
        conditionSelected.condition
      )
    )

    history.push('/chooseplan')
  }
  return (
    <>
      <main className='lg:min-h-full lg:overflow-hidden lg:flex lg:flex-row-reverse'>
        <h1 className='sr-only'>Create offer</h1>
        <section
          aria-labelledby='summary-heading'
          className='hidden bg-gray-50 w-full max-w-md flex-col lg:flex'
        >
          <h2 id='summary-heading' className='sr-only'>
            Offer images
          </h2>
          <h2
            id='order-heading'
            className='ml-6 mt-6 text-lg font-medium text-gray-900'
          >
            Images
          </h2>

          <ul className='flex-auto overflow-y-auto divide-y divide-gray-200 px-6'>
            {
              //check if user has added images
              images && images.length > 0 && images[0].length > 1 ? (
                images.map((imageItem) => (
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
                    src={require('../images/defaultImage.png')}
                    alt={'Default offer image'}
                    className='flex-none w-60 aspect-auto max-h-100 object-center object-cover bg-gray-200 rounded-md'
                  />
                  <div className='flex flex-col justify-between space-y-2'></div>
                </li>
              )
            }
            <form className='mt-4'>
              Add images
              <input type='file' onChange={uploadFileHandler} multiple />
            </form>
            {uploading && <Loader />}
          </ul>
        </section>

        {/* Checkout form */}
        <section
          aria-labelledby='payment-heading'
          className='flex-auto overflow-y-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-0 lg:pb-24'
        >
          <h2 id='payment-heading' className='sr-only'>
            Create new offer
          </h2>

          <div className='max-w-lg mx-auto lg:pt-8'>
            <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
              Create Offer
            </h1>

            <form className='mt-6' onSubmit={submitCreateOffer}>
              <div className='grid grid-cols-12 gap-y-6 gap-x-4'>
                <div className='col-span-full'>
                  <label
                    htmlFor='title'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Title
                  </label>
                  <div className='mt-1'>
                    <input
                      type='text'
                      id='title'
                      name='title'
                      required
                      autoComplete='title'
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                      }}
                      className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-mainTheme focus:border-mainTheme sm:text-sm'
                    />
                  </div>
                </div>

                <div className='col-span-full sm:col-span-6'>
                  <Listbox
                    value={categorySelected}
                    onChange={setCategorySelected}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className='block text-sm font-medium text-gray-700'>
                          Category
                        </Listbox.Label>
                        <div className='mt-1 relative'>
                          <Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-mainTheme focus:border-mainTheme sm:text-sm'>
                            <span className='block truncate'>
                              {categorySelected.category}
                            </span>
                            <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                              <SelectorIcon
                                className='h-5 w-5 text-gray-400'
                                aria-hidden='true'
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                          >
                            <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                              {categories.map((person) => (
                                <Listbox.Option
                                  key={person.id}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? 'text-white bg-mainTheme'
                                        : 'text-gray-900',
                                      'cursor-default select-none relative py-2 pl-8 pr-4'
                                    )
                                  }
                                  value={person}
                                >
                                  {({ categorySelected, active }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          categorySelected
                                            ? 'font-semibold'
                                            : 'font-normal',
                                          'block truncate'
                                        )}
                                      >
                                        {person.category}
                                      </span>

                                      {categorySelected ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? 'text-white'
                                              : 'text-mainTheme',
                                            'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                          )}
                                        >
                                          <CheckIcon
                                            className='h-5 w-5'
                                            aria-hidden='true'
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>

                <div className='col-span-full sm:col-span-6'>
                  <Listbox
                    value={locationSelected}
                    onChange={setLocationSelected}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className='block text-sm font-medium text-gray-700'>
                          Location
                        </Listbox.Label>
                        <div className='mt-1 relative'>
                          <Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-mainTheme focus:border-mainTheme sm:text-sm'>
                            <span className='block truncate'>
                              {locationSelected.location}
                            </span>
                            <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                              <SelectorIcon
                                className='h-5 w-5 text-gray-400'
                                aria-hidden='true'
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                          >
                            <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                              {locations.map((location) => (
                                <Listbox.Option
                                  key={location.id}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? 'text-white bg-mainTheme'
                                        : 'text-gray-900',
                                      'cursor-default select-none relative py-2 pl-8 pr-4'
                                    )
                                  }
                                  value={location}
                                >
                                  {({ locationSelected, active }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          locationSelected
                                            ? 'font-semibold'
                                            : 'font-normal',
                                          'block truncate'
                                        )}
                                      >
                                        {location.location}
                                      </span>

                                      {locationSelected ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? 'text-white'
                                              : 'text-mainTheme',
                                            'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                          )}
                                        >
                                          <CheckIcon
                                            className='h-5 w-5'
                                            aria-hidden='true'
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>

                <div className='col-span-full'>
                  <label
                    htmlFor='price'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Price (USD)
                  </label>
                  <div className='mt-1'>
                    <input
                      type='number'
                      name='price'
                      id='price'
                      autoComplete='price'
                      placeholder='$'
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value)
                      }}
                      className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-mainTheme focus:border-mainTheme sm:text-sm'
                    />
                  </div>
                  <div className='relative flex items-start mt-4'>
                    <div className='flex items-center h-5'>
                      <input
                        id='priceNegotiable'
                        aria-describedby='priceNegotiable-description'
                        name='priceNegotiable'
                        type='checkbox'
                        value={priceNegotiableSelected}
                        onChange={(e) => {
                          setPriceNegotiableSelected(
                            e.target.checked ? true : false
                          )
                        }}
                        className='focus:ring-mainTheme h-4 w-4 text-mainTheme border-gray-300 rounded'
                      />
                    </div>
                    <div className='ml-3 text-sm'>
                      <label
                        htmlFor='priceNegotiable'
                        className='font-medium text-gray-700'
                      >
                        Is the price negotiable?
                      </label>
                      <span
                        id='priceNegotiable-description'
                        className='text-gray-500'
                      >
                        <span className='sr-only'>Price Negotiable</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className='col-span-full'>
                  <div className='flex justify-between'>
                    <label
                      htmlFor='phone'
                      className='block text-sm font-medium text-gray-700 col-span-full pb-2'
                    >
                      Phone number for Whatsapp
                    </label>
                    <span id='phone-optional' className='text-sm text-gray-500'>
                      Optional
                    </span>
                  </div>
                  <div className='w-full flex'>
                    <div className='w-1/5 pr-1'>
                      <Listbox
                        value={countryCodeSelected}
                        onChange={setCountryCodeSelected}
                        className='px-4 w-1/5'
                      >
                        {({ open }) => (
                          <>
                            <div className='relative'>
                              <Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-mainTheme focus:border-mainTheme sm:text-sm'>
                                <span className='block truncate'>
                                  {countryCodeSelected.countryCode}
                                </span>
                                <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                                  <SelectorIcon
                                    className='h-5 w-5 text-gray-400'
                                    aria-hidden='true'
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave='transition ease-in duration-100'
                                leaveFrom='opacity-100'
                                leaveTo='opacity-0'
                              >
                                <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                                  {countryCodes.map((countryCode) => (
                                    <Listbox.Option
                                      key={countryCode.id}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? 'text-white bg-mainTheme'
                                            : 'text-gray-900',
                                          'cursor-default select-none relative py-2 pl-8 pr-4'
                                        )
                                      }
                                      value={countryCode}
                                    >
                                      {({ countryCodeSelected, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              countryCodeSelected
                                                ? 'font-semibold'
                                                : 'font-normal',
                                              'block truncate'
                                            )}
                                          >
                                            {countryCode.countryCode}
                                          </span>

                                          {countryCodeSelected ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? 'text-white'
                                                  : 'text-mainTheme',
                                                'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                              )}
                                            >
                                              <CheckIcon
                                                className='h-5 w-5'
                                                aria-hidden='true'
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </div>
                          </>
                        )}
                      </Listbox>
                    </div>
                    <div className='w-4/5 ml-1'>
                      <input
                        type='number'
                        id='phone'
                        name='phone'
                        placeholder='Enter phone number'
                        autoComplete='phone'
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value)
                        }}
                        className='flex-1 block w-full focus:ring-mainTheme focus:border-mainTheme min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300'
                      />
                    </div>
                  </div>
                </div>

                <div className='col-span-full'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-700'
                  >
                    Description
                  </label>
                  <div className='mt-1'>
                    <textarea
                      type='text'
                      id='description'
                      name='description'
                      rows={4}
                      required
                      autoComplete='description'
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value)
                      }}
                      className='block w-full border-gray-300 rounded-md shadow-sm focus:ring-mainTheme focus:border-mainTheme sm:text-sm'
                    />
                  </div>
                </div>

                <div className='col-span-12 sm:col-span-6'>
                  <Listbox
                    value={deliverySelected}
                    onChange={setDeliverySelected}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className='block text-sm font-medium text-gray-700'>
                          Are you willing to deliver?
                        </Listbox.Label>
                        <div className='mt-1 relative'>
                          <Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-mainTheme focus:border-mainTheme sm:text-sm'>
                            <span className='block truncate'>
                              {deliverySelected.decision}
                            </span>
                            <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                              <SelectorIcon
                                className='h-5 w-5 text-gray-400'
                                aria-hidden='true'
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                          >
                            <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                              {yesOrNos.map((decision) => (
                                <Listbox.Option
                                  key={decision.id}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? 'text-white bg-mainTheme'
                                        : 'text-gray-900',
                                      'cursor-default select-none relative py-2 pl-8 pr-4'
                                    )
                                  }
                                  value={decision}
                                >
                                  {({ deliverySelected, active }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          deliverySelected
                                            ? 'font-semibold'
                                            : 'font-normal',
                                          'block truncate'
                                        )}
                                      >
                                        {decision.decision}
                                      </span>

                                      {deliverySelected ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? 'text-white'
                                              : 'text-mainTheme',
                                            'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                          )}
                                        >
                                          <CheckIcon
                                            className='h-5 w-5'
                                            aria-hidden='true'
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>

                <div className='col-span-12 sm:col-span-6'>
                  <Listbox
                    value={conditionSelected}
                    onChange={setConditionSelected}
                  >
                    {({ open }) => (
                      <>
                        <Listbox.Label className='block text-sm font-medium text-gray-700'>
                          Item condition
                        </Listbox.Label>
                        <div className='mt-1 relative'>
                          <Listbox.Button className='relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-mainTheme focus:border-mainTheme sm:text-sm'>
                            <span className='block truncate'>
                              {conditionSelected.condition}
                            </span>
                            <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                              <SelectorIcon
                                className='h-5 w-5 text-gray-400'
                                aria-hidden='true'
                              />
                            </span>
                          </Listbox.Button>

                          <Transition
                            show={open}
                            as={Fragment}
                            leave='transition ease-in duration-100'
                            leaveFrom='opacity-100'
                            leaveTo='opacity-0'
                          >
                            <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                              {conditions.map((condition) => (
                                <Listbox.Option
                                  key={condition.id}
                                  className={({ active }) =>
                                    classNames(
                                      active
                                        ? 'text-white bg-mainTheme'
                                        : 'text-gray-900',
                                      'cursor-default select-none relative py-2 pl-8 pr-4'
                                    )
                                  }
                                  value={condition}
                                >
                                  {({ conditionSelected, active }) => (
                                    <>
                                      <span
                                        className={classNames(
                                          conditionSelected
                                            ? 'font-semibold'
                                            : 'font-normal',
                                          'block truncate'
                                        )}
                                      >
                                        {condition.condition}
                                      </span>

                                      {conditionSelected ? (
                                        <span
                                          className={classNames(
                                            active
                                              ? 'text-white'
                                              : 'text-mainTheme',
                                            'absolute inset-y-0 left-0 flex items-center pl-1.5'
                                          )}
                                        >
                                          <CheckIcon
                                            className='h-5 w-5'
                                            aria-hidden='true'
                                          />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </Transition>
                        </div>
                      </>
                    )}
                  </Listbox>
                </div>
              </div>

              {/* Mobile order summary */}
              <section
                aria-labelledby='order-heading'
                className=' mt-6 bg-gray-50 px-4 py-6 sm:px-6 lg:hidden'
              >
                <div className='max-w-lg mx-auto'>
                  <>
                    <div className='flex items-center justify-between'>
                      <h2
                        id='order-heading'
                        className='text-lg font-medium text-gray-900'
                      >
                        Images
                      </h2>
                    </div>

                    {images && images.length > 0 && images[0].length > 1 ? (
                      images.map((imageItem) => (
                        <li key={imageItem} className='flex py-6 space-x-6'>
                          <img
                            src={imageItem}
                            alt={'Offer'}
                            className='flex-none w-60 aspect-auto max-h-100 object-center object-cover bg-gray-200 rounded-md'
                          />
                          <div className='flex flex-col justify-between space-y-4'>
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
                      <li key='1' className='flex py-6 space-x-6'>
                        <img
                          src={require('../images/defaultImage.png')}
                          alt={'Default offer image'}
                          className='flex-none w-60 aspect-auto max-h-100 object-center object-cover bg-gray-200 rounded-md'
                        />
                      </li>
                    )}
                    <form className='mt-4'>
                      <input
                        type='file'
                        onChange={uploadFileHandler}
                        multiple
                      />
                    </form>
                    {uploading && <Loader />}
                  </>
                </div>
              </section>

              <button
                type='submit'
                className='w-full mt-6 bg-mainTheme border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-mainThemeTinted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mainTheme'
              >
                Create offer
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  )
}

export default CreateOfferScreen
