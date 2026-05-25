const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require("./rback/models/contact");

const dns = require("dns");
dns.setServers(["8.8.8.8"]);
app.use(cors());
app.use(express.json());
const MONGO_URL = "mongodb+srv://port:portfolio@cluster2.m0oblli.mongodb.net/?appName=Cluster2";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.get("/contact", async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.json(contacts);
  } catch (err) {
    console.log("Error fetching contacts:", err);
    res.status(500).json({ error: "Error fetching contacts" });
  }
});
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      message,
    });

    const savedContact = await newContact.save();

    res.status(201).json(savedContact);
  } catch (err) {
    console.log("Error saving contact:", err);
    res.status(500).json({ error: "Error saving contact message" });
  }
});
app.listen(5000, () => {
    console.log("server running on port 5000");
});