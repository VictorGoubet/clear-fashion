const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');
const brand = 'Mud Jeans'

const parse = (data, global_url, url) => {
  ctg = url.includes('women')?'Women':'Men'
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
      
      const link = global_url + $(element)
        .find('.product-title')
        .find('a')
        .attr('href');

      const release = (new Date).toLocaleDateString();

      const uuid = uuidv5(photo, uuidv5.URL);
      const _id = uuid;

      return {uuid, _id, name, price, photo, link, brand, release, 'categorie':ctg};
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
