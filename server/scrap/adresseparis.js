const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');
const brand = 'ADRESSE Paris'


const parse = data => {
  const $ = cheerio.load(data);

  return $('ul.product_list.grid.row .product-container')
    .map((i, element) => {
      const name = $(element)
        .find('.product-name').attr('title')
        .trim()
        .replace(/\s/g, ' ');
      const price = parseInt(
        $(element)
          .find('.price.product-price')
          .text()
      );
      const photo = $(element)
        .find('.product_img_link img')
        .attr('data-original');

      const link = $(element)
        .find('.product-name')
        .attr('href');

      const uuid = uuidv5(link, uuidv5.URL);
      const _id = uuid;
      const release = (new Date).toLocaleDateString();

      return {uuid, _id, name, price, photo, link, brand, release, "categorie":'Unisexe'};
    })
    .get();
};



const get_links = (data, url) =>{
  return [url]
}

module.exports = {get_links, parse}