// const express = require('express');
// const app = express();

// app.use(express.json());

// // Simple route for a welcome message
// app.get('/', (req, res) => {
//   res.json({ message: 'Welcome to your API!' });
// });

// // Route for getting a list of users
// app.get('/users', (req, res) => {
//   res.json([
//     { id: 1, name: 'User 1' },
//     { id: 2, name: 'User 2' },
//     // Add more users as needed
//   ]);
//   console.log([
//     { id: 1, name: 'User 1' },
//     { id: 2, name: 'User 2' },
//     // Add more users as needed
//   ]);
// });

// const port = 4000;

// const server = app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// module.exports = server; // Export the server for testing
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// In-memory array to store users (replace with a database in a real-world application)
const users = [];

// Simple route for a welcome message
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to your API!' });
});

// Route for creating a new user
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  // Simple validation (you may want to add more robust validation)
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
  };

  users.push(newUser);

  // Assuming 201 for successful creation
  res.status(201).json(newUser);
});

const port = 4000;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = server; // Export the server for testing
