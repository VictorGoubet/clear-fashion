// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

// current products on the page
let currentProducts = [];
let currentPagination = {};
let filtered_products = [];
let brand_filter = x => {return true};
let price_filter = x => {return true};
let date_filter = x => {return true};

// inititiate selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand = document.querySelector('#brand-select');
const recentlyReleased = document.querySelector('#recently-released');
const reasonablePrice = document.querySelector('#reasonable-price');


// Update brands choice

function update_brands_name(){
  let old_value = selectBrand.value
  selectBrand.innerHTML = '<option>all</option>';
  
  const brands_name = [];
  let my_option;
  currentProducts.forEach(article =>{
    if(!brands_name.includes(article.brand)){
      brands_name.push(article.brand)
      my_option = document.createElement('option');
      my_option.innerHTML = article.brand;
      selectBrand.appendChild(my_option);
    }
  })
  selectBrand.value = brands_name.includes(old_value)? old_value:'all';
}

const apply_all_filters = (products) =>{
  let filter = [brand_filter, date_filter, price_filter]
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
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
  update_brands_name();
  filtered_products = apply_all_filters(currentProducts)
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
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
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(filtered_products, currentPagination));
});

// Feature 1 Browse pages

selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value), currentPagination.pageSize)
    .then(setCurrentProducts)
    .then(() => render(filtered_products, currentPagination));
});

// Feature 2 brand selection

selectBrand.addEventListener('change', event => {
  brand_filter = x =>{return event.target.value=='all'? true:x.brand == event.target.value}
  filtered_products = apply_all_filters(currentProducts)
  render(filtered_products, currentPagination);
});

// Feature 3 date selection

recentlyReleased.addEventListener('change', function(){

  if(this.checked){
    date_filter = x => {return  Math.trunc((Date.now() - Date.parse(x.released)) / (1000 * 3600 * 24)) < 2*7}
  }
  else{
    date_filter = x => {return true}
  }
  filtered_products = apply_all_filters(currentProducts)
  render(filtered_products, currentPagination);
});

// Feature 4 price selection

reasonablePrice.addEventListener('change', function(){

  if(this.checked){
    price_filter = x => {return  x.price <= 50}
  }
  else{
    price_filter = x => {return true}
  }
  filtered_products = apply_all_filters(currentProducts)
  render(filtered_products, currentPagination);
});
//---------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(filtered_products, currentPagination))
);
