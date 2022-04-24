const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const history = require('connect-history-api-fallback');
const port = process.env.port || '3000'; // not actually needed to be normalized
app.set('port', port);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log('server is running');
});

app.use('/api', require('./routes'));
app.use(history());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
  });
}
app.use(express.static(path.join(__dirname, 'dist')));
module.exports = app;
