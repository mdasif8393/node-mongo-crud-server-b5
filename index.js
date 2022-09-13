const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

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

    //Read
    app.get("/user", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.json(users);
    });
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);
