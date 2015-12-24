var path = require('path'),
    express = require('express'),
    webpack = require('webpack'),
    config = require('./webpack.config'),
    app = express(),
    compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  // noInfo: true,
  stats: {
    colors: true
  },
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, 'localhost', function(err) {
  if (err) {
    return console.err(err);
  }
});
