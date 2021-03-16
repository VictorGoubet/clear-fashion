'use strict';

// current products on the page
var currentBrand = 'all';
var currentCategorie = "all";
let currentProducts = [];
let currentPagination = {};
let filtered_products = [];
let brand_filter = x => true;
let reasonable_filter = x => true;
let recent_filter = x => true;
let favoris_filter = x => true;
let sexe_filter = x => true;
var totalRes = 0;


// inititiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const spanNbNewProducts = document.querySelector('#nbNewProducts');
const selectBrand = document.querySelector('#brand-select');
const selectSexe = document.querySelector('#sexe-select');
const selectSort = document.querySelector('#sort-select');
const recentlyReleased = document.querySelector('#recently-released');
const reasonablePrice = document.querySelector('#reasonable-price');
const spanP50 = document.querySelector('#p50');
const spanP90 = document.querySelector('#p90');
const spanP95 = document.querySelector('#p95');
const spanLastRelease = document.querySelector('#last-release');

let select = [selectShow, selectPage, selectBrand, selectSexe, selectSort, recentlyReleased, reasonablePrice]


const apply_all_filters = (products) =>{
  let filter = [brand_filter, reasonable_filter, recent_filter, favoris_filter, sexe_filter]
  filter.forEach(f =>{
    products = products.filter(f)
  })
  return products
}

/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({data, meta}) => {
  currentProducts = data;
  currentPagination = {currentPage:meta.currentPage, pageSize:meta.pageSize};
  currentBrand = meta.currentBrand;
  currentCategorie = meta.currentCategorie
  filtered_products = apply_all_filters(currentProducts)
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12, brand="all", categorie="all") => {
  try {
    const l = (`https://clear-fashion-server.vercel.app/products/search?limit=${size*page}`+(brand=="all"?"":`&brand=${brand}`)+(categorie=="all"?"":`&categorie=${categorie}`))
    const response = await fetch(l);
    const body = await response.json();
    const data = body.results.slice(-size);
    totalRes = body.TotalNumberOfProducts
    const meta = {currentPage:page, pageSize:size, currentBrand:brand, currentCategorie:categorie};
    return {data, meta};

  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = (products) => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      let favoris = JSON.parse(localStorage.getItem('favoris'))
      let content = favoris!=null?(favoris.filter(x => x.uuid == product.uuid).length>0?'⭕':'⭐'):'⭐';
      let url = product.photo.includes('https:')? product.photo:'https:'+product.photo;
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand.charAt(0).toUpperCase() + product.brand.slice(1)}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}€</span>
        <a href="${product.link}"><img class='imgPrdt' src=${url}></a>
        <button onclick="addFavoris('${product.uuid}','${content}')">${content}</button>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<span class="title-pattern">Products</span>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageSize} = pagination;
  const pageN = Math.trunc(totalRes / pageSize) +1;
  const options = []
  for(let i=1; i<=pageN; i++){
      options.push(`<option value="${i}">${i}</option>`) 
  }

  selectPage.innerHTML = options.join('');
  selectPage.selectedIndex = currentPage - 1;
};

 const compute_pk = k =>{
   let tab = [...filtered_products].sort((a, b) => sort_price(a, b, 1));
   let index = Math.trunc(k/100 * tab.length)
   return tab[index].price
 }

const renderIndicators = pagination => {
  select.forEach(x=>{
    x.disabled = false;
  })

  if(filtered_products.length>0){
    spanP50.innerHTML = compute_pk(50)+'€';
    spanP90.innerHTML = compute_pk(90)+'€';
    spanP95.innerHTML = compute_pk(95)+'€';
    spanLastRelease.innerHTML = [...filtered_products].sort((a, b) => sort_date(a, b, -1))[0].release;
    spanNbNewProducts.innerHTML = filtered_products.reduce((total, x) => total+(Math.trunc((Date.now() - Date.parse(x.release)) / (1000 * 3600 * 24)) < 2*7?1:0), 0);
    spanNbProducts.innerHTML = filtered_products.length;
  }
  else{
    spanP50.innerHTML = 0
    spanP90.innerHTML = 0
    spanP95.innerHTML = 0
    spanLastRelease.innerHTML = '----'
    spanNbNewProducts.innerHTML = 0
    spanNbProducts.innerHTML = 0
  }
  
};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value), currentBrand, currentCategorie)
    .then(setCurrentProducts)
    .then(() => render(filtered_products, currentPagination));
});

