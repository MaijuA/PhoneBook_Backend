const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan('tiny'))
app.use(
    morgan(':method :url :body :status :res[content-length] - :response-time ms')
)
app.use(bodyParser.json())
app.use(express.static('build'))

let persons = [
    {
        name: "Arto Hellas",
        phoneNumber: "040-123456",
        id: 1
    },
    {
        name: "Martti Tienari",
        phoneNumber: "040-123456",
        id: 2
    },
    {
        name: "Arto Järvinen",
        phoneNumber: "040-123456",
        id: 3
    },
    {
        name: "Lea Kutvonen",
        phoneNumber: "040-123456",
        id: 4
    }

]

// luodaan http-palvelimen metodilla createServer web-palvelin,
// jolle rekisteröidään tapahtumankäsittelijä,  
// joka suoritetaan jokaisen http-pyynnön yhteydessä
app.get('/', (req, res) => {
    res.send('<h1>Puhelinluettelo</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    let now = new Date();
    res.send('<p>Puhelinluettelossa ' + persons.length + ' henkilön tiedot.</p><p>' + now.toLocaleDateString('en-US') + '</p>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    if (person.name === undefined || person.phoneNumber === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }
    let alreadyExists = persons.find(p => p.name === person.name)
    if (alreadyExists) {
        return response.status(400).json({ error: 'name must be unique' })
    }
    person.id = Math.floor((Math.random() * 100) + 1);
    persons = persons.concat(person);
    response.json(person)
})

// sitoo muuttujaan app sijoitetun http-palvelimen kuuntelemaan
// porttiin 3001 tulevia HTTP-pyyntöjä
const PORT = 3001
app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`);
})

