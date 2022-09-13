const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const ObjectId = require("mongodb").ObjectId;

//use middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Running My Node CRUd Server");
});

app.listen(port, () => {
  console.log("CRUD server is running");
});

const uri =
  "mongodb+srv://asif:asif12345@cluster0.h5pr3.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const database = client.db("foodExpress");
    const userCollection = database.collection("user");
    // create a document to insert

    //create
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });

    //Read all user
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.json(users);
    });

    //get a user
    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });
    //Delete a user
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    //update a user
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;

      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);
