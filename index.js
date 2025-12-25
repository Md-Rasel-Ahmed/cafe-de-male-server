const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// cafe-de-male
// BvNDtsJzGQphXdjh

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://cafe-de-male:BvNDtsJzGQphXdjh@cluster0.6plls.mongodb.net/?appName=Cluster0";

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

    const orderCollection = client.db("cafe-de-male").collection("orders");
    const userCollection = client.db("cafe-de-male").collection("users");
    // data getting api here
    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    // data posting api here
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    });
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    // updating data api
    app.put("/orders", async (req, res) => {
      const updateDocs = req.body;
      const filter = { _id: new ObjectId(updateDocs.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updateDocs.status,
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.put("/users", async (req, res) => {
      const updateDocs = req.body;
      const filter = { _id: new ObjectId(updateDocs.id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          role: updateDocs.status,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    // delete
    app.delete("/orders", async (req, res) => {
      const id = req.body.id;
      const quary = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(quary);
      res.send(result);
    });
    app.delete("/users", async (req, res) => {
      const id = req.body.id;
      console.log(id);

      const quary = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(quary);
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
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
