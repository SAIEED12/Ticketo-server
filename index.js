const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require('express');
const dotenv = require("dotenv")
dotenv.config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require("cors")
const app = express();
const port = process.env.PORT;
app.use(cors())
app.use(express.json())

const uri = process.env.MONGODB_URI
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
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db("ticketoDb")
    const organizationCollection = db.collection("organiztions")
    const eventCollection = db.collection("events")
    const bookingCollection = db.collection("bookings")
    const paymentCollection = db.collection("payments")


    app.post("/app/organizations", async(req, res) =>{
      const {organizationName, logo, website, description, organizerEmail} = req.body
      const addData = {organizationName, logo, website, description, organizerEmail, createdAt: new Date(), status: 'active'}
      const result = await organizationCollection.insertOne(addData)
      return result

    })
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});