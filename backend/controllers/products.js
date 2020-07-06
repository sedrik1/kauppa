const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.searchedProducts = (req, res) => {
  const errors = validationResult(req);

  function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  if(!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    if (req.params.query) {
      const regex = new RegExp(escapeRegex(req.params.query), 'gi');
      Product.find({
        $or: [
          { name: regex },
          { brand: regex }
        ]
      })
      .then(products => {
        if(!products) {
          return res.status(204).json({ message: 'Ei tuotteita' });
        } else {
          return res.status(201).json({ products: products });
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
};

exports.getProducts = (req, res, next) => {
  let tops = [];
  let bottoms = [];
  let apparel = [];
  Product.find()
  .then(products => {
    for(const item of products) {
      if(item.category === 'tops') {
        tops.push(item);
      } else if(item.category === 'bottoms') {
        bottoms.push(item);
      } else {
        apparel.push(item);
      }
    }
    return res.status(201).json({
      products: products,
      tops: tops,
      bottoms: bottoms,
      apparel: apparel
    });
  }).catch(err => {
    return res.status(500).json({ message: 'Jokin meni pieleen '});
  });
};

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
  .then(product => {
    if(product) {
      return res.status(200).json(product);
    } else {
      return res.status(401).json({message: 'Tuotetta ei ole'});
    }
  })
  .catch(err => {
    res.status(500).json({message: 'Jokin meni pieleen'});
  });
};
