const app = require('express').Router();
const db = require('../db');
const { Product, Category } = db.models;

module.exports = app;

app.get('/products', (req, res, next)=> {
  Product.findAllWithCategories()
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
  Product.findByIdAndDestroy(req.params.id) 
    .then((product)=> {
      if(product.category){
        return res.redirect(`/categories/${product.category.name}`);
      }
      res.redirect('/products');
    })
    .catch(next);
});

app.get('/categories/:name', (req, res, next)=> {
  Category.findOneByNameOrThrow(req.params.name)
    .then( category => {
      res.render('category', { category });
  })
  .catch(next);
});


app.get('/', (req, res, next)=> {
  res.render('index', {});
});
