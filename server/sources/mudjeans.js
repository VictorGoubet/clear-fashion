const cheerio = require('cheerio');
const brand = 'Mud Jeans'

const parse = (data, url) => {
  const $ = cheerio.load(data);
  return $('.product-link').map((i, element) => {
      const name = $(element)
        .find('.product-title')
        .find('a')
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const price =parseInt($(element)
        .find('.product-price')
        .text().slice(4, -1))

      const photo = 'https://'+$(element)
        .find('picture')
        .find('source')
        .attr('srcset')
        .split(',').pop().slice(2, -3);
      
      const link = url + $(element)
        .find('.product-title')
        .find('a')
        .attr('href');

      const release = '28/01/2021'

      const uuid = Math.floor(Math.random() * 10000000) + 1;

      return {uuid, name, price, photo, link, brand, release};
    })
    .get();
};

const get_links = (data, url) =>{
  page = ['women-jeans', 'men']
  return page.map(x => {
    return `${url}/collections/${x}`
  });
}


module.exports = {get_links, parse}
