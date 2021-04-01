const http = require("http")
const express = require("express")
const app = express()

// http.createServer(function (request, response) {
//
//     response.write("Hi server")
//
//     response.end()
// }).listen(3000, "127.0.0.1", function () {
//     console.log("hi")
// })

// server.listen(3000, () => {
//     console.log('Server was started')
// })

// ROUTES
app.get('/', (req, res) => {
    res.send('We are on home!')
})

// LISTENING
app.listen(3000)