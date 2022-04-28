const path = require("path")

module.exports = {
    entry: "./src/js/app.js",
    mode: "production",
    output: {
        filename: "[name].js" ,
        path: path.resolve(__dirname, "src/dist/js")
    }
}