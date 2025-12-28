const express = require("express");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.6plls.mongodb.net/?retryWrites=true&w=majority`;

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  cachedClient = client;
  cachedDb = client.db("cafe-de-male");
  return cachedDb;
}

/* ================= ROUTES ================= */

// health check
app.get("/api/health", (req, res) => {
  res.send("Server is running");
});

// GET orders
app.get("/api/orders", async (req, res) => {
  const quary = req.query.email;
  const db = await connectDB();
  // console.log(quary);

  if (quary) {
    const result = await db
      .collection("orders")
      .find({ email: quary })
      .toArray();
    // console.log(result);

    res.send(result);
  } else {
    const result = await db.collection("orders").find().toArray();
    res.send(result);
  }
  // console.log(quary);
});
// GET ORDER BY EMAIL
// app.get("/api/orders/", async (req, res) => {
//   const db = await connectDB();
//   const id = req.params.id;
//   const email="resma@gmail.com"
//   const quary={email:email}
//   const result = await db.collection("orders").find(quary).toArray();

//   res.send(result);
// });
// GET users
app.get("/api/users", async (req, res) => {
  const db = await connectDB();
  const result = await db.collection("users").find().toArray();
  res.send(result);
});
// GET users by email
app.get("/api/users/:email", async (req, res) => {
  const db = await connectDB();
  const email = req.params.email;
  const result = await db.collection("users").findOne({ email: email });
  if (!result) {
    return res.status(200).json({}); // ✅ empty JSON
  }

  res.json(result);
});

// POST order
app.post("/api/orders", async (req, res) => {
  const db = await connectDB();
  const result = await db.collection("orders").insertOne(req.body);
  res.send(result);
});

// POST user
app.post("/api/users", async (req, res) => {
  const db = await connectDB();
  const result = await db.collection("users").insertOne(req.body);
  res.send(result);
});

// UPDATE order
app.put("/api/orders/:id", async (req, res) => {
  const db = await connectDB();
  const id = req.params.id;
  console.log(req.body);
  const result = await db
    .collection("orders")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: req.body.status } }
    );

  res.send(result);
});

// UPDATE user role
app.put("/api/users/:id", async (req, res) => {
  const db = await connectDB();
  const id = req.params.id;
  console.log(req.body);

  let updateDocs;
  if (req.body.status === "user" || req.body.status === "admin") {
    updateDocs = {
      $set: { role: req.body.status },
    };
  } else {
    updateDocs = {
      $set: { status: req.body.status },
    };
  }
  const result = await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id) }, updateDocs);

  res.send(result);
});

// DELETE order
app.delete("/api/orders/:id", async (req, res) => {
  const db = await connectDB();
  const id = req.params.id;

  const result = await db.collection("orders").deleteOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});

// DELETE user
app.delete("/api/users/:id", async (req, res) => {
  const db = await connectDB();
  const id = req.params.id;

  const result = await db.collection("users").deleteOne({
    _id: new ObjectId(id),
  });

  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
