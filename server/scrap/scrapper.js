const axios = require('axios');
  
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

  let promises = [];
  shoptools.get_links(data, shop.link).forEach(x=>{
    promises.push(
      new Promise(async (resolve, _)=>{
        let data = await get_data(x)
        resolve(shoptools.parse(data, shop.link, x))
      })
    )
  })
  let res = await Promise.all(promises)
  res = res.flat()
  return res
};


module.exports = scrape