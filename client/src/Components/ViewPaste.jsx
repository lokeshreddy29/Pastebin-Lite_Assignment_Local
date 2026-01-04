import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

const ViewPaste = () => {
  const [secondsLeft, setSecondsLeft] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [content, setContent] = useState(null)

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
    refetchOnWindowFocus: false,
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

    useEffect(() => {
    if (isLoading) return

    // set the data and set ttl to null if it doesn't exist
    setContent(data?.content)
    if (!data?.expires_at) {
      setSecondsLeft(null)
      return
    }

    // set ttl if it exists and update it every second using timer
    setSecondsLeft(data?.expires_in_secs)

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // we refetch one last time after the ttl runs out to display the paste expired error message
          refetch()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // clear the interval in the cleanup function
    return () => clearInterval(timer)
  }, [isLoading, data?.expires_in_secs])



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
              className="min-h-50 p-2 mb-5 bg-bgcontrast outline-0 rounded-md
              transition ease-in-out duration-300 
            ring-customblue hover:ring focus:ring
              w-75 md:w-85 lg:w-110 2xl:w-200"
              required
            ></textarea>
            {/* Submit button and ttl, views details */}
            <div className="flex gap-x-2 flex-wrap space-y-5 lg:space-y-0 w-75 md:w-85 lg:w-110 2xl:w-200">
              <button type="submit" className="outline-0 mb-5">
                Display paste
              </button>
              <div className="w-40 h-11 rounded-xl bg-bgcontrast flex justify-center items-center">
                <h1 className="text-md">
                  Expiry:{" "}
                  {secondsLeft === null
                    ? "Unlimited"
                    : secondsLeft > 0
                    ? `${secondsLeft} S`
                    : "Expired"}
                </h1>
              </div>
              <div className="w-50 h-11 rounded-xl bg-bgcontrast flex justify-center items-center">
                <h1 className="text-md">
                  Views left:{" "}
                  {data?.remaining_views != null
                    ? data.remaining_views
                    : "Unlimited"}
                </h1>
              </div>
            </div>
          </form>
        </div>
        {/* // */}
        <div className="min-h-10 p-2 rounded-md flex gap-x-1 bg-bgcontrast w-75 md:w-85 lg:w-110 2xl:w-200
        mt-10 2xl:mt-0">
          <h1 className="italic">{isError ? "Error:" : "Paste content:"}</h1>
          <p>{isSuccess ? content : null}</p>
          <p>{isError ? error?.message : null}</p>
        </div>
      </div>
    </div>
  )
}

export default ViewPaste
