const  express =require('express')
const admin = express();
const adminCrtl = require('../controller/adminCrtl')
const image_ctrl = require('../controller/imagecrop')
// admin validation
const validation = require('../Middleware/adminAuthentication')

const {upload} = require('../helper/imageUploader')
admin.set('views','./views/Admin')   // views folder

admin.use(express.static("public"))  //public folder
admin.use(express.static("../public/upload"))

admin.use(express.json());
admin.use(express.urlencoded({ extended: true }))

// here / represent the Login page 
admin.get('/login',validation.isLogout,adminCrtl.Login)
admin.post('/login',adminCrtl.post_Login)
admin.get('/index',validation.isLogout,adminCrtl.dashboard)
// admin.get('/index',adminCrtl.index)
// sigup page
admin.get('/Signup',adminCrtl.signup)
admin.post('/Signup',adminCrtl.post_sign)
// PRODUCT TAB
admin.get('/productlist',adminCrtl.product)
admin.get('/addproduct',adminCrtl.addproduct)
admin.post('/addproduct',upload.array('image'),adminCrtl.post_addproduct)
admin.get('/addbrand',adminCrtl.brand)
admin.post('/addbrand',adminCrtl.post_brand)
// delete product
admin.get('/deleteproduct',adminCrtl.deleteProduct)
// update product
admin.get('/updateproduct',adminCrtl.updata_product)
admin.post('/updateproduct',upload.array('image'),adminCrtl.post_update)
// category
admin.get('/categories',adminCrtl.get_category)
admin.post('/categories',adminCrtl.post_category)
admin.get('/updatecategory',adminCrtl.get_categortyEdit)
admin.post('/updatecategory',adminCrtl.edit_category)
admin.get('/deletecategory',adminCrtl.delete_category)
// customerlist
admin.get('/customerlist',adminCrtl.customer)


// update customer
admin.get('/updatecustomer',adminCrtl.update_customer)
admin.post('/updatecustomer',adminCrtl.post_user)
// block/unblock user
admin.patch('/block',adminCrtl.block)

// BANNER 
admin.get('/bannerManagement',adminCrtl.banner_manage)
// admin.post('/upload',upload.single('image'),adminCrtl.post_addbanner)
admin.delete('/deletebanner',adminCrtl.banner_delete)
admin.get('/addbanner',adminCrtl.creating_banner) //creating
admin.post('/addbanner',upload.single('image'),adminCrtl.post_addbanner)

// COUPON
admin.get('/coupons',adminCrtl.get_counpon)
admin.get('/addcoupon',adminCrtl.get_addcoupon)
admin.post('/addcoupon',adminCrtl.post_addcoupon)
admin.delete('/deletecoupon',adminCrtl.delete_coupon)
// IMAGE_CROP
admin.get('/imagecrop',image_ctrl.image_crop)
admin.post('/imagecrop',image_ctrl.post_image)
// ORDER USER LISTING 
admin.get('/order',adminCrtl.user_order)
admin.get('/orderdetails',adminCrtl.user_orderdetails)
admin.post('/statusupdate',adminCrtl.update_status)
admin.post('/returnapprove',adminCrtl.return_request)
// CHART
admin.get('/salesreport',adminCrtl.sales)
admin.get('/chartData',adminCrtl.fetch_chart)
admin.get('/chartData2',adminCrtl.Monthly_data)
// admin_logout
admin.get('/logout',validation.isLogin,adminCrtl.admin_logout)
module.exports = admin;