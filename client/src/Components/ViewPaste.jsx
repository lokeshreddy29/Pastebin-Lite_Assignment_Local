import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

const ViewPaste = () => {
  const [secondsLeft, setSecondsLeft] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // use query hook
  const {data, refetch, isLoading, isSuccess, isError, error} = useQuery({
    queryKey: ['getpaste', searchQuery],
    queryFn: async () => {
      const getApiResponse = await fetch(searchQuery)

      if(!getApiResponse.ok) {
        const err = await getApiResponse.json()
        throw new Error(err.message)
      }

      const res = await getApiResponse.json()
      return res
    },
    retry: false,
    enabled: !!searchQuery
  })

  // function to handle url form data and get request to fetch paste with url:id
  const handleSubmit = async (event) => {
    event.preventDefault()
    setSearchQuery(event.target[0].value)
    refetch()

    console.log(data)
    setSecondsLeft(Math.floor((new Date(data?.expires_at).getTime() - Date.now()) / 1000))

    console.log(secondsLeft)
  }



  return (
    <div className="w-full h-screen">
      <div className="flex flex-col">
        {/* title */}
        <div className="mb-2 ml-1">
          <h1 className="text-2xl">Enter url here to view paste:</h1>
        </div>
        {/* form div */}
        <div>
          <form onSubmit={(event) => handleSubmit(event)}>
            {/* text area for paste url */}
            <textarea
            onSubmit={(event) => handleSubmit(event)}
              name="content"
              id=""
              className="w-200 min-h-50 p-2 mb-5 bg-bgcontrast outline-0 rounded-md
              transition ease-in-out duration-300 
            ring-customblue hover:ring focus:ring"
              required
            ></textarea>
            {/* Submit button */}
            <div className="flex gap-x-2">
              <button type="submit" className="outline-0 mb-5">
                Display paste
              </button>
              <div className="w-40 h-11 rounded-xl bg-bgcontrast flex justify-center items-center">
                <h1 className="text-md">Expiry: {secondsLeft > 0 ? `${secondsLeft} S` : "Unlimited"}</h1>
              </div>
              <div className="w-50 h-11 rounded-xl bg-bgcontrast flex justify-center items-center">
                <h1 className="text-md">Views left: {data?.remaining_views != null ? data.remaining_views : "Unlimited"}</h1>
              </div>
            </div>
          </form>
        </div>
        {/* // */}
        <div className="w-200 min-h-10 p-2 rounded-md flex gap-x-1 bg-bgcontrast">
          <h1 className="italic">{isError? ("Error:") : ("Paste content:")}</h1>
          <p>{isSuccess? (data.content) : null}</p>
          <p>{isError? (error?.message) : null}</p>
        </div>
      </div>
    </div>
  )
}

export default ViewPaste
