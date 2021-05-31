import { FormProfile } from '~/components/form'
import { Head } from '~/components/head'
import { Heading } from '~/components/heading'
import { PrismaClient } from '@prisma/client'
import { withSession } from '~/lib/session'

const Page = ({ user }) => {
    return (
      <div className="w-full">
        <Head>
          <title>Edit Profile - Links</title>
        </Head>
        <Heading href="/profile/edit">Edit Profile</Heading>
        <FormProfile user={user} />
      </div>
    )
  }

export const getServerSideProps = withSession(async ({ req }) => {
  const { session } = req

  const id = session.get('id')

  if (!id) {
    return {
      redirect: {
        destination: '/start?redirect=/profile/edit',
        permanent: false,
      },
    }
  }

  const prisma = new PrismaClient()
  await prisma.$connect()

  const user = await prisma.user.findFirst({
      where: {
          id,
      }
  }).then(response => JSON.parse(JSON.stringify(response)))

  await prisma.$disconnect()

  return {
      props: {
          user,
      }
  }
})

export default Page
