
const mongoose = require('mongoose');
const wishlisthelper =require('../helper/wishListhelper')
const { ObjectId } = mongoose.Types
const wishlistdb = require('../model/wishlistdb')

const addtowishlist = async(req,res)=>{
    try{
    console.log(req.body)
    const user = req.body.userid
    const productid = req.body._id
   
    console.log("session in the page is " + req.session.userID)

    let find_wishList = await wishlistdb.findOne({userId: req.session.userID})
    console.log("indded" + find_wishList)
     if(find_wishList){ 
        // FINDING THE PRODUCT EXIST IN THE WISHLIST
        let find_product = await wishlistdb.findOne({userId:req.session.userID,product:new ObjectId(productid )})
        if(!find_product){
            console.log("product is not in the wishlist")

            const userId = user
            const productId = productid

            // wishlist helper
        const wishlist_helper = await wishlisthelper.addtoWish(userId,productId)
        if( wishlist_helper){
            res.send({message:'Added to wishlist'})
            return
        }else{
            res.send({message:'Already Exists'})
        }
        }else{
            res.send({message:'Already Exists'})
            return;
        }
     }else{  
         const newWishlistdb = new wishlistdb({
            userId : user,
            product :[]
         })
         await newWishlistdb.save()

         const userid = req.session.userid
         const productId = productid

        //  wishlist helper
        const new_wish = await wishlisthelper.addtoWish(userid,productId)

        if(new_wish){
            res.send({message:'Added to wishlist'})
        }else{
            res.send({message:'Already exists'})
        }
        return
     }

} catch(error){
   console.log(error.message)
}
}
// REMOVING WISHLIST
const list_removing = async(req,res)=>{
    // console.log("wish list removing")
    try {
       const productid = new ObjectId(req.body.id)
       console.log("productid" + productid)
       const wishid = req.body.wishid
       console.log("wishid " + wishid)
       const wish_del = await wishlisthelper.wishlistdel(wishid,productid)
        if(wish_del){
            res.send({message:"deleted"})
        }else{
            res.send({message:"not deleted"})
        }
    } catch (error) {
        console.log(error.message)
    }
} 

module.exports ={
    addtowishlist,
    list_removing 
}