
const cheerio = require('cheerio');
const brand = 'Dedicated'

const parse = (data, url) => {
  const $ = cheerio.load(data);
  return $('.productList-container .productList')
    .map((i, element) => {
      
      const name = $(element)
        .find('.productList-title')
        .text()
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
      
      const link = url + $(element)
        .find('.productList-link')
        .attr('href').slice(4)

      const uuid = $(element)
          .find('a')
          .attr('data-id')
        
      const release = '03/02/2021'

      return {uuid, name, price, photo, link, brand, release};
    })
    .get();
};


const get_links = (data, url) =>{
  const $ = cheerio.load(data);
  let res = []
  const toInclude = ['men', 'kids']
  const notToInclude = ['sale', 'news']
  return $('.mainNavigation-link-subMenu-link').map((i, element) => {
    const l = url + $(element).find('a').attr('href').slice(4)
    if(!notToInclude.some(x => l.includes(x)) && toInclude.some(x => l.includes(x))){
      return `${l}#page=1000`
    }
  })
}

module.exports = {get_links, parse}
