// app.js or server.js

require('dotenv').config();
const express = require('express');
const {Pool} = require("pg");
const { connectionString } = require('pg/lib/defaults');
const app = express();
const port = process.env.PORT || 3000;
const DATABASE_URL = "postgresql://User_managment_owner:aWCYoZ31sJcz@ep-bold-bush-a1g6gn82.ap-southeast-1.aws.neon.tech/User_managment?sslmode=require"


//database connectivity

const pool = new Pool({
    connectionString:DATABASE_URL
})

pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack);
    }
    client.query('SELECT NOW()', (err, result) => {
      release();
      if (err) {
        return console.error('Error executing query', err.stack);
      }
      console.log('PostgreSQL connected:', result.rows);
    });
  })
// Hardcoded credentials for authentication (replace with your own)
const hardcodedUser = {
  email: 'test@example.com',
  password: 'password' // Plain text password (not recommended for production)
};

app.use(express.json());

// Route to handle user authentication
app.post('/api/authenticate', (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the provided email and password match the hardcoded credentials
    if (email !== hardcodedUser.email || password !== hardcodedUser.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Authentication successful
    res.status(200).json({ message: 'Authentication successful' });

  } catch (err) {
    console.error('Authentication Error:', err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/House_hold', (req,res)=>{
    const { house_members} = req.body;
    if(!house_members){
        return res.status(401).json({error:"invalid entry"})
    }
    try{
        const insertQurey = `INSERT INTO house_hold( house_members) VALUES ($1) RETURNING *`;
        const values = [house_members];
         const result =  pool.query(insertQurey, values);
         res.status(201).json(result); 
    }catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      }

    
})
app.post('/api/Device_data', (req,res)=>{
    const {house_id, device_id} = req.body;
    if(!house_id || !device_id){
        return res.status(401).json({error:"invalid entry"})

    }
    try{
        const insertQuery = `INSERT INTO Device(Device_id, house_id) VALUES($1,$2) RETURNING *`
        const values = [device_id, house_id];
        const results = pool.query(insertQuery, values);
        res.status(201).json(results)
    }catch (err) {
        console.error('Error inserting data:', err);
        res.status(500).json({ error: 'Internal Server Error ' });
      }
})

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});


