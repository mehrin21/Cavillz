require('dotenv').config()
const User = require("../model/userModel");
const Otp = require("../model/otpdb");
const otpgenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
// const admin = require("firebase-admin");
const Otphelper = require('../helper/otpHelper')


// const { initializeApp } = require('firebase-admin/app');
// const app = initializeApp();
// OTP LOGIN RENDERING
const otplogin = (req, res) => {
  try {
    const title = req.flash("title");
    res.render("otplogin", { title: title[0] });
  } catch (error) {
    console.log(error.message);
  }
};

const verify_otplogin = async (req, res) => {
  try {
    if (req.body.email) {
      const findUser = await User.findOne({ email: req.body.email });
      console.log(findUser);
      if (findUser) {
        if (findUser.email) {
          if (findUser.isBlock == 0) {
            const OTP = otpgenerator.generate(4, {
              digits: true,
              alphabets: false,
              upperCaseAlphabets: false,
              lowerCaseAlphabets: false,
              specialChars: false,
            });

            const transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "mehrinmuhammed2001@gmail.com",
                pass: "vnub dlry veuh wele",
              },
            });

            let mailOption = {
              from: "mehrinmuhammed2001@gmail.com",
              to: findUser.email,
              subject: "OTP VERIFICATION",
              text: "PLEASE ENTER THE OTP FOR LOGIN " + OTP,
            };
            await transporter.sendMail(mailOption);
            console.log(OTP);
            const otp = new Otp({ email: req.body.email, otp: OTP });
            const salt = await bcrypt.genSalt(10);
            otp.otp = await bcrypt.hash(otp.otp, salt);
            const result = await otp.save();

            console.log("result " + result);

            // const session = null
            res.render("otpVerify", { data: result });
          } else {
            req.flash("title", "User is Blocked");
            res.redirect("/otplogin");
          }
        }
      } else {
        req.flash("title", "Invalid email");
        res.redirect("/otplogin");
      }

    }
  } catch (error) {
    console.log(error.message);
  }
};
//VERIFY OTP
const otp_verify = async (req, res) => {
  try {
    if (req.body.email) {
      const email = req.body.email;
      console.log(email);

      const otp = req.body.otp;
      console.log(otp);
      const findData = await Otp.findOne({ email: req.body.email });
      console.log(findData.email);
      if (findData) {
        const otpmatch = await bcrypt.compare(otp, findData.otp);
        console.log(otpmatch);

        // console.log("tuiretuoeriu")
        if (otpmatch) {
          res.render("forgotpassword", { email: email });
        } else {
          req.flash("title", "OTP is not match");
          res.redirect("/otplogin");
        }
      } else {
        req.flash("title", "OTP expired");
        res.redirect("/otplogin");
      }
    } else if (req.body.phone) {
      const otp = req.body.otp;
      console.log("phone otp " + otp);
      const find_phone = await Otp.findOne({ phone: req.body.phone });
      console.log("phone " + find_phone);


    }
  } catch (error) {
    console.log(error.message);
  }
};

// POST-PASSWORD
const reset_password = async (req, res) => {
  try {
    const hash_password = await bcrypt.hash(req.body.password, 10);
    const email = req.body.email;

    if (email && hash_password) {
      const reset_pass = await User.updateOne(
        { email: email },
        { $set: { password: hash_password } }
      );
      console.log("poassword is change");
      res.render("login");
    } else {
      console.log("error");
    }
  } catch (error) {
    console.log(error.message);
  }
};
// phone number page
const phone_page = async (req, res) => {
  try {
    res.render('phoneNumberotp')
  } catch (error) {
    console.log(error.message)
  }
}

const otp_phone = async (req, res) => {
  try {
    console.log(req.body)
    const phone = req.body.phone;
    console.log("phone:" + phone);

    const findUser = await User.find({ phone: req.body.phone });
    if (findUser) {
      console.log("user is here")
      await Otphelper.sentOtp(phone)
      //  const otp = new Otp ({})
      res.render('otpverify-phone',{data:phone})
      
    }

  } catch (error) {
    console.log(error.message)
  }
}

// VERIFY OTP 

const otp_Verifyphone = async (req, res) => {
  console.log(req.body)
  try {
    const otp = req.body.otp;
    console.log("phone otp " + otp);
    const find_phone = req.body.phone
    

    if (find_phone) {
      console.log("here 0000000000")
    //   const otpmatch = await bcrypt.compare(otp, find_phone.otp);
    //   if (otpmatch) {
    //     res.render('forgotpassword', { email: find_phone });
    //   } else {
    //     req.flash("title", "OTP is not match");
    //     res.redirect("/otplogin");
    //   }
    // } else {
    //   req.flash("title", "user not find");
    //   res.redirect("/otplogin");
     await Otphelper.verifyCode(find_phone,otp)
     res.render('resetpassword', { phone: find_phone });
    }
  } catch (error) {
    console.log(error.message)
  }
}
// reset-password :phone 
const phone_repassword = async (req, res) => {
  console.log("here")
  try {
    const hash_password = await bcrypt.hash(req.body.password, 10);
    console.log("hash " + hash_password)
    const phone = req.body.phone
    console.log("Phone " +phone)
    const find_phone = await User.find({phone:phone})
    console.log(find_phone)
    if (find_phone && hash_password) {
      const reset_pass = await User.updateOne(
        { phone:phone },
        { $set: { password: hash_password } }
      );
      console.log("reset " , reset_pass)
      console.log("poassword is change");
      res.redirect('/login');
    } else {
      console.log("error");
    }
  } catch (error) {
      console.log("reset passwaord using phone " + error.message)
  }
}


module.exports = {
  otplogin,
  verify_otplogin,
  otp_verify,
  reset_password,
  phone_page,
  otp_phone,
  otp_Verifyphone,
  phone_repassword
}
