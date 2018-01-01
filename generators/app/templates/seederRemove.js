'use strict';

const fs = require('fs');

fs.unlink('app/seeds/seedData.json', function (err) {
  if (err) {
    console.warn(err);
  }
  console.info('seed file deleted successfully');
  process.exit(0);
});
