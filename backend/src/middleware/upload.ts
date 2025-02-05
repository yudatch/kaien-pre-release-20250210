import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 画像アップロード用の設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('\n=== multer: destination ===');
    console.log('File:', file);
    
    const uploadDir = path.join(__dirname, '../../public/uploads/receipts');
    // アップロードディレクトリが存在しない場合は作成
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('Created upload directory:', uploadDir);
    }
    
    console.log('Upload directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log('\n=== multer: filename ===');
    console.log('Original filename:', file.originalname);
    
    // オリジナルのファイル名から拡張子を取得
    const ext = path.extname(file.originalname);
    // タイムスタンプを含むユニークなファイル名を生成
    const filename = `receipt_${Date.now()}${ext}`;
    
    console.log('Generated filename:', filename);
    cb(null, filename);
  }
});

// アップロードされたファイルのバリデーション
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  console.log('\n=== multer: fileFilter ===');
  console.log('File:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype
  });
  
  // 許可するMIMEタイプ
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (allowedMimes.includes(file.mimetype)) {
    console.log('File type is allowed');
    cb(null, true);
  } else {
    console.log('File type is not allowed');
    cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'));
  }
};

// multerインスタンスの作成
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// ラップしてログを追加
const uploadWithLogging = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('\n=== Before Multer ===');
    console.log('Request headers:', req.headers);
    console.log('Content type:', req.headers['content-type']);
    
    upload.single(fieldName)(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }
      
      console.log('\n=== After Multer ===');
      if (req.file) {
        console.log('Uploaded file:', {
          fieldname: req.file.fieldname,
          originalname: req.file.originalname,
          encoding: req.file.encoding,
          mimetype: req.file.mimetype,
          destination: req.file.destination,
          filename: req.file.filename,
          path: req.file.path,
          size: `${(req.file.size / 1024).toFixed(2)}KB`
        });

        // フォームデータをパース
        try {
          const formData = req.body;
          console.log('\n=== Form Data ===');
          console.log(formData);
          
          // 画像パスを設定
          req.body.receipt_image_url = `/uploads/receipts/${req.file.filename}`;
        } catch (error) {
          console.error('Error parsing form data:', error);
        }
      } else {
        console.log('No file uploaded');
      }
      
      next();
    });
  };
};

export default uploadWithLogging; 