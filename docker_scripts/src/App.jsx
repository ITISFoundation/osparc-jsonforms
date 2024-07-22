import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { blue, pink } from '@mui/material/colors';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: blue,
    secondary: pink,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [schema, setSchema] = useState(null);
  const [uischema, setUischema] = useState({});
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch('api/schema');
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
  }, []);

  const onSubmit = async () => {
    try {
      const response = await fetch('api/save', {
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

  if (!schema) return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h4">Loading schema...</Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Configuration
          </Typography>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={materialRenderers}
            cells={materialCells}
            onChange={({ data }) => setData(data)}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" color="primary" onClick={onSubmit} size="large">
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
