require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtebx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const userCollection = client.db("UsersDB").collection("users");
const visaCollection = client.db("VisasDB").collection("visas");
const visaApplyCollection = client.db("VisasDB").collection("visaApply");

async function run() {
  try {
    // Users APIs

    // Get all user from DB
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Add user in DB

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const { email, displayName, photoURL } = newUser;

      const result = await userCollection.insertOne({
        email,
        displayName,
        photoURL,
      });
      res.send(result);
    });

    // Update user data when login

    app.patch("/users", async (req, res) => {
      const { email, lastSignInTime, creationTime } = req.body;
      const filter = { email };
      const existingUser = await userCollection.findOne(filter);

      const updatedData = {
        $set: {
          lastSignInTime,
          creationTime,
          displayName: existingUser.displayName,
          photoURL: existingUser.photoURL,
        },
      };

      const result = await userCollection.updateOne(filter, updatedData);
      res.send(result);
    });

    // Get users data filtered by email

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await userCollection.findOne(query);

      res.send(result);
    });

    // Visa's APIs

    // Get all visas (without filters)
    app.get("/visas/all", async (req, res) => {
      const result = await visaCollection.find().toArray();
      res.json(result);
    });

    // Get latest 6 visas
    app.get("/visas/latest", async (req, res) => {
      const result = await visaCollection
        .find()
        .sort({ _id: -1 })
        .limit(6)
        .toArray();
      res.json(result);
    });

    // Get visas added by a specific user (using email)
    app.get("/visas", async (req, res) => {
      const { email } = req.query;
      if (!email) {
        return res.status(400).json({ error: "Email is required!" });
      }
      const result = await visaCollection.find({ email }).toArray();
      res.json(result);
    });

    // Get visa details using ID
    app.get("/visas/all/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await visaCollection.findOne(query);

        if (!result) {
          return res.status(404).json({ error: "Visa not found!" });
        }

        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Invalid ID format!" });
      }
    });

    // Get visa Application using user Email

    app.get("/visaApply", async (req, res) => {
      const { email } = req.query;
      const result = await visaApplyCollection.find({ email }).toArray();
      res.json(result);
    });

    // Get visa Application data using ID

    app.get("/visaApply/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaApplyCollection.findOne(query);
      res.send(result);
    });

    // Store visa data in Visas DB

    app.post("/visas", async (req, res) => {
      const newVisa = req.body;
      const result = await visaCollection.insertOne(newVisa);
      res.send(result);
    });

    // Store visa Application data in DB

    app.post("/visaApply", async (req, res) => {
      const newVisaApply = req.body;
      const result = await visaApplyCollection.insertOne(newVisaApply);
      res.send(result);
    });

    // Update Visa Data using their Id

    app.patch("/visas/all/:id", async (req, res) => {
      const id = req.params.id;
      const visaData = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateVisa = {
        $set: {
          method: visaData.method,
          fee: visaData.fee,
          name: visaData.name,
          photo: visaData.photo,
          visa: visaData.visa,
          time: visaData.time,
          validity: visaData.validity,
        },
      };
      const result = await visaCollection.updateOne(filter, updateVisa);
      res.send(result);
    });

    // Delete visa Application using ID(single visa)

    app.delete("/visaApply/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaApplyCollection.deleteOne(query);
      res.send(result);
    });

    // Delete Added visa using ID(single visa)

    app.delete("/visas/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await visaCollection.deleteOne(query);
      res.send(result);
    });

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
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("Port is running on:", port);
});
