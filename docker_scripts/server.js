const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const inputs_path = process.env.DY_SIDECAR_PATH_INPUTS
const outputs_path = process.env.DY_SIDECAR_PATH_OUTPUTS

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/schema', (req, res) => {
  const filePath = path.join(inputs_path, 'input_0', 'schema.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading schema file', err);
      res.status(500).send('Error reading schema');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post('/save', (req, res) => {
  const data = JSON.stringify(req.body, null, 2);
  const filePath = path.join(outputs_path, 'output_0', 'form-data.json');
  
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error('Error writing file', err);
      res.status(500).send('Error saving data');
    } else {
      console.log('Data saved to', filePath);
      res.send('Data saved successfully');
    }
  });
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
