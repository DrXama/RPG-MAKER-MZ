var path = require('path');
var glob = require('glob');

module.exports = {
    mode: "production",
    target: "node",
    entry: glob.sync('./src/**/**.ts').reduce(function (obj, el) {
        obj["@babel/polyfill", path.parse(el).name] = el;
        return obj
    }, {}),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    module: {
        rules: [{
            // Include ts, tsx, js, and jsx files.
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
        }],
    },
    watch: true,
};
