const orderdb = require('../model/orderdb')
const cartdb = require('../model/cartdb')
const productdb = require('../model/productdb')
const walletdb = require('../model/walletdb')
const addressdb = require('../model/addressdb')
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const razorpay = require('razorpay')
const razorpayInstance = new razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});
// render success page
const success_page = async (req, res) => {
  try {
    const userid = req.session.userID

    const orders = await orderdb
      .findOne({ userId: userid })
      .populate('product.productId')
      .sort({ _id: -1 });

    console.log("orders " + orders)
    console.log("oredrs address" + orders)

    res.render('success', { orders: orders })
  } catch (error) {
    console.log(error.message)
  }
}
// place order  - 
const placeorder = async (req, res) => {
  try {
    const userid = req.session.userID
    // console.log(req.body)
    const { paymentMethod, addressId, walletAmount, purchase_total, couponCode } = req.body
    const cartItem = await cartdb.findOne({ userId: userid }).populate("product.product_id")
    // console.log("cartItem " + cartItem)
    const products = cartItem.product.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      status: "pending",
      productPrice: item.price, // Provide the productPrice
    }));
    if (paymentMethod === 'COD') {


      const order = new orderdb({
        userId: userid,
        paymentMethod: paymentMethod,
        totalAmount: purchase_total,
        address: addressId,
        product: products,
        coupon: couponCode,
        status: "pending",

      })
      console.log("order " + order)
      await order.save()
      
      await cartdb.deleteOne({ _id: cartItem._id })
      res.json({message: "cash on delivery" })
      console.log("order is saved")
     
        // res.redirect('/success')

      // res.redirect('/success')

    } else if (paymentMethod === "Razorpay") {
      const order = new orderdb({
        userId: userid,
        paymentMethod: paymentMethod,
        totalAmount: purchase_total,
        address: addressId,
        product: products,
        coupon: couponCode,
        status: "pending",
        paymentStatus: "paid"
      })
      await order.save()
      await cartdb.deleteOne({ _id: cartItem._id })
      res.json({ message: "order placed successfully" })
      //  res.redirect('/success')
    } else if (paymentMethod === 'wallet') {
      if (walletAmount >= purchase_total) {
        const order = new orderdb({
          userId: userid,
          paymentMethod: paymentMethod,
          totalAmount: purchase_total,
          address: addressId,
          product: products,
          coupon: couponCode,
          wallet:walletAmount,
          status: "pending",
          paymentStatus: "paid"
        })

        const orderDetails = {
          orderid : order._id,
          amount : purchase_total,
          type:'Less'
        }

        const updatewallet = await walletdb.findOneAndUpdate(
          {userid:userid},{
            $inc :{balance :-purchase_total},
            $push:{orderDetails:orderDetails}
          },
          {new:true}
        )
           await order.save() 
        res.json({ message: 'Order placed successfully' });
        // res.redirect('/success')
      }else {
        res.json({ message: 'low wallet' });
       
    }
   
  }
  } catch (error) {
    console.log(error.message)
  }
}

const createOrder = async (req, res) => {
  try {
    console.log("rozor pay is working")
    const user = req.session.userID;
    let amount = parseInt(req.body.amount) * 100;
    console.log("amount " + amount)

    let flag = await checkStock(user);
    console.log("flag " + flag)

    if (flag == 0) {
      const options = {
        amount: amount,
        currency: "INR",
        receipt: "mehrinmuhammed2001@gmail.com",
      };
      razorpayInstance.orders.create(options, (err, order) => {
        if (!err) {
          console.log("here")
          res.status(200).send({
            success: true,
            msg: "Order Created",
            amount: amount,
            key_id: RAZORPAY_ID_KEY,
            contact: "9048645960",
            name: "Mehrin Muhammed",
            email: "mehrinmuhammed2001@gmail.com",
            message: true,
          });
        } else {
          res
            .status(400)
            .send({
              message: true,
              success: false,
              msg: "Something went wrong!",
            });
        }
      });
    } else {
      res.status(200).send({ message: false, msg: "Some products are out of Stock" });
    }
  } catch (error) {

  }
}


let checkStock = async (user) => {
  console.log("entering")
  let flag = 0;
  const Cart = await cartdb
    .findOne({ userId: user })
    .populate("product.product_id");
  for (const product of Cart.product) {
    const pro = await productdb.findOne({ _id: product.product_id });
    // console.log("pro " + pro)
    if (product.quantity > pro.quantity) {
      flag = 1;
      break;
    }
  }

  return flag;
};
// ORDER-DETAILS
const order_details = async (req, res) => {
  try {
    console.log(req.query)
    const orderid = req.query.id
    const order = await orderdb.findById({ _id: orderid }).populate('product.productId').populate('address')
    // const address= await addressdb.find({_id:order.address._id})
    // console.log("address "+ address)
    console.log("orders" + order)
    res.render('userOrder', { order: order })
  } catch (error) {
    console.log(error.message)
  }
}
// CANCEL ORDER
const order_cancel = async (req, res) => {
  try {
    const session = req.session.userID;
    // console.log(session)
    if (session) {
      console.log(req.body);
      let orderid = req.body.id;
      let proid = req.body.proid;

      let order = await orderdb.findById(orderid);
      console.log("order " + order);
      if (order.paymentMethod != 'COD') {
        const userWallet = await walletdb.findOne({ userid: order.userId });
        // console.log("userWallet" + userWallet)
        if (userWallet) {
          await walletdb.findByIdAndUpdate(
            userWallet._id,
            {
              $inc: { balance: order.totalAmount },
              $push: { orderDetails: { orderid: orderid, amount: order.totalAmount, type: "Added" } },
            },
            { new: true }
          );
        } else {
          let wallet = new walletdb({
            userid: session,
            balance: order.totalAmount,
            orderDetails: [{ orderid: orderid, amount: order.totalAmount, type: "added" }],
          });
          await wallet.save();
        }
        // Return product quantity
        for (const product of order.product) {
          await productdb.findByIdAndUpdate(
            product.productId,
            { $inc: { quantity: product.quantity } },
            { new: true }
          );
        }

        order = await orderdb.findByIdAndUpdate(orderid, { paymentStatus: "refund" }, { new: true });
      }
      const product = order.product.find((p) => p._id.toString() === proid);
      if (product) {
        product.status = "Cancelled";
      }
      await order.save();

      order = await orderdb.findById(orderid);
      if (order) {
        res.send({ message: "1" });
      } else {
        res.send({ message: "0" });
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error.message);
  }
};
// return order

const return_order = async (req, res) => {
  try {
    console.log(req.body)
    const orderid = req.body.id
    const proid = req.body.proid

    let order = await orderdb.findById(orderid)
    const product = order.product.find((p) => p._id.toString() === proid)

    if (product) {
      product.status = "Return Request"
    }
    await order.save();

    if (order) {
      res.send({ message: "1" })
    } else {
      res.send({ message: "0" })
    }
  } catch (error) {
    console.log("error in return " + error.message)
  }
}


module.exports = {
  placeorder,
  success_page,
  createOrder,
  order_details,
  order_cancel,
  return_order
}

