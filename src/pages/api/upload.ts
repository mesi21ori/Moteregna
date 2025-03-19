import upload from '../../../utils/uploadMiddleware';

export const config = {
  api: {
    bodyParser: false, 
  },
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'File upload error', error: err });
    }

    const files = req.files;
    const filePaths: { [key: string]: string } = {};

    if (files['driversLicencephotoBack']) {
      filePaths.driversLicencephotoBack = `/uploads/${files['driversLicencephotoBack'][0].filename}`;
    }
    if (files['driversLicencephotoFront']) {
      filePaths.driversLicencephotoFront = `/uploads/${files['driversLicencephotoFront'][0].filename}`;
    }
    if (files['profile']) {
      filePaths.profile = `/uploads/${files['profile'][0].filename}`;
    }

    res.status(200).json({ message: 'Files uploaded successfully', filePaths });
  });
}