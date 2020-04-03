var express = require('express');
var multer = require('multer'),
bodyParser = require('body-parser'),
path = require('path');
var mongoose = require('mongoose');
var uploservice = require('./services/upload_service');
var Detail = require('./models/detail');
var fs = require('fs');
var dir = './uploads';
var port = 2005;
var cors = require('cors');

// Mongodb connection strat here

mongoose.connect('mongodb://tapu_db:!mistuR1@ds247852.mlab.com:47852/heroku_2nbpcct5', {
  useMongoClient: true
});

// Mongodb connection End here

// Image upload opertation strat here
var upload = multer({
  storage: multer.diskStorage({

    destination: function (req, file, callback) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, file.originalname);
    }

  }),

  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.mp4') {
      return callback( /*res.end('Only images are allowed')*/ null, false)
    }
    callback(null, true)
  }
});
// Image upload opertation end here

//Middleware Start Here
var app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
app.use(express.static(__dirname + '/uploads'));
//Middleware End Here

// view engine setup Here
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('uploads'));
// view engine setup Here

// Rest API GET and POST Operation Start here
app.get('/web', function (req, res) {
  Detail.find({}, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        data: data
      });
    }
  })

});

app.get('/', async function (req, res) {
  let getalldata = await uploservice.getalldetails();
  if (!getalldata) {
    return res.status('500').json('something went wrong');
  } else {
    return res.status('200').json(getalldata);
  }
});

app.post('/', upload.any(), async function (req, res) {
  let getalldata = await uploservice.getalldetails();
  let nextId = getalldata.length !== 0 ? parseInt(getalldata[getalldata.length - 1].mediaId) + 1 : 1;
  var promises = [];
  if (req.files.length > 0) {
    for (let i = 0; i < req.files.length; i++) {
      let req_data = {
        mediaId: nextId + i,
        media: req.files[i].filename
      };
      let save_img_data = await uploservice.details_save(req_data);
      promises.push(save_img_data);
    }
    Promise.all(promises)
    .then(async () => {
      let getalldata_update = await uploservice.getalldetails();
      return res.status('200').json('success');
    })
    .catch((e) => {
      console.log(e);
      return res.status('500').json('something went wrong');
    });
  }
});

app.post('/delete', async function (req, res) {debugger
  let resultdata = await uploservice.details_remove(req.body.mediaId);
  if (resultdata.result.ok === 1) {
    return res.status('200').json('Success');
  } else {
    return res.status('401').json('Error');
  }
});

app.listen(port, function () {
  console.log('listening on port ' + port);
});