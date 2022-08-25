const express = require('express');
const path = require('path')
const app = express();

const cors = require('cors');

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false

}




const bodyParser = require('body-parser')




app.use(cors(corsOptions))


app.use(bodyParser.json())
//app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(__dirname + '/'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html")
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Working')
})




