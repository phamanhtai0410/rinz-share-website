const path = require('path');
const express = require('express');
const share_router = require('./routers/share')
// --------
const { IAPI } = require('./config');
console.log(`Your IAPI is ${IAPI}`);
//---------------
const app = express();
app.set('view engine', 'ejs');
// ----------
console.log(__dirname);
app.use(
    '/bootstrap/template',
    express.static(path.join(__dirname, 'node_modules/bootstrap'))
);
app.use('/template', express.static(path.join(__dirname, 'template')));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());

app.use('/', share_router);
app.get('*', (req, res) => {
    res.render('error/500');
});

app.listen(3001, () => {
    console.log('Application listening on port 3001!');
});