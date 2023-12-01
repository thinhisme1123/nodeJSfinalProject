const Product = require('../models/Product')
const Customer = require('../models/Customer')
const session = require('express-session');
const Account = require('../models/Account');
var userLogin = true

//chứa function handler
class POSControllers {
    
    // [POST] /search POS product
    searchProduct(req,res) {
        const { searchTerm } = req.body;
        console.log(searchTerm)
        Product.find({
            $or: [
              { productName: { $regex: searchTerm, $options: 'i' } },
              { category: { $regex: searchTerm, $options: 'i' } },
              { brand: { $regex: searchTerm, $options: 'i' } },
              // Add more fields as needed
            ]
          }).then(products => {
            console.log(products)
            res.json(products)
          })
       
    }

    // [DELETE] /delete product
    async addPOSProductCart(req,res) {
        const productID = req.params.id
        console.log(productID)
        try {
          // Use Mongoose to find the product by its ID
          const product = await Product.findById(productID);
      
          // Check if the product was found
          if (!product) {
            return res.status(404).json({ error: 'Product not found' });
          }
      
          // Do something with the found product, e.g., add it to the cart
          // For demonstration purposes, let's assume you have a cart array
          const cart = [];
      
          // Add the product to the cart
          cart.push(product);
      
          // Send a success response
          res.json(cart);
        } catch (error) {
          // Handle any errors that occurred during the process
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
    }

     // [DELETE] /delete product
     deletePOSProduct(req,res) {
      const productID = req.params.id
      console.log(productID)
      Product.findById(productID)
        .then(data => {
          if(data) {
            res.json(data)
          }
          else {
            res.status(401).json({message: "No product found!"})
          }
        })
    
    }
    checkPhoneNumber(req,res) {
      const phoneNumber = req.body.phone_number;
      console.log(phoneNumber);
      
      Customer.findOne({ phoneNumber: phoneNumber })
        .then(data => {
          if (data) {
            res.json(data);
          } else {

            res.status(401).json({ message: "No customer found!" });
          }
        })
        .catch(error => {
          // Handle errors
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        });
      
    }
    createCustomer(req,res) {
      const { phoneNumber, address, customerName } = req.body
      console.log('------')
      console.log(phoneNumber);
      console.log(address);
      console.log(customerName);
      console.log('------')
      const newCustomer = new Customer({
        customerName,
        address,
        phoneNumber
      });

      // Save the new product to the database
      newCustomer.save()
          .then((saveCustomer) => {
              console.log("Create customer success")
          })
          .catch((error) => {
              // Handle the error, send an error response to the client
              console.error('Error creating customer:', error);
              res.status(500).json({ error: 'Internal Server Error' });
          });
    }
    createOrder (req,res) {
      res.send("Create order success")
    }
      
}



module.exports = new POSControllers();