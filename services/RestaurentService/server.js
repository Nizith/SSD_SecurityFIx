const express = require('express'); 
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config/config');
const connectDB = require('./config/db');

/**
 * Use cors to allow cross-origin requests
 * This is important for allowing the frontend and backend to communicate
 * */
app.use(cors());

/**
 * This middleware is crucial for parsing JSON request bodies
 * It convert the incoming data into the JSON format
 * and makes it accessible in the req.body object.
 */
app.use(bodyParser.json()); 

// Optional: to support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 

const PORT = config.PORT;

app.listen(PORT, () => {    
    console.log(`Server running on ${PORT}`);
});

//Connecting to the database 
connectDB();

//import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

//using routes
app.use('/foodsys/auth', authRoutes);
app.use('/foodsys/users', userRoutes);