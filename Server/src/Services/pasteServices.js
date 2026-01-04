    import client from '../redisClient.js'
    import getNowMs from '../Utils/time.js'

    // service that handles creating a paste
    const createPaste = async (pasteData) => {
        // if content is empty or if ttl/max views are <=0, we return
        if(!pasteData.content) return {status: 400, message: "no paste content found"}
        if(pasteData.ttl_seconds !== undefined && pasteData.ttl_seconds <= 0) return {status: 400, message: "invalid ttl"}
        if(pasteData.max_views !== undefined && pasteData.max_views <= 0) return {status: 400, message: "invalid max views"}

        let redisResponse
        const currentID = await client.incr("mykey")
        const value = {
            content: pasteData.content,
        }

        // if max views is provided we add it
        if(pasteData.max_views) value.remaining_views = pasteData.max_views

        // if expiry is provided we add ttl to paste
        if(pasteData.ttl_seconds) {
            redisResponse = await client.setEx(`${currentID}`, pasteData.ttl_seconds, JSON.stringify(value))
        } else {
            redisResponse = await client.set(`${currentID}`, JSON.stringify(value))
        }

        return {status: 200, "id": currentID, message: `http://localhost:3000/api/pastes/${currentID}`}
    }

    // service that fetches a paste with an id
    const getPaste = async (req) => {
        let redisResponse
        const id = req.params.id
        redisResponse = await client.get(`${id}`)

        // for deterministic testing
        const testNow = getNowMs(req)

        // checking if the paste exists or not. if time to live runs out, redis deletes paste
        if(redisResponse === null) {
            return {status: 404, message: "paste doesn't exist or expired"}
        }

        redisResponse = JSON.parse(redisResponse)

        // check if paste has max_views and decrement it. if it doesn't set it to null
        if(typeof redisResponse.remaining_views === "number") {
            
            // if max views drop below 0 the paste is deleted
            if(redisResponse.remaining_views === 0) {
                await client.getDel(`${id}`)
                return {status: 404, message: "paste doesn't exist or expired"}
            }
            
            // if paste has views left is it decremented and the record is updated on redis with updated view count
            redisResponse.remaining_views = redisResponse.remaining_views - 1
            await client.set(`${id}`, JSON.stringify(redisResponse), {
                KEEPTTL: true
            })
        } else {
            redisResponse.remaining_views = null
        }

        const ttl = await client.ttl(`${id}`)

        // redis ttl edge case
        if(ttl === -2) return {status: 404, message: "paste doesn't exist or expired"}

        // if the paste has ttl we add time to json. ttl returns -1 if there is no expiry
        if(ttl > 0) {
            redisResponse.expires_at = Date.now() + ttl * 1000
            redisResponse.expires_in_secs = ttl
        } else {
            redisResponse.expires_at = null
        }

        // expiry logic to support deterministic testing
        if (redisResponse.expires_at !== null && testNow > redisResponse.expires_at) {
            return {
                status: 404,
                message: "paste doesn't exist or expired",
            }
        }
        
        return {status: 200, redisResponse}
    }


    export default { createPaste, getPaste }