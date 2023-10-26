const isLogin = (req,res,next)=>{
    try {
        if(req.session.userID){
          next()
        }else{
            res.render('login')
        }
    } catch (error) {
        console.log(error.message)
    }
}
const  isLogout = async(req,res,next)=>{
    try {
        if(req.session.userID){
            res.redirect('/dashboard')
        }else{
            next()
        }
    } catch (error) {
        console.log(error.message)
    }
}
module.exports = {
    isLogin,
    isLogout
}