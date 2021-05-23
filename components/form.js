import { Input } from '~/components/input'
import { kebabCase } from 'lodash'
import { object, string } from 'yup'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useState } from 'react'

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

          push(`/links/${post.id}`)
        })
        .catch((error) => {
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
      {callback && (
        <div className="p-2">
          <div
            className={`${
              callback.type === 'error'
                ? 'bg-red-300 dark:bg-red-800 text-red-800 dark:text-red-300'
                : 'bg-emerald-300 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-300'
            } leading-6 md:leading-10 p-2 text-lg md:text-4xl w-full`}
          >
            {callback.message}
          </div>
        </div>
      )}
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
          <button
            className="disabled:cursor-not-allowed leading-6 md:leading-10 disabled:opacity-25 text-lg md:text-4xl text-emerald-500 md:hover:text-blue-500"
            disabled={disabled}
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}
