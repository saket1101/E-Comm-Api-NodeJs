require('dotenv').config();

//express
const express = require('express');
const app = express();

// database
const connectDb = require('./db/connectDb');

// for different routers
const notFound = require('./middleware/notFound');

// all routers
const authRouter = require('./routes/authRouters');
const userRouter = require('./routes/userRouters');
const productRouter = require('./routes/productRouters');
const reviewRouter = require('./routes/reviewRouters');
const orderRouter = require('./routes/orderRouters');

// packages
// const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload')
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize')

//middleware
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
// app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(express.static('/.public'))
app.use(fileUpload());

//routes
app.use('/api/',authRouter);
app.use('/api/user/',userRouter);
app.use('/api/product',productRouter);
app.use('/api/review',reviewRouter);
app.use('/api/orders',orderRouter);
app.use(notFound);

const port = process.env.PORT || 4000;

const start =async ()=>{
try{
    await connectDb(process.env.MONGO_URI)
    app.listen(port,()=>{
        console.log(`Server is listening on Port: ${port}`)
    })
}catch(error){
    console.log("Server is not  connected ",error)
}
}
start();