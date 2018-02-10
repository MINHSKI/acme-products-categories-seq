const conn = require('./conn');
const Category = require('./Category');
const Product = require('./Product');

Product.belongsTo(Category);
Category.hasMany(Product);

const sync = ()=> {
  return conn.sync({ force: true });

}

const seed = ()=> {
  [
    {
    categoryName: 'Beverages', productName: 'White Wine'},
    {
    categoryName: 'Beverages', productName: 'Red Wine'},
    {
    categoryName: 'Beverages', productName: 'Rose'},
  {
    categoryName: 'Beverages', productName: 'Coffee'},
    {
    categoryName: 'Beverages', productName: 'Seltzer'},
    {
    categoryName: 'Condiments', productName: 'Ketchup'},
    {
    categoryName: 'Condiments', productName: 'Mustard'}
  ].reduce((memo, item)=> {
    return memo.then(()=> Product.generateFromForm(item));
  }, Promise.resolve());

}

module.exports = {
  sync,
  seed,
  models: {
    Product,
    Category
  }
}
