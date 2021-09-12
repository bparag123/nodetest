const express = require('express')
const userRouter = require('./urls/user.js')
const myAppRouter = require('./urls/myapp.js')
const errorHandler = require('./errorhandler/errorHandler.js')
const mongoose = require('mongoose')


const app = express()
mongoose.connect("mongodb://localhost:27017/ParagNode", {
    useNewUrlParser: "true",
    useUnifiedTopology: true 
})
mongoose.connection.on("error", (err) => {
  console.log("Database Connection Successfull", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("Database Connection Successfull")
})


const port = 8000

app.use(express.json())
app.use('/userImages', express.static('userImages'))
app.use('/user', userRouter)
app.use('/myapp', myAppRouter)

app.get('/', (req, res)=>{
    res.send("Hello Node Parag")
})

app.use(errorHandler)

app.listen(port, () => {
    console.log("Server is Live Now")
})