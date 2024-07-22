import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';

// Dynamically determine the backend URL
const getBackendUrl = () => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const backendPort = 3001; // Assuming your backend always runs on port 3001
  return `${protocol}//${hostname}:${backendPort}`;
};

function App() {
  const [schema, setSchema] = useState(null);
  const [uischema, setUischema] = useState({});
  const [data, setData] = useState({});
  const backendUrl = getBackendUrl();

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch(`${backendUrl}/schema`);
        const schemaData = await response.json();
        setSchema(schemaData);
        setUischema({
          type: 'VerticalLayout',
          elements: Object.keys(schemaData.properties).map(key => ({
            type: 'Control',
            scope: '#/properties/' + key
          }))
        });
      } catch (error) {
        console.error('Error fetching schema:', error);
      }
    };

    fetchSchema();
  }, [backendUrl]);

  const onSubmit = async () => {
    try {
      const response = await fetch(`${backendUrl}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!schema) return <div>Loading schema...</div>;

  return (
    <div className="App">
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={data}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => setData(data)}
      />
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}

export default App;
