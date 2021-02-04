
const scrapper = require('./sources/scrapper')
const eshop = require('./brands.json');

function sandbox(eshop) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop.brand} source`);
    return scrapper.scrape(eshop);
  } 
  catch (e) {
    console.log(e)
    return [];
  }
}

function del_doublons(tab){
  let new_tab = []
  tab.forEach(a=>{
    if(new_tab.filter(x => x.uuid == a.uuid).length==0){
      new_tab.push(a)
    }
  })
  return new_tab
}


const start = async () => {
  let all_products = []
  await scrapper.asyncForEach(eshop, async s =>{
    all_products = all_products.concat(await sandbox(s))
  })
  all_products = del_doublons(all_products)
  console.log('Number of scraped products: ' + all_products.length)

}

start()








