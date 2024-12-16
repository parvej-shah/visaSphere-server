require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Mongo DB Connections
const uri =
  "mongodb+srv://parvejshahlabib007:bAsNONsEHNcaBbHY@newcluster.n9akf.mongodb.net/?retryWrites=true&w=majority&appName=newCluster";

// Middleware Connections
app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const userCollection = client.db("visaDB").collection("user");
    const addedVisaCollection = client.db("visaDB").collection("addedVisa");
    const visaApplicationCollection = client
      .db("visaDB")
      .collection("visaApplication");
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("new user", user);
      //console.log("Headers:", req.headers);
      //console.log("Body:", req.body);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.post("/visas/addvisa", async (req, res) => {
      const newVisa = req.body;
      //console.log("Headers:", req.headers);
      console.log("Body:", req.body);
      const result = await addedVisaCollection.insertOne(newVisa);
      res.send(result);
    });
    app.get("/visas", async (req, res) => {
      const cursor = addedVisaCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/all-visas", async (req, res) => {
      const cursor = addedVisaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/visas/:email", async (req, res) => {
      const email = req.params.email;
      const query = { addedBy: email };
      const cursor = addedVisaCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/all-visas/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Please find from database", id);
      const query = { _id: new ObjectId(id) };
      const result = await addedVisaCollection.findOne(query);
      console.log(result);
      res.send(result);
    });
    app.post("/applications", async (req, res) => {
      const newVisa = req.body;
      //console.log("Headers:", req.headers);
      console.log("Body:", req.body);
      const result = await visaApplicationCollection.insertOne(newVisa);
      res.send(result);
    });
    app.delete("/visas/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Please delete from database", id);
      const query = { _id: new ObjectId(id) };
      const result = await addedVisaCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/visas/:id", async (req, res) => {
      const id = req.params.id;
      const updatedVisa = req.body;
      console.log("Please update from database", id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      // Specify the update to set a value for the plot field
      const updateDoc = {
        $set: {
          addedBy: updatedVisa.addedBy,
          ageRestriction: updatedVisa.ageRestriction,
          applicationMethod: updatedVisa.applicationMethod,
          countryImage: updatedVisa.countryImage,
          countryName: updatedVisa.countryName,
          description: updatedVisa.description,
          documents: updatedVisa.documents,
          fee: updatedVisa.fee,
          processingTime: updatedVisa.processingTime,
          validity: updatedVisa.validity,
          visaType: updatedVisa.visaType,
        },
      };
      // Update the first document that matches the filter
      const result = await addedVisaCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    /* await client.close(); */
  }
}
run().catch(console.dir);

// Routes

// Connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App running in port: " + PORT);
});
