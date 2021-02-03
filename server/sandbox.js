/* eslint-disable no-console, no-process-exit */
const scrapper = require('./sources/scrapper')
const eshop = require('./brands.json');

async function sandbox(eshop) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop.brand} source`);
    const products = await scrapper.scrape(eshop);
    /*
    products.forEach(p =>{
      if(products.filter(x => x.uuid == p.uuid).length>2){
        console.log(p)
      }
    })*/
    //console.log(products, products.length);
    console.log('done');
    process.exit(0);

  } catch (e) {
    //console.error(e);
    process.exit(1);
  }
}

sandbox(eshop[0])

/*
eshop.forEach(x => {
  sandbox(x);
})
*/



