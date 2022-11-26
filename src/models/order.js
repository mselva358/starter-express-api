var mongoose = require('mongoose');

var OrderSchema = mongoose.Schema({
    
});

var Order = mongoose.model('Order', OrderSchema);

module.exports = Order;