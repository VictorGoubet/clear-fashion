const axios = require('axios');
const cheerio = require('cheerio');

const brand = 'Mud Jeans'
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-link .row')
    .map((i, element) => {
      
      const name = $(element)
        .find('.product-meta')
        .find('.product-title')
        .find('a')
        .attr('href')
        .trim()
        .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.productList-price')
          .text()
      );

      const photo = $(element)
        .find('.productList-image')
        .find('img')
        .attr('src')
      
      const link = 'https://www.dedicatedbrand.com' + $(element)
        .find('.productList-link')
        .attr('href')

      return {name, price, photo, link, brand};
    })
    .get();
};

const get_links = (data, url) =>{
  page = ['women-jeans', 'men']
  return page.forEach(x => {
    return url + '/' + x
  });
}


module.exports = {get_links, parse}
