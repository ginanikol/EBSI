const express = require('express');
const app = express();
const { Resolver } = require('did-resolver');
const { getResolver } = require('@cef-ebsi/ebsi-did-resolver');
const { util } = require('@cef-ebsi/ebsi-did-resolver');
const { randomBytes } = require('crypto');


app.use(express.json()); 

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:8081', // Allow requests from spring boot app running on 8081
    methods: ['GET', 'POST'], // Specify the allowed HTTP methods
    optionsSuccessStatus: 204, // Respond with 204 No Content for preflight requests
  }));


// You must set the address of the DID Registry to be used in order to resolve Legal Entities DID documents
const resolverConfig = {
  registry: 'https://api-pilot.ebsi.eu/did-registry/v5/identifiers',
};

// getResolver will return an object with a key/value pair of { "ebsi": resolver } where resolver is a function used by the generic DID resolver.
const ebsiResolver = getResolver(resolverConfig);
const didResolver = new Resolver(ebsiResolver);

// Define a route for resolving DIDs
// app.get('/resolve-did/:did', async (req, res) => {
//   const did = req.params.did;
//   try {
//     const doc = await didResolver.resolve(did);
//     res.json({ document: doc });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while resolving the DID.' });
//   }
// });

// Define a route for generating a new DID
app.get('/generate-did', (req, res) => {
  try {
    // const subjectIdentifierBytes = randomBytes(16); // An array of 16 random bytes
    // console.log(subjectIdentifierBytes);
    const did = util.createDid();
    res.json({ did });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating a new DID.' });
  }
});

// Define a route for creating a DID from a JWK
app.post('/create-did-from-jwk', (req, res) => {
    try {
      console.log(req.body);    
      const jwk = req.body;
      console.log('Received JWK:', jwk); // Add this line for debugging
      const did = util.createDid(jwk);
      res.json({ did });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating a DID from the provided JWK.' });
    }
  });


// Start the Express server
const port = 8000; // Port as specified in your package.json
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
