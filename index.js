const express = require("express")
const app = express()
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require("cors")

app.use(cors())

dotenv.config()
//import Routes
const authRoute = require('./routes/auth');

const postRoute = require('./routes/posts')





//connect to DB

const dbURL = "mongodb://127.0.0.1:27017/tblog-Authdb";
mongoose.connect(dbURL).then((result) => {

  app.listen(3000)
  console.log("connected to db");

})
.catch((err) => {
  console.log(err);
})




//middleware
app.use(express.json());



//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);



app.listen(8080, () => console.log('server is up and runing'))