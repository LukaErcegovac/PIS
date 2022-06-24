import express, { json } from "express";
import cors from "cors";
import mongo, { ObjectId } from "mongodb";
import connect from "./db.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

//Posts
app.get("/posts", async (req, res) => {
  let db = await connect();

  let cursor = await db.collection("Posts").find();
  let results = await cursor.toArray();

  res.send(results);
});

app.get("/posts/:id", async (req, res) => {
  let id = req.params.id;
  let db = await connect();

  let results = await db
    .collection("Posts")
    .findOne({ _id: mongo.ObjectId(id) });

  res.json(results);
});

app.post("/posts", async (req, res) => {
  let data = req.body;

  let time = new Date().getTime();
  data.postedAt = new Date(time).toISOString().substring(0, 10);

  delete data._id;

  if (!data.naslov || !data.opis || !data.materijali || !data.alati) {
    res.json({
      status: "Faild",
      reason: "Incomplete post",
    });
    return;
  }

  let db = await connect();
  let result = await db.collection("Posts").insertOne(data);

  if (result && result.modifiedCount != 1) {
    res.json(result);
  } else {
    res.json({ status: "Faild" });
  }
});

app.patch("/posts/:id", async (req, res) => {
  let data = req.body;
  let id = req.params.id;

  delete data._id;

  let db = await connect();

  let result = await db
    .collection("Posts")
    .updateOne({ _id: mongo.ObjectId(id) }, { $set: data });

  if (result && result.modifiedCount == 1) {
    let doc = await db.collection("Posts").findOne({ _id: mongo.ObjectId(id) });
    res.json(doc);
  } else {
    res.json({ status: "Faild" });
  }
});

app.delete("/posts/:id", async (req, res) => {
  let data = req.body;
  let id = req.params.id;

  delete data._id;

  let db = await connect();

  let result = await db
    .collection("Posts")
    .deleteOne({ _id: mongo.ObjectId(id) }, { $set: data });

  if (result && result.deletedCount == 1) {
    res.json({ status: "Deleted" });
  } else {
    res.json({ status: "Faild" });
  }
});

//Comments
app.post("/posts/:id/comments", async (req, res) => {
  let data = req.body;
  let id = req.params.id;

  data.postId = mongo.ObjectId(id);

  let time = new Date().getTime();
  data.postedAt = new Date(time).toISOString().substring(0, 10);

  delete data._id;

  if (!data.comment) {
    res.json({
      status: "Faild",
      reason: "Incomplete comment",
    });
    return;
  }

  let db = await connect();

  let result = await db.collection("Comments").insertOne(data);

  console.log(data);

  if (result && result.modifiedCount != 1) {
    res.json(result);
  } else {
    res.json({ status: "Faild" });
  }
});

app.get("/comments/:postId", async (req, res) => {
  let id = req.params.postId;

  let data = mongo.ObjectId(id);

  let db = await connect();

  let cursor = await db.collection("Comments").find({ postId: data });
  let results = await cursor.toArray();

  res.json(results);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
