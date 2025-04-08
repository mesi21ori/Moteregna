// import multer from 'multer';
// import path from 'path';


// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploads/'); 
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); 
//   }
// });

// const upload = multer({ storage: storage }).fields([
//   { name: 'Librephoto', maxCount: 1 },
//   { name: 'driversLicencephotoFront', maxCount: 1 },
//   { name: 'profile', maxCount: 1 },
//   { name: 'businessPermit', maxCount: 1 }
// ]);

// export default upload;

import multer from 'multer';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).fields([
  { name: 'Librephoto', maxCount: 1 },
  { name: 'driversLicencephotoFront', maxCount: 1 },
  { name: 'profile', maxCount: 1 },
  { name: 'businessPermit', maxCount: 1 }
]);

export default upload;

// Add type extensions for NextApiRequest
declare module 'next' {
  interface NextApiRequest {
    files?: {
      [fieldname: string]: Express.Multer.File[];
    };
  }
}