"use strict";
const Contact = require('../models/contact');
require('mongoose');

module.exports = app => {
    app.get('/contacts', async (req, res) => {
        //res.json({ message: 'hooray! welcome to our contactRoutes.js api!' });
        try {
            const contacts = await Contact.find();
            res.send(contacts);
        } catch (err) {
          res.send(err);
        }
    });

    app.get('/contact', async (req, res) => {
        //res.json({ message: 'hooray! welcome to our contactRoutes.js api!' });
        try {
            const id = req.query.contactId;
            const contacts = await Contact.findById(id);
            res.send(contacts);
        } catch (err) {
            res.send(err);
        }
    });

  app.put('/contact', async (req, res) => {
      try {
          let id = req.query.contactId;
          const contact = await Contact.findById(id);
          if(req.body.first_name)
              contact.first_name = req.body.first_name;
          if(req.body.last_name)
              contact.last_name = req.body.last_name;
          if(req.body.phone)
              contact.phone = req.body.phone;
          if(req.body.email)
              contact.email = req.body.email;
          await contact.save();
          res.send(contact);
    } catch (err) {
      res.send(err);
    }
  });

  app.post('/contact', async (req, res) => {
      //console.log('request body', req.body);
      try {
          const contact = await new Contact({
              first_name: req.body.first_name,
              last_name: req.body.last_name,
              phone: req.body.phone,
              email: req.body.email
          });
          await contact.save();
          res.send(contact);
      } catch (err) {
          res.send(err);
      }
  });

  app.delete('/contact', async (req, res) => {
      try {
          const id = req.query.contactId;
          const contact = await Contact.findByIdAndRemove(id);
          res.send("Contact removed successfully");
      } catch (err) {
          res.send(err);
      }
  });
};