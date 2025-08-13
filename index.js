const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
// VE4mpmhoXJnl2EJb
const uri =
  "mongodb+srv://adon:VE4mpmhoXJnl2EJb@cluster0.r854q02.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const database = client.db("Cluster0");
    const equipmentCollection = database.collection("equipment");

    app.get("/equipment", async (req, res) => {
      const cursor = equipmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/equipment/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: new ObjectId(id) };
      const result = await equipmentCollection.findOne(cursor);
      res.send(result);
    });

    app.get("/equipment/email/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const cursor = equipmentCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/equipment", async (req, res) => {
      const newEquipment = req.body;
      console.log(newEquipment);
      const result = await equipmentCollection.insertOne(newEquipment);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
