import { useMutation } from "@tanstack/react-query"

const CreatePaste = () => {
  // post call to backend to create paste
  const baseUrl = "http://localhost:3000"
  let queryBody
  const { mutateAsync, data, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      const createApiRes = await fetch(`${baseUrl}/api/pastes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(queryBody),
      })

      if (!createApiRes.ok) {
        const err = await createApiRes.json()
        throw new Error(err.message)
      }

      const res = await createApiRes.json()
      return res
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    let pasteData = {}

    // form data api is used to get values from uncontrolled form
    let formData = new FormData(event.target)
    for (let [key, value] of formData.entries()) {
      pasteData[key] = value
    }

    // the query body will atleast have one key value pair
    queryBody = {
      content: pasteData.content,
    }

    // the ttl and views key value pairs will be added logically
    if (pasteData.ttl_seconds !== "") queryBody.ttl_seconds = pasteData.ttl_seconds
    if (pasteData.max_views !== "") queryBody.max_views = parseInt(pasteData.max_views)

    // console.log(queryBody)
    mutateAsync(queryBody)
  }
  return (
    <div className="w-full h-screen">
      <div className="flex flex-col">
        {/* title */}
        <div className="mb-2 ml-1">
          <h1 className="text-2xl">Enter content here to create paste:</h1>
        </div>
        {/* // */}
        <div>
          <form onSubmit={(event) => handleSubmit(event)}>
            {/* text area for paste content */}
            <textarea
              name="content"
              id=""
              className="min-h-50 p-2 mb-5 bg-bgcontrast outline-0 rounded-md
              transition ease-in-out duration-300 
             ring-customblue hover:ring focus:ring
              w-75 md:w-85 lg:w-110 2xl:w-200"
              required
            ></textarea>

            {/* input fields for ttl and max views */}

            <div id='paste-creation-section'>
              <h1 className="w-75 md:w-85 lg:w-110 2xl:w-200 border-b border-customblue">
                Paste creation options:
              </h1>
              <p className="mt-2 mb-5 text-sm italic">
                (By default these values will be set to infinite)
              </p>

              {/* ttl input */}
              <div className="mb-5 w-85 flex justify-between items-center">
                <div className="w-1/3">
                  <label htmlFor="ttl">Expiry time:</label>
                </div>
                <div className="w-2/3 flex items-center gap-x-2 ml-3">
                  <input
                    name="ttl_seconds"
                    id="ttl"
                    type="number"
                    className="bg-black p-1 w-23 outline-0 rounded-lg 
                  transition ease-in-out duration-300 
                  ring-customblue hover:ring focus:ring"
                    placeholder="unlimited"
                    defaultValue={""}
                  />
                  <p>Seconds</p>
                </div>
              </div>

              {/* max views input */}
              <div className="mb-5 w-85 flex justify-between items-center">
                <div className="w-1/3">
                  <label htmlFor="ttl">Views allowed:</label>
                </div>
                <div className="w-2/3 flex items-center gap-x-2 ml-3">
                  <input
                    name="max_views"
                    id="ttl"
                    type="number"
                    className="bg-black p-1 w-23 outline-0 rounded-lg
                  transition ease-in-out duration-300 
                  ring-customblue hover:ring focus:ring"
                    placeholder="unlimited"
                    defaultValue={""}
                  />
                  <p>Views</p>
                </div>
              </div>

              {/* Submit button */}
              <div>
                <button type="submit" className="outline-0 mb-5">
                  Create paste
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* // */}
        <div className="flex gap-x-2 min-h-10 p-2 rounded-md bg-bgcontrast
        w-75 md:w-85 lg:w-110 2xl:w-200">
          <h1 className="italic">URL:</h1>
          {!isPending ? (<a href={data?.url} className="text-customblue underline 
          transition ease-in-out duration-150 hover:text-blue-600"
          >{data?.url}</a>) : null}
          <p>{isError? (error.message) : null}</p>
        </div>
      </div>
    </div>
  )
}

export default CreatePaste
