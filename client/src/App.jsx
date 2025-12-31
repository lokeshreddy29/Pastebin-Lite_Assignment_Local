
import { useState } from "react"
import CreatePaste from "./Components/CreatePaste"
import ViewPaste from "./Components/ViewPaste"


function App() {
  return (
    <div>
      <div className="my-10 flex justify-center bg-black">
        <h1 className="text-2xl">Pastebin-lite by Lokesh Reddy</h1>
      </div>

      <div className="w-full h-screen flex pl-10">
        <div className="w-1/2">
          <CreatePaste />
        </div>
        <div className="w-1/2">
          <ViewPaste />
        </div>
      </div>
    </div>
  )
}

export default App
