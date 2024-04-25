const fs = require('fs');

const http = require('http');

const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplates');

//////////////////////////////// Blocking synchronous way of reading and writing files
// const testIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(testIn);
// const textOut = `This is what we know about the avocado ${testIn}.\n Created on ${Date.now()}`;
// console.log(textOut);
// fs.writeFileSync('./txt/ouput.txt', textOut);
// console.log('File Written');

// const textAy = `Ayor is now a backend developer and he did this: ${testIn}.`;
// fs.writeFileSync('./txt/ay.text', textAy);
// console.log('Writen by Ay');

//////////////////////////////// NON-blocking asynchronous way of reading and writing files
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR');
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your files has been written');
//       });
//     });
//   });
// });

// console.log('Will read file');

/////////////////////////////////////////// CREATING A SIMPLE WEB SERVER

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardsHtml = dataObject.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // PRODUCT page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // NOT found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
