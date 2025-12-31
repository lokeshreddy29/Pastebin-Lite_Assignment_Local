import { createClient } from "redis"

const client = createClient({
    url: process.env.REDIS_URL
})

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

const key = await client.get('mykey')
if(!key) await client.set('mykey', 0)

export default client