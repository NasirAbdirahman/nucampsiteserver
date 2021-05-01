//Router handles POST endpoints for paths that begin with /imageuploads
const express = require('express');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

/* Extra Code could be left out & multer has default values */

//Storage destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {//cb=callback
        cb(null, 'public/images');//1st arg=null(no err), 2nd arg.= path we want to save file to
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)//Ensures file name is same on client/server side;if not set multer creates random str as filename
    }
});

//File filter
const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {//regex insures proper extension of file
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

//Multer module configured to enable fileuploads
const upload = multer({ storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();


uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {//Setup to only allow single file 
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);//Confirms to client, file received correctly
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;