const express = require("express");
const passport = require('passport');
const mongoose = require("mongoose")
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));
  
  

const user = new mongoose.Schema({
    name: {
        type:String
    },
    email: { type: String},
    profile_picture: { type: String},
    access_token:{ type: String }
  });

const userSchema = mongoose.model("fUser",user);

const files = new mongoose.Schema({
    name: {
        type:String
    },
    path:{
        type:String
    },
    mimetype: {
        type:String
    },
    size: {
        type:Number
    }
});

const filesSchema = mongoose.model("Files",files);

//connect to moogose
const dbUri = "mongodb+srv://vamsig:vamsig@cluster0.bp6fp64.mongodb.net/?retryWrites=true&w=majority"
const connectDb = async () => {
    await mongoose.connect(dbUri).then(() => {
            console.info(`Connected to database`)
        }
    )
}
connectDb().catch(error => console.error(error))




const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.CLIENTSECRET,
    callbackURL: "http://localhost:8000/auth/google/callback",
}, async( accessToken, refreshToken, profile, done ) => {
    const email = profile.emails[0].value
    const exist = await userSchema.findOne({email })
    console.log(exist)
    if(!exist){
        const user = new userSchema({
            name: profile.displayName,
            email: profile.emails[0].value,
            profile_picture: profile.photos[0].value,
            access_token: accessToken
        });
        await user.save();
    }
    return done(null, profile);
}))

passport.serializeUser((user, done) => {
    done(null, user);
});
  
passport.deserializeUser((user, done) => {
    done(null, user);
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require('express-session')({
  secret: 'YOUR_SECRET',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/main', (req, res) => {
    // Check if user is authenticated
    // if (req.isAuthenticated()) {
    //   res.send(`
    //     <p>Welcome ${req.user.displayName}!</p>
    //     <form action="/upload" method="post" enctype="multipart/form-data">
    //       <input type="file" name="file">
    //       <button type="submit">Upload File</button>
    //     </form>
    //     <
    //     <a href="/logout">Logout</a>
    //   `);
    //  } else {
    //   res.send(`
    //     <p>Please <a href="/auth/google">sign in with Google</a>.</p>
    //   `);
    // }
    res.send("hi")
});

app.get('/error', (req, res) => res.send("error logging in"));

app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'],prompt: 'select_account', }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // res.redirect('/main');
    if(req.isAuthenticated()) {
        res.redirect('http://localhost:3000/dashboard');
    }
    else{
        res.redirect('http://localhost:3000/');
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.logout((err) => {
        res.send('loggedout');
    });
    
});

const multer = require('multer');
// const path = require('path');
const fs = require('fs');

const upload = multer({ dest: "uploads/" });


app.post('/upload', upload.single('file'), async(req, res) => {
    if (req.isAuthenticated()) {
    console.log(req.file);
    const file = new filesSchema({
        name: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
    });
    
    await file.save();
    res.status(200).send("File uploaded successfully.")
    } else {
        res.status(400).send("");
    }
    
});

app.get('/files', (req, res) => {
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
        res.json(fileList);
      }
    });
});

const PORT= 8000;
app.listen(PORT,() => {console.log("successfully running")})
