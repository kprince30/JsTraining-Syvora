const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');


fetch('http://dummy.restapiexample.com/api/v1/employee/1').then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
     const dir = 'output' ;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    return response.text();
  }).then(body => {
    const timestamp = Date.now();
    const filename = `output/${timestamp}_employee_1.txt`;
    const filedata = body;
    fs.writeFile(filename, filedata, 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
    });
    console.log(body);
  }).catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });