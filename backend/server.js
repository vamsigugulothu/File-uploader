const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');


const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2']
}))

const cookieParser = require('cookie-parser');
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const uniqueId = uniqueSuffix + extension;

    req.fileInfo = {
      originalName: file.originalname,
      extension: extension,
      uniqueId: uniqueId,
    };

    cb(null, uniqueId);
  }
});

const upload = multer({ storage: storage });

const port = process.env.PORT || 5000

//middleware
const authMiddleware = async (req, res, next) => {
  try {
    const sessionCookie = req.cookies['google-auth-session'];
    if (!sessionCookie) {
      res.status(401).send('Unauthorized');
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(401).send('Unauthorized');
  }
};

app.post('/upload',authMiddleware, upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully' });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/files',authMiddleware, (req, res) => {
    const fileDir = './uploads';
    fs.readdir(fileDir, (err, files) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else {
        const fileList = files?.map(file => ({
          name: file,
          url: __dirname+`/uploads/${file}`,
        }));

      res.send(fileList);
      }
    });
});

app.get('/download/:fileName',authMiddleware, (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'uploads', fileName);
    res.download(filePath);
});

app.listen(port, () => console.log("server running on port" + port))