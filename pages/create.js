import Head from 'next/head'
import { Input } from '~/components/input'
import { kebabCase } from 'lodash'
import { object, string } from 'yup'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'

const Page = () => {
  const { push } = useRouter()

  const form = useFormik({
    initialValues: {
      tags: '',
      type: 'link',
      url: '',
    },
    onSubmit: async (values) => {
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
      }).then(async (response) => {
        const { post } = await response.json()

        push(`/links/${post.id}`)
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
          'link.laugharn.dev',
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
      <Head>
        <title>Create - Link</title>
      </Head>
      <form onSubmit={form.handleSubmit}>
        <div className="p-2">
          <Input
            autoCapitalize="none"
            error={form.errors.url}
            label="URL"
            name="url"
            onBlur={form.handleBlur}
            onChange={form.handleChange}
            placeholder="https://link.laugharn.dev"
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
            className="disabled:cursor-not-allowed leading-6 md:leading-10 disabled:opacity-25 text-lg md:text-4xl text-green-500 md:hover:text-blue-500"
            disabled={disabled}
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  )
}

export default Page
