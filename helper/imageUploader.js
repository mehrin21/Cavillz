const multer = require('multer')
const path = require('path')
const fs = require('fs')

const storage = multer.diskStorage({
    destination:(req,res,cb)=>{ cb(null,path.join(__dirname,'../public/upload'))},
    filename :(req,file,cb)=>{ cb(null,Date.now() +path.extname(file.originalname))}
})

const upload = multer({storage:storage})
module.exports = {upload,storage}
