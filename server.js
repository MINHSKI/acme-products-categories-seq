const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const path = require('path');

nunjucks.configure({ noCache: true });

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use(require('body-parser').urlencoded());
app.use(require('method-override')('_method'));

app.set('view engine', 'html');
app.engine('html', nunjucks.render);

const db = require('./db');
const { models } = db;
const { Product, Category } = models;

app.use((req, res, next)=>  {
  Category.findAll({
    include: [ Product]
  })
  .then( categories => {
    res.locals.categories = categories;
    next();
  })
  .catch(next);
});

app.use('/', require('./routes'));

app.use((err, req, res, next)=> {
  const status = err.status || 500;
  res.status(status).render('error', { error: err });
});


db.sync()
  .then(()=> db.seed());

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on porrt ${port}`));
