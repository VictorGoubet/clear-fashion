
const scrapper = require('./scrapper')
const eshop = require('./brands.json');

function getScrape(eshop) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop.brand} source`);
    return scrapper(eshop);
  } 
  catch (e) {
    console.log(e)
    return [];
  }
}

function del_doublons(tab){
  let new_tab = []
  tab.forEach(a=>{
    if(a!=undefined && new_tab.filter(x => x.uuid == a.uuid || x.photo==a.photo).length==0){
      new_tab.push(a)
    }
  })
  return new_tab
}


const start = async()=>{
  let promises = eshop.map(getScrape);
  let all_products = await Promise.all(promises)
  
  all_products = all_products.flat()
  all_products = del_doublons(all_products)
  console.log('Number of scraped products: ' + all_products.length)
  return all_products
}

module.exports = start