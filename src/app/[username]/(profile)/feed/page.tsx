import Posts from '@/components/Posts'

function page() {
  return (
    <div className='lg:w-4/5 w-full mx-auto'>
        <Posts feed />
    </div>
  )
}

export default page