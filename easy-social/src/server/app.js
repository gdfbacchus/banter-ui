import fs from 'fs';
import express from 'express';
const bodyParser = require('body-parser');
import cookieParser from 'cookie-parser';
const path = require("path");
const multer = require("multer");
import Handlebars from 'handlebars';
import paths from '../../scripts/paths';
import createSsrHandler from './handlers/createSsrHandler';
import createAmpHandler from './handlers/createAmpHandler';
import steemAPI from './steemAPI';
const cors = require('cors');

const indexPath = `${paths.templates}/index.hbs`;
const indexHtml = fs.readFileSync(indexPath, 'utf-8');
const template = Handlebars.compile(indexHtml);
const ampIndexPath = `${paths.templates}/amp_index.hbs`;
const ampIndexHtml = fs.readFileSync(ampIndexPath, 'utf-8');
const ampTemplate = Handlebars.compile(ampIndexHtml);

const ssrHandler = createSsrHandler(template);
const ampHandler = createAmpHandler(ampTemplate);

const CACHE_AGE = 1000 * 60 * 60 * 24 * 7;

const app = express();

const IS_DEV = process.env.NODE_ENV === 'development';

app.use(cookieParser());

if (IS_DEV) {
  app.use(express.static(paths.publicRuntime(), { index: false }));
} else {
  app.use(express.static(paths.buildPublicRuntime(), { maxAge: CACHE_AGE, index: false }));
}

const postImageUploadPath = paths.buildPublicRuntimePostUploads();
app.use(express.static(postImageUploadPath, { maxAge: CACHE_AGE, index: false }));

app.get('/callback', (req, res) => {
  const accessToken = req.query.access_token;
  const expiresIn = req.query.expires_in;
  const state = req.query.state;
  const next = state && state[0] === '/' ? state : '/';
  if (accessToken && expiresIn) {
    res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000 });
    res.redirect(next);
  } else {
    res.status(401).send({ error: 'access_token or expires_in Missing' });
  }
});

app.get('/i/@:referral', async (req, res) => {
  try {
    const { referral } = req.params;

    const accounts = await steemAPI.sendAsync('condenser_api.get_accounts', [[referral]]);
    if (accounts[0]) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/i/:parent/@:referral/:permlink', async (req, res) => {
  try {
    const { parent, referral, permlink } = req.params;

    const content = await steemAPI.sendAsync('condenser_api.get_content', [referral, permlink]);

    if (content.author) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect(`/${parent}/@${referral}/${permlink}`);
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/@:author/:permlink/amp', ampHandler);
app.get('/:category/@:author/:permlink/amp', (req, res) => {
  const { author, permlink } = req.params;
  res.redirect(301, `/@${author}/${permlink}/amp`);
});
app.get('/:category/@:author/:permlink', (req, res) => {
  const { author, permlink } = req.params;
  res.redirect(301, `/@${author}/${permlink}`);
});
app.get('/', ssrHandler);
app.get('*', ssrHandler);

//POST ROUTES
const postingRoutes = require("./routes/posting/index");
//ACCOUNT ROUTES
const accountRoutes = require("./routes/account/index");
//Account routes

const uploadRoutes = require("./routes/upload/index");

app.use(cors());
// app.use(function(req, res, next){
//   console.log("BODY 1",req.body);
//   next();
// });
app.use(bodyParser.json());
// app.use(function(req, res, next){
//   console.log("BODY 2",req.body);
//   next();
// });


const storage = multer.diskStorage({
  destination: postImageUploadPath,
  filename: function(req, file, cb){
    const origName = file.originalname.substr(0,file.originalname.lastIndexOf('.'));
    let newName = origName.replace(/ /g,"_");
    newName = "ES-IMG-" +(newName)+ "-"+ Date.now() + path.extname(file.originalname)

    // cb(null,"ES-IMG-" +(file.originalname.substr(0,file.originalname.lastIndexOf('.')))+ "-"+ Date.now() + path.extname(file.originalname));
    cb(null, newName);
  }
});

const MAXIMUM_UPLOAD_SIZE = 20971520;//20MB
const upload = multer({
  storage: storage,
  limits:{fileSize: MAXIMUM_UPLOAD_SIZE},//20MB
}).single("file");

// var upload = multer({ dest: './uploads/' });

app.use(function(req, res, next){
  res.locals.uploader = upload;
  next();
});
//res.locals.

app.post('/es-api/v0/ca', accountRoutes.createESAccount);
app.post('/es-api/v0/cp', postingRoutes.createESPost);
// app.post('/es-api/v0/upload', uploadRoutes.uploadImage);
app.post('/es-api/v0/upload', uploadRoutes.uploadImage);
//app.post('/es-api/v0/encryptStr', accountRoutes.encryptStr);





export default app;
