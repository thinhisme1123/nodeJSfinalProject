const siteRoute = require('./site')
const productSite = require('./product')


function route(app) {
    app.use('/product', productSite);
    app.use('/product', productSite);

    app.use('/', siteRoute);

    
}

module.exports = route;