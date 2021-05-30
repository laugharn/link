import { ButtonSubmit } from './button'
import { Callback } from './callback'
import { createContainer } from 'unstated-next'
import { Input } from './input'
import { kebabCase } from 'lodash'
import { object, string } from 'yup'
import { useAuth } from '../containers/auth'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useState } from 'react'

const { Provider: StartFormProvider, useContainer: useStartForm } =
  createContainer(() => {
    const [redirect, setRedirect] = useState()
    const [step, setStep] = useState('email')

    return { redirect, setRedirect, setStep, step }
  })

export const FormCreate = () => {
  const { push } = useRouter()

  const [callback, setCallback] = useState()

  const form = useFormik({
    initialValues: {
      tags: '',
      type: 'link',
      url: '',
    },
    onSubmit: async (values) => {
      setCallback()

      await fetch('/api/v1/posts', {
        body: JSON.stringify({
          ...values,
          tags:
            values.tags.length === 0
              ? []
              : values.tags
                  .split(',')
                  .map((tag) => kebabCase(tag).toLowerCase())
                  .filter((tag) => tag.length > 0),
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
        .then(async (response) => {
          const { post } = await response.json()

          setCallback({
            message: 'Success! Redirecting you to your link...',
            type: 'success',
          })

          push(`/${post.user.name}/links/${post.id}`)
        })
        .catch(() => {
          setCallback({
            message: 'Uh oh, something went wrong!',
            type: 'error',
          })
        })
    },
    validationSchema: object({
      url: string()
        .required('Required')
        .url('Invalid URL')
        .test(
          't-co',
          `Invalid Shortlink, Please Use the Real URL`,
          (value) => !/\/t.co/.test(value)
        )
        .test(
          'links.laugharn.dev',
          `You Can't Link Link`,
          (value) => !/\/link.laugharn.dev/.test(value)
        )
        .test(
          'google-url',
          `Invalid Google Link, Please Use the Real URL`,
          (value) => value && !value.startsWith('https://www.google.com/url')
        ),
    }),
  })

  const disabled = [!form.dirty, form.isSubmitting, !form?.isValid].includes(
    true
  )

  return (
    <div className="w-full">
      {callback && <Callback callback={callback} />}
      <form onSubmit={form.handleSubmit}>
        <div className="p-2">
          <Input
            autoCapitalize="none"
            error={form.errors.url}
            label="URL"
            name="url"
            onBlur={form.handleBlur}
            onChange={form.handleChange}
            placeholder="https://links.laugharn.dev"
            touched={form.touched.url}
            type="url"
            value={form.values.url}
          />
        </div>
        <div className="p-2">
          <Input
            autoCapitalize="none"
            error={form.errors.tags}
            label="Tags"
            name="tags"
            onBlur={form.handleBlur}
            onChange={form.handleChange}
            placeholder="A comma separated list of tags"
            touched={form.touched.tags}
            value={form.values.tags}
          />
        </div>
        <div className="p-2">
          <ButtonSubmit disabled={disabled}>Submit</ButtonSubmit>
        </div>
      </form>
    </div>
  )
}

export const FormStart = () => {
  return (
    <StartFormProvider>
      <FormStartEmail />
      <FormStartCode />
      <FormStartProfile />
    </StartFormProvider>
  )
}

const FormStartCode = () => {
  const { login } = useAuth()
  const { push } = useRouter()
  const { setRedirect, setStep, step } = useStartForm()

  const [callback, setCallback] = useState()

  const form = useFormik({
    initialValues: {
      code: '',
    },
    onSubmit: async (values) => {
      setCallback()

      await fetch(`/api/v1/passes/${values.code}`, {
        method: 'DELETE',
      })
        .then(async (response) => {
          if (!response.ok) {
            throw Error('Not Found')
          }

          const { redirect, user } = await response.json()

          setCallback({
            message: 'Successful login! Redirecting...',
            type: 'success',
          })

          await login(user)

          if (user.name.startsWith('user') || !user.name) {
            setRedirect(redirect)
            setStep('profile')
          } else {
            push(redirect)
          }
        })
        .catch(() => {
          setCallback({
            message: 'Pass not found!',
            type: 'error',
          })
        })
    },
    validationSchema: object({
      code: string().length(6, 'Must Be Six Digits').required('Required'),
    }),
  })

  const disabled = [!form.dirty, form.isSubmitting, !form?.isValid].includes(
    true
  )

  if (step === 'code') {
    return (
      <div className="w-full">
        {callback && <Callback callback={callback} />}
        <div className="leading-6 md:leading-10 p-2 text-gray-700 dark:text-gray-300 text-lg md:text-4xl w-full">
          Enter the six-digit pass code you were emailed to start using Links.
          It's only valid for 15 minutes, so use it quickly! Don't have a pass
          code?{' '}
          <button
            className="text-gray-500 md:hover:text-blue-500"
            onClick={() => {
              setStep('code')
            }}
          >
            Click here
          </button>{' '}
          to get one.
        </div>
        <form onSubmit={form.handleSubmit}>
          <div className="p-2 w-full">
            <Input
              error={form.errors.code}
              label="Pass Code"
              name="code"
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              pattern="[0-9]*"
              placeholder="######"
              touched={form.touched.code}
              value={form.values.code}
            />
          </div>
          <div className="p-2 w-full">
            <ButtonSubmit disabled={disabled}>Submit</ButtonSubmit>
          </div>
        </form>
      </div>
    )
  }

  return null
}

const FormStartEmail = () => {
  const { query } = useRouter()
  const { setStep, step } = useStartForm()

  const [callback, setCallback] = useState()

  const form = useFormik({
    initialValues: {
      email: '',
      redirect: query.redirect,
    },
    onSubmit: async (values) => {
      setCallback()

      await fetch('/api/v1/passes', {
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      setStep('code')
    },
    validationSchema: object({
      email: string().email('Invalid Email Address').required('Required'),
    }),
  })

  const disabled = [!form.dirty, form.isSubmitting, !form?.isValid].includes(
    true
  )

  if (step === 'email') {
    return (
      <div className="w-full">
        {callback && <Callback callback={callback} />}
        <div className="leading-6 md:leading-10 p-2 text-gray-700 dark:text-gray-300 text-lg md:text-4xl w-full">
          Enter your email address below and you'll be sent a six-digit pass
          code that you can use to login or signup.
          {query.redirect && (
            <>
              {' '}
              You'll be redirected to{' '}
              <span className="text-gray-300 dark:text-gray-700">
                {query.redirect}
              </span>{' '}
              after you've entered your pass code.
            </>
          )}{' '}
          Already have a pass code?{' '}
          <button
            className="text-gray-500 md:hover:text-blue-500"
            onClick={() => {
              setStep('code')
            }}
          >
            Click here
          </button>{' '}
          to use it.
        </div>
        <form onSubmit={form.handleSubmit}>
          <div className="p-2 w-full">
            <Input
              autoCapitalize="none"
              error={form.errors.email}
              label="Email"
              name="email"
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              placeholder="hello@email.com"
              touched={form.touched.email}
              type="email"
              value={form.values.email}
            />
          </div>
          <div className="p-2 w-full">
            <ButtonSubmit disabled={disabled}>Submit</ButtonSubmit>
          </div>
        </form>
      </div>
    )
  }

  return null
}

const FormStartProfile = () => {
  const { login } = useAuth()
  const { push } = useRouter()
  const { redirect, step } = useStartForm()

  const [callback, setCallback] = useState()

  const form = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async (values) => {
      setCallback()

      await fetch('/api/v1/user', {
        body: JSON.stringify(values),
        headers: { 'Content-Type': 'application/json' },
        method: 'PATCH',
      })
        .then(async (response) => {
          if (!response.ok) {
            throw Error(response.statusText)
          }

          const { user } = await response.json()

          await login(user)

          push(redirect)
        })
        .catch(() => {
          setCallback({
            message: 'This name is taken or reserved',
            type: 'error',
          })
        })
    },
    validationSchema: object({
      name: string()
        .min(2, 'Too Short')
        .max(16, 'Too Long')
        .required('Required')
        .matches(/^[a-z0-9]*$/, 'Invalid Character'),
    }),
  })

  const disabled = [!form.dirty, form.isSubmitting, !form?.isValid].includes(
    true
  )

  if (step === 'profile') {
    return (
      <div className="w-full">
        {callback && <Callback callback={callback} />}
        <div className="leading-6 md:leading-10 p-2 text-gray-700 dark:text-gray-300 text-lg md:text-4xl w-full">
          You've successfully created a user, now you can add some personal
          information, like a unique name.
        </div>
        <form onSubmit={form.handleSubmit}>
          <div className="p-2 w-full">
            <Input
              autoCapitalize="none"
              autoCorrect="off"
              error={form.errors.name}
              label="Name"
              name="name"
              onBlur={form.handleBlur}
              onChange={form.handleChange}
              placeholder="2-16 characters, lowercase or numbers"
              touched={form.touched.name}
              value={form.values.name}
            />
          </div>
          <div className="p-2 w-full">
            <ButtonSubmit disabled={disabled}>Submit</ButtonSubmit>
          </div>
        </form>
      </div>
    )
  }

  return null
}
