if (process.env.NODE_ENV === "production") {
    module.exports = require('./production-db')
} else {
    module.exports = require('./dev-db')
}