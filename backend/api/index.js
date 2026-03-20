const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const Routes = require("../routes/route.js")

dotenv.config();

const PORT = process.env.PORT || 5000

app.use(express.json({ limit: '10mb' }))
app.use(cors())

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("NOT CONNECTED TO NETWORK", err));

app.use('/api', Routes);



    app.listen(PORT, () => {
        console.log(`Server started at port no. ${PORT}`)
    })


module.exports = app;
