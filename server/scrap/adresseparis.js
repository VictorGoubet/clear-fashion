const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');
const brand = 'ADRESSE Paris'

const parse = (data) => {
  const $ = cheerio.load(data);
  return $('.product-container .product_list')
    .map((i, element) => {
      const name = $(element)
        .find('.product_img_link')
        .attr("title")
        .trim()
        .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.price ')
          .text()
      );

      const photo = $(element)
        .find('.product_img_link')
        .find('.img_1e')
        .attr('data-original')
      
      const link = $(element)
        .find('.quick-view')
        .attr('rel')


      const release = '03/02/2021'
      
      const uuid = uuidv5(link, uuidv5.URL);
      const _id = uuid;

      return {uuid, _id, name, price, photo, link, brand, release, "categorie":'Unisexe'};
    })
    .get();
};


const get_links = (data, url) =>{
  const $ = cheerio.load(data);
  const num = $('.pagination li:nth-last-child(2)').find('a').attr('href').slice(-1)
  res = []
  for(i=1; i<=parseInt(num); i++){
    res.push(`${url}?p=${i}`)
  }
  return res
}

module.exports = {get_links, parse}