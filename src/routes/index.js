const siteRoute = require('./site')
const productSite = require('./product')
const staffSite = require('./staff')
const customerSite = require('./customer')


function route(app) {
    app.use('/product', productSite);
    app.use('/staff', staffSite);
    app.use('/customer', customerSite);
    app.use('/', siteRoute);

    
}

module.exports = route;