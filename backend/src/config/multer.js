import multer from 'multer';
import crypto from 'crypto';
import { extname ,resolve } from 'path';

export default {
  dest: resolve(__dirname,"..", "..", "tmp", "uploads"),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, resolve(__dirname,"..", "..", "tmp", "uploads"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, fileName);
      });
    },
  }),

  limits: {
    fileSize: 4 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    /* if (extname(file.originalname) !== '.pdf') {
      return cb(new Error('Only pdfs are allowed'))
    } */

    cb(null, true)
  }
}




/* export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'upload'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
 */
