// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// const app = express();
// const port = process.env.PORT || 5000;

// app.use(express.json());
// app.use(cors());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtebx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// const userCollection = client.db("UsersDB").collection("users");
// const visaCollection = client.db("VisasDB").collection("visas");
// const visaApplyCollection = client.db("VisasDB").collection("visaApply");

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();
//     // Send a ping to confirm a successful connection
//     // await client.db("admin").command({ ping: 1 });

//     // Users APIs

//     app.get("/users", async (req, res) => {
//       const cursor = userCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     app.post("/users", async (req, res) => {
//       const newUser = req.body;
//       const result = await userCollection.insertOne(newUser);
//       res.send(result);
//     });

//     app.patch("/users", async (req, res) => {
//       const email = req.body.email;
//       const loginData = req.body;
//       const filter = { email };
//       const updatedData = {
//         $set: {
//           creationTime: loginData.creationTime,
//           lastSignInTime: loginData.lastSignInTime,
//         },
//       };
//       const result = await userCollection.updateOne(filter, updatedData);
//       res.send(result);
//     });

//     // Visa's APIs

//     // Get Country visa data added by user using user's email

//     app.get("/visas", async (req, res) => {
//       const { email } = req.query;
//       const result = await visaCollection.find({ email }).toArray();
//       res.json(result);
//     });

//     // Get visa data using ID

//     app.get("/visas/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await visaCollection.findOne(query);
//       res.send(result);
//     });

//     // Get all Visa's Data

//     app.get("/visas", async (req, res) => {
//       const cursor = visaCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     });

//     // Get visa Application From data using user's email

//     app.get("/visaApply", async (req, res) => {
//       const { email } = req.query;
//       const result = await visaApplyCollection.find({ email }).toArray();
//       res.json(result);
//     });

//     // Get visa Application data using ID

//     app.get("/visaApply/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await visaApplyCollection.findOne(query);
//       res.send(result);
//     });

//     app.post("/visas", async (req, res) => {
//       const newVisa = req.body;
//       const result = await visaCollection.insertOne(newVisa);
//       res.send(result);
//     });

//     app.post("/visaApply", async (req, res) => {
//       const newVisaApply = req.body;
//       const result = await visaApplyCollection.insertOne(newVisaApply);
//       res.send(result);
//     });

//     // Update Visa Data using their Id

//     app.patch("/visas/:id", async (req, res) => {
//       const id = req.params.id;
//       const visaData = req.body;
//       const filter = { _id: new ObjectId(id) };
//       const updateVisa = {
//         $set: {
//           method: visaData.method,
//           fee: visaData.fee,
//           name: visaData.name,
//           photo: visaData.photo,
//           visa: visaData.visa,
//           time: visaData.time,
//           validity: visaData.validity,
//         },
//       };
//       const result = await visaCollection.updateOne(filter, updateVisa);
//       res.send(result);
//     });

//     // Delete visa Application using ID(single visa)

//     app.delete("/visaApply/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await visaApplyCollection.deleteOne(query);
//       res.send(result);
//     });

//     // Delete Added visa using ID(single visa)

//     app.delete("/visas/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await visaCollection.deleteOne(query);
//       res.send(result);
//     });

//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// app.listen(port, () => {
//   console.log("Port is running on:", port);
// });

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtebx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const { email, displayName, photoURL } = newUser;

      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ message: "User already exists" });
      }

      const result = await userCollection.insertOne({
        email,
        displayName,
        photoURL,
      });
      res.send(result);
    });

    app.patch("/users", async (req, res) => {
      const { email, lastSignInTime, creationTime } = req.body;
      const filter = { email };
      const existingUser = await userCollection.findOne(filter);

      if (!existingUser) {
        return res.status(404).send({ message: "User not found" });
      }

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

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const result = await userCollection.findOne(query);

      if (!result) {
        return res.status(404).send({ message: "User not found" });
      }

      res.send(result);
    });

    // Visa's APIs
    // ... (keep your existing visa APIs unchanged)

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
