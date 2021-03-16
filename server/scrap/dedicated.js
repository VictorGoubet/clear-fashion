
const cheerio = require('cheerio');
const brand = 'Dedicated'

const parse = (data, url) => {
  ctg = data['filter']['categories']

  return data['products'].map(x =>{
    if(x!=undefined && x.length!= 0){
     return  {'uuid': x['uid'],
              '_id':  x['uid'],
              'name': x['name'],
              'price': x['price']['priceAsNumber'],
              'photo': x['image'][0],
              'link': url+x['canonicalUri'],
              'brand': brand,
              'release':(new Date).toLocaleDateString(),
              'categorie':ctg['men'].includes(x['id'])? 'Men':ctg['women'].includes(x['id'])?'Women':"Kids"
            }
    } 
  })
};


const get_links = (data, url) =>{
  return [url + 'loadfilter']
}


module.exports = {get_links, parse}



