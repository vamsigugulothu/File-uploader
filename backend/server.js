const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');
const multer = require('multer');
require('./passportSetup');
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

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.use(passport.initialize());
app.use(passport.session());

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

app.get("/", (req, res) => {
    res.json({message: "You are not logged in"})
})

app.get("/failed", (req, res) => {
    res.send("Failed")
})
app.get("/success",isLoggedIn, (req, res) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
      res.send(`
        <p>Welcome ${req.user.displayName}!</p>
        <form action="/upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file" required="true">
          <button type="submit">Upload File</button>
        </form>
        <form action="/files" method="get" enctype="multipart/form-data">
          <button type="submit">All Files</button>
        </form>
        <a href="/logout">Logout</a>
      `);
     } else {
      res.send(`
        <p>Please <a href="/auth/google">sign in with Google</a>.</p>
      `);
    }
})


app.get('/auth/google',
    passport.authenticate('google', {
            scope:
                ['email', 'profile'],prompt: 'select_account'
        }
    ));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
    function (req, res) {
        res.redirect('/success')

    }
);

app.post('/upload',isLoggedIn, upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully' });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/files',isLoggedIn, (req, res) => {
    const fileDir = './uploads';
    fs.readdir(fileDir, (err, files) => {
      if (err) {
        console.error(err);
        res.status(500).send('Server error');
      } else {
        const fileList = files.map(file => ({
          name: file,
          url: `/uploads/${file}`,
        }));
        const listItems = fileList.map(file => `<li><a href="${file.url}" download onclick="event.stopPropagation();">${file.name}</a></li>`).join('');

        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>File List</title>
            </head>
            <body>
              <h1>File List</h1>
              <ul>
                ${listItems}
              </ul>
            </body>
          </html>
        `;
        res.send(html);
      }
    });
});

app.get("/logout", (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(port, () => console.log("server running on port" + port))