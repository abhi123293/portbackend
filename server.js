const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const Contact = require("./rback/models/contact");
require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);
app.use(cors());
app.use(express.json());
const MONGOURL = process.env.MONGOURL;
console.log("MONGO URL:", MONGOURL);

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
  app.get("/debug-db", async (req, res) => {
    res.json({ 
      host: mongoose.connection.host,
      dbname: mongoose.connection.name,
      contactCollection: 
    Contact.collection.name,
      readyState: mongoose.connection.readyState
    });
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
  console.log("BODY:", req.body);
  try {
    const { name, email, message } = req.body;

    const newContact = new Contact({
      name,
      email,
      message,
    });

    const savedContact = await newContact.save();
    console.log("saved:", savedContact);
    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    chat_id: process.env.CHAT_ID,
    text: `New Portfolio Contact\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
  }),
});

    return res.status(201).json(savedContact);
  } catch (err) {
    console.log("Error saving contact:", err);
    res.status(500).json({ error: "Error saving contact message" });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});