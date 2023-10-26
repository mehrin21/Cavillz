const productdb = require('../model/productdb')
const mongoose = require('mongoose')
const sharp = require('sharp')
const ObjectId = mongoose.Types.ObjectId

const image_crop = async (req, res) => {
    try {

        const image_id = req.query.productid
        console.log("image_id " + image_id)


        const product = await productdb.findOne({ _id: req.query.productid })

        console.log(product.image)
        res.render('imagecrop', { product: product })
    } catch (error) {
        console.log(error.message)
    }
}
// POST 
const post_image = async (req, res) => {
    console.log("post is doing")
    try {
        console.log(req.body)
        const { left, top, right, bottom, width, height } = req.body;
        // const productid = req.query.productid;

        const leftInt = parseInt(left);
        const topInt = parseInt(top);
        const rightInt = parseInt(right);
        const bottomInt = parseInt(bottom);
        const widthInt = parseInt(width);
        const heightInt = parseInt(height);

        await sharp('inputImagePath')
            .extract({ left: leftInt, top: topInt, width: widthInt, height: heightInt })
            .toFile('outputImagePath');

        console.log("Image cropped successfully");
        res.json({ message: 'Image cropped successfully' });
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    image_crop,
    post_image
}