require('dotenv').config();
import express      from 'express';
import config       from 'config';
import connectDB    from './utils/connectDB';

//Create express instance
const app = express();

const port = config.get<number>('port');

//Call listen method
app.listen(port, () => {
    
    console.log(`Server started on port: ${port}`);

    connectDB(); //Connect to MongoDB instance

})