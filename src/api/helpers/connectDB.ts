import mongoose from 'mongoose';
import config   from 'config';

/**
 * Script to connect to mongodb database instance
 */

//DB connection url
const dbUrl = `mongodb://${config.get('dbUsername')}:${config.get('dbPass')}@mongo/${config.get('dbName')}?authSource=admin`;


//Connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        console.log('Database connected...');
    } catch (error: any) {

        //Recursively attempt to connect if connection error
        console.log(error.message);
        setTimeout(connectDB, 5000)
    }
};

export default connectDB;