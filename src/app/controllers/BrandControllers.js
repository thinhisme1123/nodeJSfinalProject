// Đối với phiên bản hiện tại của handlebar thì sẽ không cần viết tool chuyển sang object nữa, 
// cứ truyền thẳng vào
const Brand = require('../models/Brand')
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
class BrandControllers {

    // [GET] /brand list
    index(req, res) {
        Brand.find().lean()
            .then(brand => {
                    res.render('brand', {userLogin, title: "Brand Page",brand:brand})
            })
            .catch((error) => {
                console.error('Error fetching brands:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            });
        
    }

      // [GET] /brand create page
      showCreateBrand(req, res) {
        res.render('create-brand', {userLogin, title: "Brand Page"})       
    }

    // [POST] /brand create 
    CreateBrand(req, res) {
        const { brandName, category, image } = req.body;
        console.log(brandName)
        const imageUrl = req.file ? `/uploads/brands/${req.file.filename}` : null;

        const newBrand = new Brand({
            brandName,
            category,
            image: imageUrl,
        });

        // Save the new product to the database
        newBrand.save()
            .then((savedBrand) => {
                // showSuccessToast('Product created successfully');
                console.log("Upload success")
                res.redirect("/brand")
            })
            .catch((error) => {
                // Handle the error, send an error response to the client
                console.error('Error creating product:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }); 
    }

     // [GET] /brand edit page
     showEditBrand(req, res) {
        const id = req.params.id
        Brand.findOne({
            _id: id
        }).lean().then(brand => {
            res.render('edit-brand', {userLogin, title: "Edit Brand Page", brand})    
        })
        .catch((error) => {
            // Handle the error, send an error response to the client
            console.error('Error find brand:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }); 
          
    }

      // [PUT] /brand edit 
      EditBrand(req, res) {
        const brandID = req.params.id;
        const uploadedImage = req.file;
        const image = req.file ? `/uploads/brands/${uploadedImage.filename}` : null;
        //dùng toán tử rest để lưu trữ giá trị cũ và giá trị mới
        const updateFields = { ...req.body, image };


        Brand.findOneAndUpdate(
          { _id: brandID },
          { $set: updateFields },
          { new: true, lean: true } // This will return the updated document
        )
          .then(updatedBrand => {
            if (!updatedBrand) {
              return res.status(404).json({ error: 'Brand not found' });
            }
            // Successfully updated, send the updated product in the response
            res.redirect('/brand')
          })
          .catch(error => {
            console.error('Error updating brand:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          });
          
    }


     // [DELETE] /delete brand
     async deleteBrand(req,res) {
        const brandID = req.params.id
        console.log(brandID)
        try {
            const result = await Brand.deleteOne({ _id: brandID});
            console.log(`Deleted ${result.deletedCount} document`);       
            res.json({message: "OK"})
          } catch(error) {
            // Close the connection when you're done
            res.send(error)
          }
    }


}



module.exports = new BrandControllers();
