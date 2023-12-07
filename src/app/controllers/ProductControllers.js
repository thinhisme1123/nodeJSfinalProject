
// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Account = require('../models/Account')
const Product = require('../models/Product')
const session = require('express-session')
var userLogin = true

// Function to show a success toast message
function showSuccessToast(message) {
    Toastify({
        text: message,
        duration: 3000, // 3 seconds
        close: true,
        gravity: 'top', // 'top' or 'bottom'
        position: 'center', // 'left', 'center', or 'right'
        backgroundColor: 'green',
    }).showToast();
}
//chứa function handler
class ProductControllers {

    // [GET] /product
    index(req, res) {
        const isActive = true;
        console.log(req.session.user)
        Product.find().lean()
            .then(product => {
                    res.render('product', {userLogin, title: "Product Page",product:product})
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        
    }


     // [POST] /search product
    searchProduct(req, res) {
        const {searchTerm} = req.body;
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

    // [GET] /create product
    showCreateProduct(req,res) {
        res.render('create-product',{userLogin, title: "Create Product Page"})
    }
    // [POST] /create product
    createProduct(req,res) {
        const { productName, category, brand,importPrice,  price,description, quantity, createdBy, image } = req.body;
        console.log(productName)
        const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;

        const newProduct = new Product({
            productName,
            category,
            brand,
            importPrice,
            price,
            description,
            quantity,
            createdBy,
            image: imageUrl,
        });

        // Save the new product to the database
        newProduct.save()
            .then((savedProduct) => {
                // showSuccessToast('Product created successfully');
                console.log("Upload success")
                res.redirect("/product")
            })
            .catch((error) => {
                // Handle the error, send an error response to the client
                console.error('Error creating product:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }

    // [DELETE] /delete product
    async deleteProduct(req,res) {
        const productID = req.params.id
        console.log(productID)
        try {
            const result = await Product.deleteOne({ _id: productID});
            console.log(`Deleted ${result.deletedCount} document`);       
            res.json({message: "OK"})
          } catch(error) {
            // Close the connection when you're done
            res.send(error)
          }
    }

    // [GET] /edit product
    async showEditProduct(req,res) {
        const productID = req.params.id
        Product.findById(productID)
        .lean()
        .then(product => {
            if (!product) {
                // Product not found
                return res.status(404).json({ error: 'Product not found' });
            }
                res.render('edit-product',{userLogin, title: "Edit Product Page" ,product})
            })
            .catch(error => {
                console.error('Error fetching product by ID:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }

    // [POST] /edit product
    editProduct(req, res) {
        const productID = req.params.id;
        const uploadedImage = req.file;
        const image = req.file ? `/uploads/products/${uploadedImage.filename}` : null;
        //dùng toán tử rest để lưu trữ giá trị cũ và giá trị mới
        const updateFields = { ...req.body, image };


        Product.findOneAndUpdate(
          { _id: productID },
          { $set: updateFields },
          { new: true, lean: true } // This will return the updated document
        )
          .then(updatedProduct => {
            if (!updatedProduct) {
              return res.status(404).json({ error: 'Product not found' });
            }
            // Successfully updated, send the updated product in the response
            res.redirect('/product')
          })
          .catch(error => {
            console.error('Error updating product:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          });
    }
      
}



module.exports = new ProductControllers();
