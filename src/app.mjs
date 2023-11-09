// Import required modules
import express from 'express';
import { getResolver } from "@cef-ebsi/key-did-resolver";
import { util } from "@cef-ebsi/key-did-resolver";
import {Resolver} from "did-resolver";
import { randomBytes } from 'crypto';
import cors from 'cors';

// Create an Express app
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 204,
  })
);

// Define a route for generating a new DID
app.get('/generate-did', (req, res) => {
  try {
    const subjectIdentifierBytes = randomBytes(16);
    const did = util.createDid(subjectIdentifierBytes);
    res.json({ did });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while generating a new DID.' });
  }
});

//////////////////////////////////////////////////////////////////////////////////

app.post('/create-did-from-jwk', (req, res) => {
  try {
      const jwk = req.body;
      const did = util.createDid(jwk);
      res.json({ did });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while creating a DID from the provided JWK.' });
  }
});

//////////////////////////////////////////////////////////////////////////////////

// Define a route for resolving a DID
app.get('/resolve-did/:did', (req, res) => {
    try {
        const didToResolve = req.params.did;

        const keyResolver = getResolver();
        const didResolver = new Resolver(keyResolver);

        didResolver
            .resolve(didToResolve)
            .then((doc) => {
                res.json(doc);
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ error: 'An error occurred while resolving the DID.' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while resolving the DID.' });
    }
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
