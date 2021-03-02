const axios = require('axios');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index]);
    }
  }
  
  const get_data = async url =>{
    let response = await axios(url);
    const {data, status} = response;
    if (status >= 200 && status < 300) {
      return data
    }
    return null
  }
  
  const scrape = async shop => {
    const shoptools = require('./'+shop.brand.toLowerCase().replace(' ', ''))
    let data = await get_data(shop.link)
    let res = []
    await asyncForEach(shoptools.get_links(data, shop.link), async (l) => {
      data = await get_data(l)
      let x = shoptools.parse(data, shop.link, l)
      res = res.concat(x);
    });
    return res
  };
  
  
  module.exports = {scrape, asyncForEach}