const userViews = require('../views/user.js')
const router = require('express').Router()
const multer = require('multer')
const customError = require('../errorhandler/CustomError')
const auth = require('../middlewares/auth')

const fileStorage = multer.diskStorage(
  {
    destination : (req, file, callback) => {
      callback(null, 'userImages')
    },
    filename : (req, file, callback) => {
      callback(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
  }
)

const fileFilter = (req, file, callback) => {
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg"){
    callback(null, true)
  }
  else{
    callback(customError.invalidFileFormat("Please Enter Valid File Format.. It Should be in .jpeg/.jpg/.png"), false)
  }
  
}

const uploader = multer({
  storage : fileStorage,
  fileFilter : fileFilter,
  limits : {
    fileSize : 512*1000
  }
})


router.post('/signup', uploader.single('userImage'), userViews.signUpView);
router.post('/login', userViews.loginView);
router.post('/refreshtoken',auth.verifyRefreshToken, userViews.refreshToken);

module.exports = router