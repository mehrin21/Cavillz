const express = require('express')
const router = express();
const userController = require('../controller/userCrtl')
const flash = require('connect-flash')
const cartcrtl = require('../controller/cartCrtl')
const wishListcrtl = require('../controller/wishListCrtl')
const orderctrl = require('../controller/orderCtrl')
const forgotpassword = require('../controller/forgotpassword')
const authentication = require('../Middleware/userAuthentication');

// router.set('view engine','ejs')
router.set('views', './views/User')
router.use(flash())
router.use(express.static("public"))
router.get('/',userController.index)
// login page
router.get('/login',authentication.isLogout,userController.login)
router.post('/login',userController.Login_post)
// DASHBOARD 
router.get('/dashboard',authentication.isLogin,userController.dashboard)
// signup page 
router.get('/signup',userController.signup)
router.post('/signup',userController.sign_post)
// otp signup
router.get('/otplogin',forgotpassword.otplogin)
router.post('/otplogin',forgotpassword.verify_otplogin)
router.post('/otpverify',forgotpassword.otp_verify)
// phone 
router.get('/verifyphone',forgotpassword.phone_page)
router.post('/verifyphone',forgotpassword.otp_phone)
router.post('/otpphoneverify',forgotpassword.otp_Verifyphone)
// FORGOTPASSWORD
router.post('/resetpassword',forgotpassword.reset_password)
router.post('/reset',forgotpassword.phone_repassword)
// mens product page
router.get('/products',userController.ProductMen)
// WISLIST 
router.put('/addtowishlist',wishListcrtl.addtowishlist)
router.put('/wishlistremove',wishListcrtl.list_removing)
//DASHBOARD - ADDRESS

router.post('/dashboard/addaddress',userController.user_address)
router.put('/dashboard/updateaddress',userController.update_address)

// GET - CART 
// router.get('/cart',cartcrtl.get_cart)
router.put('/cartdel',cartcrtl.cart_remove)
router.put('/addtocart',cartcrtl.addtocart)
router.put('/cartIn',cartcrtl.product_increment)
router.put('/cartd',cartcrtl.product_decrement)
// EDIT GIVEN ADDRESS 
// router.post('/editaddress',userController.address_edit)
router.delete('/addresses/:address_id',userController.delete_address)
// PRODUCT VIEWING 
router.get('/productview',userController.view_product)
// CHECKOUT
router.get('/checkout',userController.get_checkout)
router.post('/checkvalidcoupon',userController.validate_coupon)
// ORDER
router.get('/wallet',userController.userWallet)
router.post('/placeorder',orderctrl.placeorder)
router.post('/razorpay',orderctrl.createOrder)
router.post('/COD',orderctrl.placeorder)
// router.post('/wallet',orderctrl.placeorder)
router.get('/success',orderctrl.success_page)
router.get('/orderdetails',orderctrl.order_details)

// order cancel
router.post('/cancelorder',orderctrl.order_cancel)
// order return
router.post('/returnorder',orderctrl.return_order)
// logout
router.get('/logout',authentication.isLogin,userController.user_logout)
module.exports=router;

