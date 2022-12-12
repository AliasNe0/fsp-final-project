const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

// cors - allow connection from different domains and ports
app.use(cors())

// convert json string to json object (from request)
app.use(express.json())

const mongoose = require('mongoose')

const mongoDB = 'mongodb+srv://ab0189:password0189@cluster0.xtehant.mongodb.net/final-project'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log("Database test connected")
})

// schema 1
const aboutSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    header: { type: String, required: true },
    text: { type: String, required: true },
    img: { type: String, required: false }
})
// model 1
const About = mongoose.model('About', aboutSchema, 'about-company')

// schema 2
const imageSchema = new mongoose.Schema({
    name: { type: String, required: false },
    link: { type: String, required: true }
})
// model 2
const Image = mongoose.model('Image', imageSchema, 'images')

app.get('/', async (req, res) => {
    res.send('My Website root.')
  });

// about-company collection endpoints
app.get('/about-company', async (request, response) => {
    const abouts = await About.find({})
    response.json(abouts)
})

app.get('/about-company/:id', async (request, response) => {
    const about = await About.findById(request.params.id)
    if (about) response.json(about)
    else response.status(404).end()
})

app.put('/todos', async (request, response) => {
    const { id, header, text, img } = request.body
    const about = new About({
        id: id,
        header: header,
        text: text,
        img: img
    })
    const savedAbout= await about.save()
    response.json(savedAbout)
})

app.put('/todos/:id', async (request, response) => {
    const { id, header, text, img } = request.body
    const editedAbout = await About.findByIdAndUpdate(request.params.id, {
        id: id,
        header: header,
        text: text,
        img: img
    })
    if (editedAbout) response.json(editedAbout)
    else response.status(404).end()
})

app.delete('/todos/:id', async (request, response) => {
    const deletedAbout = await About.findByIdAndRemove(request.params.id)
    if (deletedAbout) response.json(deletedAbout)
    else response.status(404).end()
})

// images collection endpoint
app.get('/images', async (request, response) => {
    const images = await Image.find({})
    response.json(images)
})

app.get('/images/:id', async (request, response) => {
    const image = await Image.findById(request.params.id)
    if (image) response.json(image)
    else response.status(404).end()
})

app.put('/images', async (request, response) => {
    const { name, link } = request.body
    const about = new Image({
        name: name,
        link: link
    })
    const savedImage= await image.save()
    response.json(savedAbout)
})

app.put('/images/:id', async (request, response) => {
    const { name, link } = request.body
    const editedImage = await Image.findByIdAndUpdate(request.params.id, {
        name: name,
        link: link
    })
    if (editedImage) response.json(editedImage)
    else response.status(404).end()
})

app.delete('/images/:id', async (request, response) => {
    const deletedImage = await Image.findByIdAndRemove(request.params.id)
    if (deletedImage) response.json(deletedImage)
    else response.status(404).end()
})

// app listen port 3000
app.listen(port, () => {
    console.log('Example app listening on port 3000')
})

module.exports = app;