require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors({origin: '*'}))

async function start() {
    try {
        await sequelize.authenticate()
        await sequelize.sync()

        app.listen(PORT, () => {
            console.log(`Server started to http://localhost:${PORT}`)
        })
    } catch(error) {
        console.log('Server errors'); 
    }
}
start()
