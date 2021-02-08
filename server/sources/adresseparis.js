const cheerio = require('cheerio');
const brand = 'ADRESSE Paris'

const parse = (data) => {
  const $ = cheerio.load(data);
  return $('.product_list .product-container')
    .map((i, element) => {
      
      const name = $(element)
        .find('.product-name')
        .attr('title')
        .trim()
        .replace(/\s/g, ' ');

      const price = parseInt(
        $(element)
          .find('.price ')
          .text()
      );

      const photo = $(element)
        .find('.product_img_link')
        .find('img')
        .attr('src')
      
      const link = $(element)
        .find('.product_img_link')
        .attr('href')

      const release = '03/02/2021'
        
      const uuid = parseInt(link.slice(-18, -5))

      return {uuid, name, price, photo, link, brand, release, "categorie":'Unisexe'};
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