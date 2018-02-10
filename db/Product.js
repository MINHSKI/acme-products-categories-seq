const conn = require('./conn');
const Sequelize = conn.Sequelize;

const Product = conn.define('product', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

Product.findAllWithCategories = function(){
  return this.findAll({
    include: [ conn.models.category ]
  });
}

Product.generateFromForm = function(data){
  const { categoryName, productName } = data;
  const catAttr = { name: categoryName }; 
  return conn.models.category.findOne({ where: catAttr })
    .then( category => {
      if(category)
        return category;
      return conn.models.category.create(catAttr);
    })
    .then( category => {
      return Product.create({ categoryId: category.id, name: productName });
    })
    .then( product => {
      return Product.findById(product.id, {
        include: [ conn.models.category ]
      })
    });
}

Product.findByIdAndDestroy = function(id){
  let product;
  return Product.findById(id, {
    include: [ conn.models.category ]
  })
  .then( _product => {
    product = _product;
    return product.destroy();
  })
  .then( ()=> product );
}

module.exports = Product;
