import { createClient } from "redis";

/**
 * Script to connect express app to Redis container
 */
const redisPort     = '6379';                               //Set redis port TODO in .env?
const redisUrl      = `redis://localhost:${redisPort}`;     //Create redis connection url
const redisClient   = createClient({ url: redisUrl });      //Create redis client object

//Function to connect to redis
const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis client connected...');
    } catch (err: any) {
        console.log(err.message);
        setTimeout(connectRedis, 5000)  //Recursively attempt to connect on connection failure
    }
};

//Connect to redis
connectRedis();

//Monitor client for errors
redisClient.on('error', err => console.log(err));

export default redisClient;