const express = require('express')
const cityRouter = require('./routes/city.routes')
const PORT = process.env.PORT || 8080
const app = express()

app.use(express.json())
app.use('/', cityRouter)

app.listen(PORT, () => console.log(`Server start on port ${PORT}`))