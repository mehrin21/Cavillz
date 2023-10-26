const Admin = require('../model/adminModel')
const productdb = require('../model/productdb')
const categorydb = require('../model/categorydb')
const branddb = require('../model/branddb')
const bannerdb = require('../model/bannerdb')
const coupondb = require('../model/coupondb')
const User = require('../model/userModel')
const orderdb = require('../model/orderdb')
const walletdb = require('../model/walletdb')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId;
// const { copyFileSync } = require('fs')

// 1st rendering signup page
const Login = ((req, res) => {
    console.log('adminside')
    res.render('adminLogin')
})
const dashboard = async (req, res) => {
    try {
       console.log("entering")
       const order_details = await orderdb.find({})
       const productCount = await productdb.countDocuments({})
       const categoriesCount = await categorydb.countDocuments({})
    //  console.log(categoriesCount)

       let revenue = 0
       let orders = 0
       order_details.forEach((products)=>{
        products.product.forEach((order)=>{
            if(order.status == "Delivered"){
               revenue += order.productPrice;
                orders++
                console.log("revenue " + revenue)
            }
        })
       })
      
        res.render('index',{revenue:revenue,ordersCount:orders,productCount: productCount,categoriesCount:categoriesCount})
    } catch (error) {
        console.log(error.message)
    }
}
// Login post
const post_Login = async (req, res) => {
    console.log("Login post")
    try {
        const password = req.body.password
        // console.log(password)
        const validate = await Admin.findOne({ email: req.body.email })
        if (validate) {
            if (validate.password === req.body.password) {
                req.session.adminID = validate.id
                console.log(req.session)
                res.redirect('/admin/index')
            } else {
                // res.render('adminLogin', { message: "password is inncorrect" })

                console.log("wrong password")
            }
        } else {
            res.render('adminLogin', { message: "not vaalide" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
// index page
// const index = ((req, res) => {
//     res.render('index')
// })
// signup page rendring
const signup = ((req, res) => {
    const title = req.flash("title")
    res.render('adminSignup', { title: title[0] || "", })
})

// signup post
const post_sign = async (req, res) => {
    console.log("sign post");
    try {
        const email = req.body.email;
        console.log(email);
        const findAdmin = await Admin.findOne({ email });
        if (findAdmin) {
            console.log("admin already exists");
            req.flash("title", "Admin already registered");
            res.redirect('/admin/login');
        } else {
            const phone = req.body.phone;
            const password = req.body.password;
            const data = new Admin({
                email: email,
                phone: phone,
                password: password
            });
            console.log(data)
            await data.save();
            console.log("admin data is saved");


        }
    } catch (error) {
        console.error(error);
        // res.status(500).json({ success: false, message: "An error occurred during signup" });
    }
};
// PRODUCTLIST
const product = async (req, res) => {
    try {
        const productlist = await productdb.find({})
        // console.log(productlist);
        res.render('productlist', { productlist: productlist })

    } catch (error) {
        console.log(error.message);
    }
}
//GET  -  Add Product Page
const addproduct = async (req, res) => {
    try {
        const catagory = await categorydb.find({})
        const brand = await branddb.find({})
        const coupons = await coupondb.find({})
        const product = await productdb.find({})
        res.render('addproduct', { category: catagory, brand: brand, coupons: coupons, product: product })
    } catch (error) {
        console.log(error.message);
    }
}
// POST -Add product page
const post_addproduct = async (req, res) => {
    console.log("ghsgsjkl")
    const arrimages = []
    if (req.files) {
        for (let i = 0; i < req.files.length; i++) {
            arrimages.push(req.files[i].filename)
        }
    }

    try {

        const product = new productdb({
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            size: req.body.size,
            image: arrimages,
            category: req.body.category,
            category1: req.body.category1,
            color: req.body.color,
            coupon: req.body.coupon
        })
        // console.log(req.body.coupon)
        // console.log(product)
        await product.save()
        const list = await productdb.find({})
        res.render('productlist', { productlist: list })
        console.log("product is saved")
    } catch (error) {
        console.log(error.message)
    }
}
// DETELE PRODUCT
const deleteProduct = async (req, res) => {
    console.log("delete")
    try {
        const deleteid = req.query.id
        console.log(deleteid)
        const result = await productdb.deleteOne({ _id: deleteid })
        // console.log(result)
        const deleteproduct = await productdb.find({})
        res.render('productlist', { productlist: deleteproduct })
        console.log("productdeleted")
    } catch (error) {
        console.log(error.message)
    }
}
//GET- update products
const updata_product = async (req, res) => {
    const title = req.flash("title")
    try {
        const id = req.query.productid
        console.log(id)
        const product = await productdb.findById({ _id: id })
        const category = await categorydb.find({})
        const coupons = await coupondb.find({})
        // console.log(product)

        res.render('updateproduct', {
            product: product,
            category: category,
            coupons: coupons,
            title: title[0]
        })
    } catch (error) {
        console.log(error.message)
    }

}
// POST - update product
const post_update = async (req, res) => {
    console.log('update')
    try {
        const imagearr = [];
        if (req.files) {
            for (let i = 0; i < req.files.length; i++) {
                imagearr.push(req.files[i].filename);
            }
        }

        const productid = req.query.productid;
        console.log("received id " + productid);

        // Assuming your Mongoose model is properly defined and imported as 'productdb'
        const updatedProduct = {
            name: req.body.name,
            brand: req.body.brand,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            size: req.body.size,
            image: imagearr,
            color: req.body.color,
            category: req.body.category,
            coupon: req.body.coupon
            // date: new Date() // Update the 'date' field with the current date
        };

        const save = await productdb.findByIdAndUpdate(productid, { $set: updatedProduct }, { new: true });
        // Using { new: true } to get the updated document as the result of the update operation

        console.log("updated data", save);
        // const productlist = await productdb.find({})
        // res.render('productlist', { productlist: productlist })

        res.redirect('/admin/productlist')
        // req.flash("title","product update successfully")
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "Something went wrong" });
    }
}

// customerlist-page rendering
const customer = async (req, res) => {
    try {
        const title = req.flash("title")
        const user = await User.find({})
        res.render('customerlist', { user: user, title: title[0] })
    } catch (error) {
        console.log(error.message)
    }

}
// update customer-GET
const update_customer = async (req, res) => {
    try {
        const id = req.query.id
        console.log(id)
        const findUser = await User.findById({ _id: id })
        res.render('updatecustomer', { userdata: findUser })
    } catch (error) {
        console.log(error.message)
    }
}
// post- update user
const post_user = async (req, res) => {
    try {
        console.log("user update")
        const id = req.query.id
        console.log(id)
        const email = req.body.email
        const findEmail = await User.findOne({ email: email })
        if (findEmail) {
            req.flash("title", "An error occurred while updating the user.");
            res.redirect('./customerlist')
        } else {

            const update = await User.findByIdAndUpdate({ _id: id },
                {
                    $set: {
                        fullname: req.body.fullname,
                        email: req.body.email,
                        password: req.body.password
                    }
                })
            // console.log(update)
            if (update) {
                const getUpdate = await User.find({})
                res.render('customerlist', { user: getUpdate })
            } else {
                console.log('data is not saved')
            }
        }
    } catch (error) {
        console.log(error.message)
    }
}
// block user
const block = async (req, res) => {
    try {
        console.log('block')
        // const userid = req.body.userid
        // console.log(userid)
        // const isBlocke = req.body.value
        // console.log(isBlock)

        const block = await User.updateOne({ _id: req.body.userid }, { $set: { isBlock: parseInt(req.body.isvalue) } })
        res.status(200).json({ message: "update successfull" })
        // console.log(block)
        console.log("fddftd")


    } catch (error) {
        console.log(error.message)
    }
}
// category-GET
const get_category = async (req, res) => {
    console.log("get category")
    try {
        const categorydata = await categorydb.find({})
        res.render('category', { categorydata: categorydata })
    } catch (error) {
        console.log(error.message)
    }
}
// category - post
const post_category = async (req, res) => {
    console.log("post category")
    try {
        const name = req.body.name
        console.log(name)
        const new_category = new categorydb({
            name: req.body.name,
            description: req.body.description
        })
        const save = await new_category.save()
        console.log(save)
        console.log("saved")
        const saved = await categorydb.find({})
        res.render('category', { categorydata: saved })
    } catch (error) {
        console.log(error.message)
    }
}
// category edit
// Get
const get_categortyEdit = async (req, res) => {
    try {
        const id = req.query.categoryid
        console.log(id)
        const category = await categorydb.findById({ _id: id })
        res.render('categoryUpdate', { category: category })
    } catch (error) {
        console.log(error.message)
    }
}
// POST
const edit_category = async (req, res) => {
    try {
        const id = req.query.categoryid
        console.log(id)
        const updateCategory = await categorydb.findByIdAndUpdate({ _id: id },
            {
                $set: {
                    name: req.body.name,
                    description: req.body.description,

                }
            })
        console.log(updateCategory)
        const edited = await categorydb.find()
        res.render('category', { categorydata: edited })
    } catch (error) {
        console.log(error.message)
    }
}
// delete category
const delete_category = async (req, res) => {
    try {
        const id = req.query.id
        console.log(id)
        const del = await categorydb.findByIdAndDelete({ _id: id })
        if (del) {
            const rendering = await categorydb.find()
            res.render('category', { categorydata: rendering })
        }
    } catch (error) {
        console.log(error.message)
    }
}
// BRAND
//get
const brand = async (req, res) => {
    const title = req.flash("title")

    console.log("brand")
    try {
        const brand_data = await branddb.find({})
        console.log("brands " + brand_data)
        res.render('brand', { title: title[0], brand: brand_data })
    } catch (error) {
        console.log(error.message)
    }
}
// post 
const post_brand = async (req, res) => {
    try {
        const addbrand = req.body.addbrand;
        const color = req.body.color
        const find_brand = await branddb.findOne({ brand: req.body.addbrand })
        console.log(find_brand)
        if (find_brand) {
            req.flash("title", "brand already entered")
            //    console.log("brand is already exist")
        } else {
            const brand = new branddb({
                brand: addbrand,
                color: color
            })
            const brand_save = await brand.save()
            console.log("brand is saved")
            //   res.redirect('/addproduct')
        }

    } catch (error) {
        console.log(error.message)
    }
}

// BANNER MANAGEMENT-get
const banner_manage = async (req, res) => {
    try {
        let bannerlist = await bannerdb.find({})
        console.log(bannerlist);
        res.render('bannerManagement', { bannerlist: bannerlist })
    } catch (error) {
        console.log(error.message);
    }
}
//  BANNER MANAGEMENT- POST

// BANNER DELET 
const banner_delete = async (req, res) => {
    console.log("deleted")
    try {
        const banner_id = req.body.id
        console.log(banner_id)
        const find_banner = await bannerdb.deleteOne({ _id: banner_id })
        console.log("find_banner " + find_banner)
    } catch (error) {
        console.log(error.message)
    }
}
// CREATING BANNER - GET
const creating_banner = async (req, res) => {
    try {
        res.render('addbanner')
    } catch (error) {
        console.log(error.message)
    }
}
// POST-CREATING BANNER
const post_addbanner = async (req, res) => {

    console.log(req.file)
    try {
        const banner = new bannerdb({
            image: req.file.filename,
            description: req.body.description
        })
        await banner.save()
        res.redirect('/admin/bannerManagement')
    } catch (error) {
        console.log(error.message)
    }
}
// COUPON
const get_counpon = async (req, res) => {
    try {
        const couponlist = await coupondb.find({})
        res.render('coupon', { couponlist: couponlist })
    } catch (error) {
        console.log(error.message)
    }
}
// ADDCOUPON 
const get_addcoupon = async (req, res) => {
    try {
        res.render('addcoupon')
    } catch (error) {
        console.log(error.message)
    }
}
// POST-ADDCOUPON 

const post_addcoupon = async (req, res) => {
    try {
        console.log(req.body.title)
        const name = req.body.title
        const description = req.body.description
        const discount = req.body.discount
        const expiry = req.body.expiry
        const minimum = req.body.minimum
        console.log("exipry " +  expiry)
        console.log("minimum " + minimum)

        const newCoupon = new coupondb({
            name: name,
            description: description,
            discount: discount,
            minimum: minimum,
            expiry: expiry
        })

        const couponSave = newCoupon.save().then(() => { console.log("coupon is saved") })
            .catch((error) => { console.log(error.message) })

        if (couponSave) {
            res.redirect('/admin/coupons')
        }
    } catch (error) {
        console.log(error.message)
    }
}
// DELETE-COUPON
const delete_coupon = async (req, res) => {
    try {
        console.log(req.body.id)
        const deleteId = await coupondb.findByIdAndDelete({ _id: req.body.id })
        console.log(deleteId)
    } catch (error) {
        console.log(error.message)
    }
}
// ORDER - LIST USERS ORDER
const user_order = async (req, res) => {
    try {
        const orders = await orderdb.find({}).populate('userId').exec()
        // console.log("orders " + orders)
        res.render('order', { orders: orders })
    } catch (error) {
        console.log(error.message)
    }
}

// ORDER - DETAILS OF EACH USER
const user_orderdetails = async (req, res) => {
    try {
        const orderid = req.query.id
        const orderDetail = await orderdb.findById({ _id: orderid })
            .populate("product.productId")
            .populate("address")
            .populate("userId")
            // .populate('orderdetail')
            .exec();
        // console.log("orderDetail " + orderDetail)
        res.render('orderdetails', { orderDetail: orderDetail })
    } catch (error) {
        console.log(error.message)
    }
}
// STATU UPDATE
const update_status = async (req, res) => {
    try {
        console.log("satta");
        console.log(req.body);
        const { productId, orderId, status } = req.body;
        // console.log("status " + status);

        const find_Order = await orderdb.findOne({ _id: orderId });

        if (find_Order) {
            const product = find_Order.product.find((p) => p._id.toString() === productId);
            if (product) {
                product.status = status;
                await find_Order.save();

                if (product.status === "Delivered" && find_Order.paymentMethod === "COD") {
                    await orderdb.findByIdAndUpdate(
                        { _id: orderId },
                        { $set: { paymentStatus: "paid" }}
                    );

                    console.log("paymentStatus updated to 'paid'");
                } else {
                    // Handle other cases if needed.
                }

                if (product.status === "Delivered") {
                    const deliveredDate = new Date();
                    await orderdb.findByIdAndUpdate(
                        orderId,
                        { deliveredDate: deliveredDate },
                        { new: true }
                    );

                    console.log("Delivered date updated");
                }

                res.send({ success: "true" });
            } else {
                res.send({ success: "false" });
            }
        } else {
            res.send({ success: "false" });
        }
    } catch (error) {
        console.log(error.message);
        res.send({ success: "false" });
    }
}

// LOGOUT
const admin_logout = (req, res) => {
    try {
        req.session.destroy();
        res.redirect('./login')
    } catch (error) {
        console.log(error.message)
    }
}
// return request appoverment
const return_request = async(req,res)=>{
    try {
     const orderid = req.body.id
     const productid = req.body.proid
     console.log("prod")
     const userId = req.session.userID

     let order = await orderdb.findById(orderid);
    //  console.log("order " +order)
     const products = order.product.find((p)=> p._id.toString() === productid);
    //  console.log("products " + products)
     const price = products.productPrice

    //  finding user wallet 
    const userWallet = await walletdb.findOne({userid:order.userId})
    console.log(userWallet)
    if(userWallet){
        await walletdb.findByIdAndUpdate(
            userWallet._id,
            {$inc :{ balance : price},
            $push:{
                orderDetails:{
                    orderid:orderid,
                    amount:price,
                    type:"Added"
                },
            },
        },{new:true}
        )
    }else{
        let wallet = new walletdb({
            userid:order.userId,
            balance :price,
            orderDetails:[
                {
                    orderid:orderid,
                    amount:price,
                    type:"Added"
                },
            ],
        })
        await wallet.save()
    }
    for(const product of order.product){
        await productdb.findByIdAndUpdate(product.productId,
            {
                $inc :{ quantity:product.quantity}
            },
            {new:true})
        }
        order = await orderdb.findByIdAndUpdate(
            orderid,
            {paymentStatus :"refund"},
            {new:true}
        )
        const product = order.product.find((p)=>p._id.toString() ===productid)
        if(product){
            product.status = "Returned"
        }
        await order.save()
        if(order){
            res.send({message :"1"})
        }else{
            res.send({message :"0"})
        }
    } catch (error) {
        console.log("return request error " + error.message)
    }
}
// admin chart 
const fetch_chart = async(req,res)=>{
    try {
        const order= await orderdb.find({})
        const salesData = await orderdb.aggregate([
            {
                $match: { 'product.status': 'Delivered' }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: { $toDate: '$orderDate' } }
                    },
                    totalRevenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { _id: 1 } // Sort by month in ascending order
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    totalRevenue: 1
                }
            },
            {
                $limit: 7
            }
        ]);

        console.log("sales " + JSON.stringify(salesData));

            const data = []
            const date = []
            for(const totalRevenue of salesData){
                data.push(totalRevenue.totalRevenue);
            }
           
            for(const item of salesData){
                date.push(item.date)
            }
            // console.log(date)

            data.reverse()
            date.reverse()
            res.status(200).send({ data:data, date:date })
    } catch (error) {
        console.log(error.message)
    }
}
const Monthly_data = async (req, res) => {
    try {
        const order = await orderdb.find({});
        const salesData = await orderdb.aggregate([
            {
                $match: { 'product.status': 'Delivered' }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m', date: { $toDate: '$orderDate' } }
                    },
                    totalRevenue: { $sum: '$totalAmount' }
                }
            },
            {
                $sort: { _id: 1 } // Sort by month in ascending order
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    totalRevenue: 1
                }
            },
            {
                $limit: 7
            }
        ]);

        console.log("sales " + JSON.stringify(salesData));

        const data = [];
        const date = [];
        for (const totalRevenue of salesData) {
            data.push(totalRevenue.totalRevenue);
            date.push(totalRevenue.date);
        }

        res.status(200).send({ data: data, date: date });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ error: error.message });
    }
};
// Sales report 

const sales = async(req,res)=>{
    try {
        const order_details = await orderdb.find({})
                              .populate('userId')
                              .populate("product.productId")
                              .exec()
                              
                            //   console.log("order " + order_details)
                              res.render('sales',{orders:order_details })
    } catch (error) {
        console.log("sles error" + error.message)
    }
}




module.exports = {
    Login,
    signup,
    dashboard,
    post_sign,
    post_Login,
    // index,
    product,
    addproduct,
    post_addproduct,
    deleteProduct,
    updata_product,
    post_update,
    customer,
    update_customer,
    post_user,
    block,
    get_category,
    post_category,
    edit_category,
    get_categortyEdit,
    delete_category,
    brand,
    post_brand,
    banner_manage,
    banner_delete,
    get_counpon,
    get_addcoupon,
    post_addcoupon,
    delete_coupon,
    creating_banner,
    post_addbanner,
    user_order,
    user_orderdetails,
    update_status,
    return_request,
    fetch_chart,
    Monthly_data,
    sales,
    admin_logout
}