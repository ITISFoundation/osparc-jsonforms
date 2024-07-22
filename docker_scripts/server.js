const inputs_path = process.env.DY_SIDECAR_PATH_INPUTS;
const outputs_path = process.env.DY_SIDECAR_PATH_OUTPUTS;

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/schema', (req, res) => {
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

app.post('/api/save', (req, res) => {
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = 8888;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
