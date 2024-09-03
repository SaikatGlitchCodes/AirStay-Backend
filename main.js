// To create a server using Node js : Express js
const express = require('express');
const {con} = require('./database');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 2000 || process.env.PORT ;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.get('/', async (req, res) => {
    try {
        const results = await new Promise((resolve, reject) => {
            con.query('SELECT * FROM hotel', (error, results, fields) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        console.log(results);
        res.json(results);  // Send the results as JSON response
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });  // Handle errors
    }
});

app.post('/create-hotel', async (req, res) => {
    const { 
        name, 
        address, 
        city, 
        state, 
        country, 
        postal_code, 
        phone_number, 
        email, 
        website, 
        description, 
        rating, 
        total_rooms, 
        image_url 
    } = req.body;

    try {
        console.log(req.body);

        const results = await new Promise((resolve, reject) => {
            const query = `INSERT INTO hotel (name, address, city, state, country, postal_code, 
                phone_number, email, website, description, rating, total_rooms, image_url) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                name, 
                address, 
                city, 
                state, 
                country, 
                postal_code, 
                phone_number, 
                email, 
                website, 
                description, 
                rating, 
                total_rooms, 
                image_url
            ];

            con.query(query, values, (error, results, fields) => {
                if (error) return reject(error);
                resolve(results);
            });
        });

        res.json({ message: 'Hotel created successfully' });
    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/about',(req,res)=>{
    res.json({
        message: 'About my AirStay API',
        description: 'This API provides information about various AirStay hotels in the city.'
    })
})

app.listen(port,()=>{
    console.log(`Connected to Port : ${port}`)
});