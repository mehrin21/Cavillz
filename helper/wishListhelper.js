const wishlistdb = require('../model/wishlistdb')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types


async function addtoWish(userId,productId){
      const wishlist = await wishlistdb.findOne({userId:userId})

      console.log("wishlist is " + wishlist);
      const addto_wish = await wishlistdb.findByIdAndUpdate({_id:wishlist._id},
                                                             {$addToSet :{product:new mongoose.Types.ObjectId(productId)}},
                                                             {new:true,upsert:true});
                                                             
                        console.log("addtowishlist is" + addto_wish)
                        return addto_wish;                         
                        }  


// wishlist removing
async function wishlistdel(wishid,productid){
    console.log("here wishlisthelper")
    console.log("productid" + productid)
    const find = await wishlistdb.findOne({_id:wishid,"product.product_id":productid})
    console.log("the product " + find)
    const productdel = await wishlistdb.findOneAndUpdate({_id:wishid,'product.product_id':productid},{$pull:{product:{product_id:productid}}},{new:true}).exec()
}

module.exports = {
    addtoWish,
    wishlistdel
}