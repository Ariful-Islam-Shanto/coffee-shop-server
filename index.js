
const express = require('express');
const cors = require('cors');
//? Env.
require('dotenv').config();
const app = express();
const port = process.env.PORT || 4001.

//? Middleware
app.use(cors());
app.use(express.json());


app.listen(port, () => {
    console.log(`Port ${port} is running fine.`);
})


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

//? Creating environment setup for userName and Password.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster2.edqru7i.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("coffeeShopDB");
    const coffeeCollection = database.collection('coffee');

    app.get('/coffees', async (req, res) => {
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.post('/coffees', async (req, res) => {
        const coffee = req.body;
        console.log(coffee);
        const result = await coffeeCollection.insertOne(coffee);
        res.send(result)
    })

    app.put('/coffees/:id', async (req, res) => {
       const id = req.params.id;
       const filter = { _id : new ObjectId(id)}
       const options = { upsert : true };
       const updatedDetails = req.body;
       const updateCoffee = {
        $set: {
          name: updatedDetails.name,
          supplier: updatedDetails.supplier,
          category: updatedDetails.category,
          chef: updatedDetails.chef,
          taste: updatedDetails.taste,
          details: updatedDetails.details,
          photo: updatedDetails.photo
        },
      };

      const result = coffeeCollection.updateOne(filter, updateCoffee, options);
      res.send(result);
    })

    app.delete('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello from server side port 4001.')
})