const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');

const _ = require('lodash');

const share_router = require('./routers/share');
const upload_router = require('./routers/upload');
// --------
const { IAPI } = require('./config');
console.log(`Your IAPI is ${IAPI}`);
//---------------
const app = express();
app.set('view engine', 'ejs');

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

//add other middleware
app.use(cors());
app.use(morgan('dev'));


// ----------
console.log(__dirname);
app.use(
    '/bootstrap/template',
    express.static(path.join(__dirname, 'node_modules/bootstrap'))
);
app.use('/template', express.static(path.join(__dirname, 'template')));
/// options for static serve
const static_options = {
    setHeaders: function (res, path, stat) {
        res.set('Content-Type', 'application/json')
      }
};
app.use(express.static(path.join(__dirname, 'public'), static_options));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.use('/', share_router);

app.use('/upload', upload_router);

app.get('*', (req, res) => {
    res.render('error/500');
});

app.listen(3001, () => {
    console.log('Application listening on port 3001!');
});