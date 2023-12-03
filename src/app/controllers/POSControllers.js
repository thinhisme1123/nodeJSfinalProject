const Product = require('../models/Product')
const Customer = require('../models/Customer')
const session = require('express-session');
const Account = require('../models/Account');
const Order = require('../models/Order');
const OrderDetail = require('../models/OrderDetail');

const fs = require('fs');
const PDFDocument = require('pdfkit');
var userLogin = true

function generateInvoice(invoiceData, filePath) {
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);

  doc.pipe(stream);

  doc.fontSize(18).text('Invoice', { align: 'center' }).moveDown();

  doc
      .fontSize(12)
      .text(`Invoice Number: ${invoiceData.invoiceNumber}`)
      .text(`Date: ${invoiceData.date}`)
      .text(`Customer: ${invoiceData.customerName}`)
      .moveDown();


  doc.fontSize(18).text('List Items', { align: 'center' }).moveDown();
  // Iterate over products and add them to the PDF
  invoiceData.products.forEach(product => {
      doc.text(`${product.productName}: ${product.quantity} x ${product.price}`);
  });

  doc.moveDown().text(`Total Amount: $ ${invoiceData.totalAmount}`);
  doc.text(`Given Money: $ ${invoiceData.givenMoney}`);
  doc.text(`Change: $ ${invoiceData.change}`);

  doc.end();
}

//chứa function handler
class POSControllers {

  // [POST] /search POS product
  searchProduct(req, res) {
    const {
      searchTerm
    } = req.body;
    console.log(searchTerm)
    Product.find({
      $or: [{
          productName: {
            $regex: searchTerm,
            $options: 'i'
          }
        },
        {
          category: {
            $regex: searchTerm,
            $options: 'i'
          }
        },
        {
          brand: {
            $regex: searchTerm,
            $options: 'i'
          }
        },
        // Add more fields as needed
      ]
    }).then(products => {
      console.log(products)
      res.json(products)
    })

  }

  // [DELETE] /delete product
  async addPOSProductCart(req, res) {
    const productID = req.params.id
    console.log(productID)
    try {
      // Use Mongoose to find the product by its ID
      const product = await Product.findById(productID);

      // Check if the product was found
      if (!product) {
        return res.status(404).json({
          error: 'Product not found'
        });
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
      res.status(500).json({
        error: 'Internal Server Error'
      });
    }
  }

  // [DELETE] /delete product
  deletePOSProduct(req, res) {
    const productID = req.params.id
    console.log(productID)
    Product.findById(productID)
      .then(data => {
        if (data) {
          res.json(data)
        } else {
          res.status(401).json({
            message: "No product found!"
          })
        }
      })

  }
  checkPhoneNumber(req, res) {
    const phoneNumber = req.body.phone_number;
    console.log(phoneNumber);

    Customer.findOne({
        phoneNumber: phoneNumber
      })
      .then(data => {
        if (data) {
          res.json(data);
        } else {

          res.status(401).json({
            message: "No customer found!"
          });
        }
      })
      .catch(error => {
        // Handle errors
        console.error(error);
        res.status(500).json({
          message: "Internal server error"
        });
      });

  }

  createCustomer(req, res) {
    const {
      phoneNumber,
      address,
      customerName
    } = req.body
    console.log('------')
    console.log(phoneNumber);
    console.log(address);
    console.log(customerName);
    console.log('------')

    Customer.findOne({
        phoneNumber: phoneNumber
      })
      .then(data => {
        if (!data) {
          const newCustomer = new Customer({
            customerName,
            address,
            phoneNumber
          });

          // Save the new product to the database
          newCustomer.save()
            .then((saveCustomer) => {
              console.log("Create customer success")
              res.send("OK")
            })
            .catch((error) => {
              // Handle the error, send an error response to the client
              console.error('Error creating customer:', error);
              res.status(500).json({
                error: 'Internal Server Error'
              });
            });

          // the customer can not be created
        } else {
          //customer existed here
          console.log("customer existed")
          res.send("OK")
        }
        //move to payment modal

      })
      .catch(error => {
        // Handle errors
        console.error(error);
        res.status(500).json({
          message: "Internal server error"
        });
      });
  }

  async createOrder(req, res) {
      console.log("Create order and invoice");
      const {
          totalAmountValue,
          givenMoneyValue,
          changeValue,
          totalQuantity,
          phoneNumber,
          products
      } = req.body;

      const order = new Order({
          phoneNumber: phoneNumber,
          totalAmount: totalAmountValue,
          givenAmount: givenMoneyValue,
          change: changeValue,
          dateBuy: new Date(),
          amount: totalQuantity
      });

      console.log(products);

      const savedOrder = await order.save();

      const productsArray = products.map(product => ({
          namePro: product.productName,
          amountOrder: product.quantity,
          pricePro: product.price
      }));

      const sharedOrderId = savedOrder._id;
      const orderDetailsArray = [];

      for (const product of productsArray) {
          const orderDetail = new OrderDetail({
              order: sharedOrderId,
              namePro: product.namePro,
              amountOrder: product.amountOrder,
              pricePro: product.pricePro
          });

          orderDetailsArray.push(orderDetail);
      }

      const savedOrderDetails = await OrderDetail.insertMany(orderDetailsArray);

      console.log('OrderDetails saved successfully:', savedOrderDetails);

      const currentDate = new Date();
      const invoiceDate = currentDate.toISOString().split('T')[0];

      // Generate PDF invoice
      const invoiceData = {
          invoiceNumber: savedOrder._id,
          date: invoiceDate,
          customerName: phoneNumber, // Change this with actual customer name
          products: savedOrderDetails.map(detail => ({
              productName: detail.namePro,
              quantity: detail.amountOrder,
              price: detail.pricePro
          })),
          totalAmount: totalAmountValue,
          givenMoney: givenMoneyValue,
          change: changeValue
      };

      const filePath ='src/public/uploads/invoices/' + `invoice_${savedOrder._id}.pdf`;

      generateInvoice(invoiceData, filePath);

      res.json({id: sharedOrderId });
  }
  


  createInvoice(req,res) {
    console.log("Create invoice")
    const {
      totalAmountValue,
      givenMoneyValue,
      changeValue,
      totalQuantity,
      phoneNumber,
      products
    } = req.body

  }

  showInvoice(req, res) {
    console.log("show invoice");
    const orderID = req.params.id;
  
    OrderDetail.find({
      order: orderID
    }).lean()
    .then(orderDetail => {
      if (orderDetail.length > 0) {  // Check if there are any order details
        Order.findOne({
          _id: orderDetail[0].order // Assuming you want to find the order using the first orderDetail's order ID
        }).lean()
        .then(order => {
          if (order) {
            console.log(orderDetail);
            res.render('invoice', { title: 'Invoice', orderDetail: orderDetail, order:order });
          } else {
            res.status(401).json({
              message: "No order found!"
            });
          }
        });
      } else {
        res.status(401).json({
          message: "No orderDetail found!"
        });
      }
    })
    .catch(error => {
      // Handle errors
      console.error(error);
      res.status(500).json({
        message: "Internal server error"
      });
    });
  }
  

}



module.exports = new POSControllers();