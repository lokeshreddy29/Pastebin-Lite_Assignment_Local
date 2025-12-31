import 'dotenv/config'
import express from 'express'
import pasteServices from './Services/pasteServices.js'
import client from './redisClient.js'
import cors from 'cors'
import escapeHtml from "escape-html";

const app = express()
const PORT = 3000

//Middleware
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))
//

//Routes
// 1. health check route checks for redis connectivity
app.get('/api/healthz', async (req, res) => {
    let persistenceStatus = false
    let currentID = await client.get("mykey")
    if(client.isOpen) persistenceStatus = true
    res.status(200).json({
        "persistence on": "redis",
        "persistence status": persistenceStatus,
        "currentID": currentID
    })
})

// 2. this route is for creating a new paste
app.post('/api/pastes', async (req, res) => {
    // get the paste info from request body and pass it to the service
    const pasteData = await req.body
    const serviceResponse = await pasteServices.createPaste(pasteData)
    
    if(serviceResponse.status === 200) {
        res.status(serviceResponse.status).json({id: serviceResponse.id, url: serviceResponse.message})
    } else {
        res.status(serviceResponse.status).json({message: serviceResponse.message})
    }
    
    
})

// 3. this route handles the fetching of pastes
app.get('/api/pastes/:id', async (req, res) => {
    const serviceResponse = await pasteServices.getPaste(req)

    if(serviceResponse.status === 200) {
        const response = serviceResponse.redisResponse
        res.status(serviceResponse.status).json({...response, expires_at: response.expires_at 
            ? new Date(response.expires_at).toISOString() : null,})
    } else {
        res.status(serviceResponse.status).json({message: serviceResponse.message})
    }
})


// 4. this route safely renders html using the html-escape library
app.get('/p/:id', async (req, res) => {
    // run it through the getpaste service to decrement max_views
    const result = await pasteServices.getPaste(req)
    if (result.status === 404) {
        return res.status(404).send("Paste not found");
    }


    const safeContent = escapeHtml(result.redisResponse.content);
    res.status(200).send(`
        <!DOCTYPE html>
        <html>
            <head>
                <title>Paste</title>
                <meta charset="utf-8" />
            </head>
            <body>
                <pre>${safeContent}</pre>
            </body>
        </html>
    `);
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})