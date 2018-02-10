const conn = require('./conn');
const Sequelize = conn.Sequelize;
const Category = require('./Category');

const Product = conn.define('product', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

Product.generateFromForm = function(data){
  const { categoryName, productName } = data;
  const catAttr = { name: categoryName }; 
  return Category.findOne({ where: catAttr })
    .then( category => {
      if(category)
        return category;
      return Category.create(catAttr);
    })
    .then( category => {
      return Product.create({ categoryId: category.id, name: productName });
    })
    .then( product => {
      return Product.findById(product.id, {
        include: [ Category ]
      })
    });
}
module.exports = Product;
