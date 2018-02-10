const app = require('express').Router();
const db = require('../db');
const { Product, Category } = db.models;

module.exports = app;

app.get('/products', (req, res, next)=> {
  Product.findAll(
    { include: [ Category ]}
  )
  .then( products => res.render('products', { products }))
  .catch(next);
});

app.post('/products', (req, res, next)=> {
  Product.generateFromForm(req.body)
    .then( product => {
      res.redirect(`/categories/${product.category.name}`);
    })
    .catch(next);
});

app.delete('/categories/:id', (req, res, next)=> {
  Category.destroy({ where: {
    id: req.params.id
  }})
  .then(()=> res.redirect('/'))
  .catch(next);
});
app.delete('/products/:id', (req, res, next)=> {
  let product;
  Product.findById(req.params.id, {
    include: [ Category ]
  })
    .then( _product => {
      product = _product;
      return product.destroy();
    })
    .then(()=> {
      if(product.category){
        return res.redirect(`/categories/${product.category.name}`)
      }
      res.redirect('/products')
    })
    .catch(next);
});

app.get('/categories/:name', (req, res, next)=> {
  Category.findOne({
    where: { name: req.params.name },
    include: [ Product ]
  })
  .then( category => {
    if(!category){
      throw { status: 404, message: 'product not found'};
    }
    res.render('category', { category });
  })
  .catch(next);
});

app.get('/', (req, res, next)=> {
  res.render('index', {});
});
