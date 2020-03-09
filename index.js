const helpers = require("./data/db.js");
// we will write our API with Express (barebones lib for building web servers - Sinatra)
// STEP 1, install express
// STEP 2, import express, commonjs syntax instead of native ES modules
const express = require("express");
// STEP 3 instantiate app
const app = express();
// STEP 4 "turn on" the ability of the app to read req.body as json
app.use(express.json());
// STEP 5 decide a port number
const PORT = 3333;
// STEP 7 make  endpoints

//GET all
app.get("/users", async (req, res) => {
  const users = await helpers.find();
  console.log(users);
  res.status(200).json({ users });
});
// GET by Id
app.get("/users/:id", (req, res) => {
  // the id can be found inside req.params.id
  const { id } = req.params;
  helpers
    .findById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({ message: "No user with id " + id });
      } else {
        console.log(user);
        res.status(200).json(user);
      }
      // IMPORTANT COMMENT
      // if we forget to res.json at some point
      // the client will be left hanging
      // until it times out
      // ANOTHER IMPORTANT COMMENT
      // if we res.json twice, that'll be an error
    })
    .catch(error => {
      console.log(error);
    });
});
// POST new thing (insert)
app.post("/users", async (req, res) => {
  const payload = req.body;
  helpers
    .insert(payload)
    .then(user => {
      if (!user) {
        res
          .staus(400)
          .json({ errorMessage: "Please provide name and bio for the user." });
      } else {
             res.status(200).json(payload);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "could not create user"
      });
    });
});
//PUT edit thing (update)
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  helpers.update(id, payload).then((user, id) => {
    if (!user) {
      res
        .status(404)
        .json({ message: "Please provide name and bio for the user." });
    } else if (!id) {
      res.status(400).json({ message: "The user with the specified ID does not exist." });
    } else {
      res.status(200).json({ message: "success" });
    }
  });
});

//Delete thing (update)
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  helpers.remove(id).then(id => {
    if (!id) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist." });
    } else {
      res.status(204).json({ message: "Removed from DB" });
    }
  });
});
// STEP 6 make the express app listen on PORT
app.listen(PORT, () => {
  console.log(`Great! Listening on ${PORT}`);
});
