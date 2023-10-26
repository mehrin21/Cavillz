const otpGenerator = require('otp-generator')

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN )

const verifyServiceSid = process.env.TWILIO_VERIFY 

const sentOtp = async(mobileNumber)=>{
    try {
        console.log("calling helper")
        await client.verify.v2.services(verifyServiceSid).verifications.create({
            to:`+91${mobileNumber}`,
            channel:`sms`
        })
    } catch (error) {
        console.log("otp error " + error.message);

    }
}

const verifyCode = async(mobileNumber,code)=>{
    try {
        const verification = await client.verify.v2
        .services(verifyServiceSid).verificationChecks.create({
            to:`+91${mobileNumber}`,
            code:code
        })

        if(verification.status === 'approved'){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log("otp verify " + error.message)
    }
}

module.exports = {
    sentOtp,
    verifyCode
}