// Feature 1 Browse pages

selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), currentPagination.pageSize, currentBrand, currentCategorie)
    .then(setCurrentProducts)
    .then(() => render(filtered_products, currentPagination));
});

// Feature 2 brand selection

selectBrand.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize, event.target.value, currentCategorie)
    .then(setCurrentProducts)
    .then(() => render(filtered_products, currentPagination));
});


// feature bonus Sexe selection
selectSexe.addEventListener('change', event => {
  fetchProducts(currentPagination.currentPage, currentPagination.pageSize, currentBrand, event.target.value)
    .then(setCurrentProducts)
    .then(() => render(filtered_products, currentPagination));
});

// Feature 3 date selection

recentlyReleased.addEventListener('change', function(){

  if(this.checked){
    recent_filter = x => {return  Math.trunc((Date.now() - Date.parse(x.release)) / (1000 * 3600 * 24)) < 2*7}
  }
  else{
    recent_filter = x => true
  }
  filtered_products = apply_all_filters(currentProducts)
  render(filtered_products, currentPagination);
});

// Feature 4 price selection

reasonablePrice.addEventListener('change', function(){

  if(this.checked){
    reasonable_filter = x => {return x.price <= 50};
  }
  else{
    reasonable_filter = x => true;
  }
  filtered_products = apply_all_filters(currentProducts)
  render(filtered_products, currentPagination);
});

// Feature 5-6 price selection

function sort_price(a, b, order){
  return (a.price > b.price) ? order : ((b.price > a.price) ? -order : 0);
}

function sort_date(a, b, order){
  a = Date.parse(a.release);
  b = Date.parse(b.release);
  return (a > b) ? order : ((b > a) ? -order : 0);
}

selectSort.addEventListener('change', event=>{

  switch(event.target.value){
    case 'price-desc':
      currentProducts = [...currentProducts].sort((a, b) => sort_price(a, b, -1));
      break;
    case 'price-asc':
      currentProducts = [...currentProducts].sort((a, b) => sort_price(a, b, 1));
      break;
    case 'date-desc':
      currentProducts = [...currentProducts].sort((a, b) => sort_date(a, b, 1));
      break;
    case 'date-asc':
      currentProducts = [...currentProducts].sort((a, b) => sort_date(a, b, -1));
      break;
  }

  filtered_products = apply_all_filters(currentProducts)
  render(filtered_products, currentPagination);
});


// Feature 12 favoris

const DispForFav = ()=>{
  sectionProducts.innerHTML = `<span class="title-pattern">Favoris</span>` + sectionProducts.innerHTML.slice(43);
  select.forEach(x=>{
    x.disabled = true;
  })
}

function addFavoris(id, content){
  let x = filtered_products.filter(x => x.uuid == id)[0]
  let favoris = JSON.parse(localStorage.getItem('favoris'))
  
  if(favoris == null){
    localStorage.setItem('favoris', JSON.stringify([x]));
  }
  else if(favoris.filter(x => x.uuid == id).length==0){
    favoris.push(x);
    localStorage.setItem('favoris', JSON.stringify(favoris));
  }
  else{
    favoris = favoris.filter(x => x.uuid != id)
    localStorage.setItem('favoris', JSON.stringify(favoris));
  }
  x = select[0].disabled
  render(filtered_products, currentPagination);
  if(x){
    DispForFav()
    showFav()
  }
}


// Feature 13: filter favoris 


const getAllFav = async (fav)=>{
  let res = []
  if(fav !=null){
    res = await Promise.all(
      fav.map(async x=>{
      let p = await fetch(`https://clear-fashion-server.vercel.app/products/${x.uuid}`);
      p = await p.json();
      return p[0]
    }))
  }
  return res
}

async function showFav(){
  let favoris = JSON.parse(localStorage.getItem('favoris'))
  filtered_products = await getAllFav(favoris)
  render(filtered_products, currentPagination);
  DispForFav();
  
};

function showAllProd(){
  filtered_products = apply_all_filters(currentProducts);
  render(filtered_products, currentPagination);
}


//---------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
  .then(setCurrentProducts)
  .then(() => render(filtered_products, currentPagination))
);



