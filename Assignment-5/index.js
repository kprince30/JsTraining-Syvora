const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const usersFilePath = path.join(__dirname, 'users.json');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Read existing users (if any)
  let users = [];
  if (fs.existsSync(usersFilePath)) {
    const usersData = fs.readFileSync(usersFilePath);
    users = JSON.parse(usersData);
  }

  // Check if the username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    res.send('Username already exists!');
  } else {
    users.push({ username, password });

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    res.send('Signup successful!');
  }
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (fs.existsSync(usersFilePath)) {
      const usersData = fs.readFileSync(usersFilePath);
      const users = JSON.parse(usersData);
  
      const user = users.find(user => user.username === username && user.password === password);
      if (user) {
        res.send(`Welcome, ${username}!`);

      } else {
        res.send('Invalid username or password.');
      }
    } else {
      res.send('No users found.');
    }
  });
  

app.get('/users', (req, res) => {
  if (fs.existsSync(usersFilePath)) {
    const usersData = fs.readFileSync(usersFilePath);
    const users = JSON.parse(usersData);
    res.send(`
      <html>
        <head>
          <title>User List</title>
          <link rel="stylesheet" href="/styles/style.css">
        </head>
        <body>
          <h1>User List</h1>
          <table>
            <tr>
              <th>Username</th>
              <th>Password</th>
            </tr>
            ${users.map(user => `
              <tr>
                <td>${user.username}</td>
                <td>${user.password}</td>
              </tr>
            `).join('')}
          </table>
        </body>
      </html>
    `);
  } else {
    res.send('No users found.');
  }
});


const clearUserData = () => {
    fs.writeFileSync(usersFilePath, '[]');
};

process.on('exit', clearUserData);
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  clearUserData();
  process.exit(0);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

