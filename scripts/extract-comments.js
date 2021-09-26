(async () => {
  const
    fs = require('fs'),
    readline = require('readline'),
    path = require('path'),
    prependFile = require('prepend-file');

  const files = fs.readdirSync(path.join(__dirname, '../src'));

  if (files.length > 0) {
    files.map(async file => {
      const
        read = fs.createReadStream(path.join(__dirname, `../src/${file}`), { encoding: "utf8" }),
        lineReader = readline.createInterface({
          input: read
        });

      let
        comments = "",
        processComment = false;

      for await (const line of lineReader) {
        if (!processComment) {
          if (
            line.replace(/\s{1,}/g, '') === '/**' &&
            line.replace(/\s{1,}/g, '').indexOf(':') === -1 ||
            line.replace(/\s{1,}/g, '').indexOf('/*:') !== -1
          ) {
            comments += line + '\n';
            processComment = true;
          }
        } else {
          comments += line + '\n';

          if (line.replace(/\s{1,}/g, '') === '*/') {
            processComment = false;
          }
        }
      }

      prependFile(path.join(__dirname, `../dist/${file.replace('.ts', '')}.js`), `${comments}`)
        .then(() => {
          console.log('Extract Comments Success!');
        })
        .catch(err => {
          throw err;
        })
    });
  }
})();