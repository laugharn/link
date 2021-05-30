export const Footer = () => {
  return (
      <div className="mt-auto pt-6 w-full">
    <div className="bg-gray-500 leading-6 md:leading-10 p-2 text-gray-700 text-lg md:text-4xl w-full">
      &copy;{new Date().getFullYear()}, things of that nature.
    </div>
    </div>
  )
}