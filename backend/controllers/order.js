const Order = require('../models/order');
const Product = require('../models/product');

exports.placeAnOrder = (req, res, next) => {

  let updatedProductQuantityCount = 0;
  let checkedProducts = 0;
  let totalPrice = 0;

  function isEquivalent(productDB, productCart) {
    if (
        productDB.category !== productCart.category ||
        productDB.price !== productCart.price ||
        productDB.brand !== productCart.brand ||
        productDB.quantity < productCart.quantity ||
        productDB.quantity !== productCart.maxQuantity ||
        !productDB.colours.includes(productCart.colours[0]) ||
        !productDB.sizes.includes(productCart.sizes[0])
      ) {
        return false;
    } else {
      checkedProducts++;
      return true;
    }
  }

  (function() {
    let sortedProductsArray = [];
    let finalised = 'init';
    Product.find()
    .then(() => {
      for(const element of req.body.orderProducts) {
        Product.findById(element._id)
        .then(prod => {
          if(isEquivalent(prod, element)) {
            let sortedProducts = {
              _id: prod._id,
              category: prod.category,
              name: prod.name,
              brand: prod.brand,
              quantity: element.quantity,
              price: prod.price,
              sizes: element.sizes[0],
              colours: element.colours[0]
            };
            sortedProductsArray.push(sortedProducts);
            totalPrice += prod.price * element.quantity;
            const order = new Order({
              customerId: req.body.customerId,
              totalPrice: totalPrice,
              products: sortedProductsArray
            });
            if(req.body.orderProducts.length === checkedProducts) {
              order.save();
              finalised = order;
            }
          } else {
            return false;
          }
          console.log('täällä', finalised);
          return finalised;
        })
        .catch(err => {
          console.log(err);
          return false;
        });
      }
    })
    .then((finalised) => {
      console.log('alku', finalised);
      for(const element of req.body.orderProducts) {
        Product.findByIdAndUpdate(
          { _id: element._id },
          { quantity: element.maxQuantity - element.quantity },
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              updatedProductQuantityCount++;
              if(req.body.orderProducts.length === updatedProductQuantityCount) {
                console.log('TK', finalised);
                res.status(201).json(
                  { message: 'Tilaus käsitelty' }
                );
              }
            }
          }
        );
      }
      console.log('loppu', finalised);
    })
    .catch(err => {
      console.log(err);
      return false;
    });
  }());

};

exports.getOrders = (req, res, next) => {
  Order.find( { customerId: req.body.customerId } )
  .then(orders => {
    if(!orders) {
      return res.status(204).json({ message: 'Ei tilauksia' });
    } else {
      return res.status(201).json({ orders: orders });
    }
  })
  .catch(err => {
    console.log(err);
    return false;
  });
};


/* TOIMII ÄLÄ POISTA
  let updatedProductQuantityCount = 0;
  let checkedProducts = 0;
  let totalPrice = 0;

  function isEquivalent(productDB, productCart) {
  if (
      productDB.category !== productCart.category ||
      productDB.price !== productCart.price ||
      productDB.brand !== productCart.brand ||
      productDB.quantity < productCart.quantity ||
      productDB.quantity !== productCart.maxQuantity ||
      !productDB.colours.includes(productCart.colours[0]) ||
      !productDB.sizes.includes(productCart.sizes[0])
    ) {
      return false;
  } else {
    checkedProducts++;
    return true;
  }
}

(function() {
  let sortedProductsArray = [];
  let finalised = 'init';
  Product.find()
  .then(() => {
    for(const element of req.body.orderProducts) {
      Product.findById(element._id)
      .then(prod => {
        if(isEquivalent(prod, element)) {
          let sortedProducts = {
            _id: prod._id,
            category: prod.category,
            name: prod.name,
            brand: prod.brand,
            quantity: element.quantity,
            price: prod.price,
            sizes: element.sizes[0],
            colours: element.colours[0]
          };
          sortedProductsArray.push(sortedProducts);
          totalPrice += prod.price * element.quantity;
          const order = new Order({
            customerId: req.body.customerId,
            totalPrice: totalPrice,
            products: sortedProductsArray
          });
          if(req.body.orderProducts.length === checkedProducts) {
            order.save();
          }
        } else {
          finalised = 'Tilauksen käsittelyssä tapahtui virhe';
        }
        console.log('tääläl', finalised);
        return finalised;
      })
      .catch(err => {
        console.log(err);
      });
    }
  })
  .then((finalised) => {
    console.log('alku', finalised);
    for(const element of req.body.orderProducts) {
      Product.findByIdAndUpdate(
        { _id: element._id },
        { quantity: element.maxQuantity - element.quantity },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            updatedProductQuantityCount++;
            if(req.body.orderProducts.length === updatedProductQuantityCount) {
              console.log('TK', finalised);
              res.status(201).json(
                { message: 'Tilaus käsitelty' }
              );
            }
          }
        }
      );
    }
    console.log('loppu', finalised);
    console.log('loppu');
  })
  .catch(err => {
    console.log(err);
  });
}()); */
