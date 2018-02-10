const conn = require('./conn');
const Sequelize = conn.Sequelize;

const Category = conn.define('category', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

Category.findOneByNameOrThrow = function(name){
  return Category.findOne({
    where: { name },
    include: [ conn.models.product ]
  })
  .then( category => {
    if(!category){
      throw { status: 404, message: 'product not found'};
    }
    return category;
  });
};

module.exports = Category;
