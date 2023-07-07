const favouritesBtn = document.getElementById("favouritesBtn");
const cartBtn = document.getElementById("cartBtn");
const favourites = document.getElementById("fav");
const cart = document.getElementById("cart");
const cartnum = document.getElementById("cartnum");
const favnum = document.getElementById("favnum");
const resetBtn = document.querySelector(".reset");
const showFilters = document.getElementById("showFilters");
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");
let products = [];

favouritesBtn.addEventListener("click", showFavourites);
cartBtn.addEventListener("click", showCart);
showFilters.addEventListener("click", () => {
  modal.style.display = "block";
});
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

allProducts();
showProducts();
/////////////////GET DATA
async function allProducts() {
  try {
    const response = await axios.get("assets/data/makeup.json");
    showProducts(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
////////////////SHOW DATA
function showProducts(data) {
  if (!data || data.length === 0) {
    console.log("No products found.");
    return;
  }

  products = data;
  let html = "";
  let cart;
  let favourites;
  const localStorageCart = localStorage.getItem("cart");
  const localStorageFav = localStorage.getItem("favourites");

  //////////SET LOCAL STORAGE
  if (localStorageCart) {
    cart = JSON.parse(localStorageCart);
  } else {
    cart = [];
  }

  if (localStorageFav) {
    favourites = JSON.parse(localStorageFav);
  } else {
    favourites = [];
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("favourites", JSON.stringify(favourites));

  renderCart();
  renderFavourites();
  renderFilters();

  //////////////////////////RENDER PRODUCTS
  products.forEach((element) => {
    html +=
      `<div class="product">
    <div class="product-item" id="img">
      <img
        src="${element.image_link}"
        alt="img"
      />
    </div>
    <div id="title">
      <div class="product-item" id="name">${element.name}</div>
      <div class="favv" title="Add to Favorites" data-id="${element.id}" ><button><i class="fa-regular fa-heart fa-2xl"></i></button>
       </div>
    </div>
    <div class="product-item" id="brand">${element.brand}</div>
    <div class="product-item" id="description">
    ${element.description}
    </div>
    <div class="product-item" id="price">${element.price_sign}` +
      `${element.price}</div>
    <div class="product-item add" data-id="${element.id}"><button>Add to cart</button></div>
  </div>`;
  });
  document.getElementById("main").innerHTML = html;

  ////////////////////////AFTER RENDERING PRODUCTS
  const btnAddToCart = document.querySelectorAll(".add");
  const btnAddToFav = document.querySelectorAll(".favv");
  const brandElements = document.querySelectorAll(".brands");
  const typeElements = document.querySelectorAll(".types");

  //////////LISTENERS
  btnAddToCart.forEach((element) => {
    element.addEventListener("click", addToCart);
  });

  btnAddToFav.forEach((element) => {
    element.addEventListener("click", addToFav);
  });

  brandElements.forEach(function (element) {
    element.addEventListener("change", showFilteredProducts);
  });

  typeElements.forEach(function (element) {
    element.addEventListener("change", showFilteredProducts);
  });

  resetBtn.addEventListener("click", reset);

  /////////////////////////FUNCTIONS

  function addToCart() {
    let id = this.dataset.id;
    let item = {
      id: id,
      quantity: 1,
    };

    if (cart.some((elem) => elem.id == id)) {
      cart.find((element) => element.id == id).quantity++;
    } else {
      cart.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();
    cartNum();
  }

  function cartNum() {
    let c = JSON.parse(localStorage.cart);
    let cartn = c.length;

    if (cartn > 0) {
      cartnum.style.display = "flex";
    }
    cartnum.innerHTML = cartn;
  }

  function favNum() {
    let f = JSON.parse(localStorage.favourites);
    let favn = f.length;
    if (favn > 0) {
      favnum.style.display = "flex";
    }
    favnum.innerHTML = favn;
  }

  function renderCart() {
    let renderCarts = document.getElementById("cart");
    let html = "";

    if (cart.length > 0) {
      let newPrice = 0;
      let totalPrice = 0;
     
      cart.forEach((element) => {
        let id = products.filter((elem) => elem.id == element.id)[0].id;
        let img = products.filter((elem) => elem.id == element.id)[0]
          .image_link;
        let name = products.filter((elem) => elem.id == element.id)[0].name;
        let brand = products.filter((elem) => elem.id == element.id)[0].brand;
        let price = products.filter((elem) => elem.id == element.id)[0].price;
        let priceSign = products.filter((elem) => elem.id == element.id)[0]
          .price_sign;
        newPrice = parseInt(element.quantity) * parseFloat(price);
        totalPrice = totalPrice + parseFloat(newPrice);

        html += `<div class="cart">
<div class="favPh favv cartIt"><img src="${img}" alt="" /></div>
<div class="favName favv cartIt">
  <div class="fav1">${name}</div>
  <div class="fav2"></div>
  ${brand}
</div>
<div class="favPrice cartI">${priceSign}${price} </div>
<div class"cartI"> <input type="number" value="${element.quantity}" min="1" class="quantity" data-id="${id}" ></div>
<div class="newPrice cartI">${priceSign}${newPrice} </div>
<div class="favDel cartIt" data-id="${id}"><button >Delete</button></div>
</div>`;
      });
      html += `   <div id="total">TOTAL: $${totalPrice}</div>
<div id="buy"><button>BUY</button></div>
<div class="remove favDel" id="removeCart" data-id="-1"><button>Remove all</button></div>`;
      renderCarts.innerHTML = html;

      document
        .querySelectorAll(".quantity")
        .forEach((elem) => elem.addEventListener("change", updateQuantity));

      const deleteCartItem = document.querySelectorAll(".favDel");
      deleteCartItem.forEach((elem) =>
        elem.addEventListener("click", deleteCart)
      );
    } else {
      renderCarts.innerHTML = "No items";
    }
    cartNum();
  }

  function addToFav() {
    this.innerHTML = `<i class="fa-solid fa-heart fa-xl" title="Added"></i>`;

    let id = this.dataset.id;
    let item = {
      id: id,
      quantity: 1,
    };

    if (favourites.some((elem) => elem.id == id)) {
      favourites.find((element) => element.id == id).quantity++;
    } else {
      favourites.push(item);
    }
    // localStorage.setItem("favourites", JSON.stringify(favourites));

    renderFavourites();
    favNum();
  }

  function renderFavourites() {
    let renderfav = document.getElementById("fav");
    let html = "";

    if (favourites.length > 0) {
      favourites.forEach((element) => {
        let id = products.filter((elem) => elem.id == element.id)[0].id;
        let img = products.filter((elem) => elem.id == element.id)[0]
          .image_link;
        let name = products.filter((elem) => elem.id == element.id)[0].name;
        let brand = products.filter((elem) => elem.id == element.id)[0].brand;
        let price = products.filter((elem) => elem.id == element.id)[0].price;
        let priceSign = products.filter((elem) => elem.id == element.id)[0]
          .price_sign;

        html += `<div class="fav">
<div class="favPh favv"><img src="${img}" alt="" /></div>
<div class="favName favv">
  <div class="fav1">${name}</div>
  <div class="fav2"></div>
  ${brand}
</div>
<div class="favPrice">${priceSign}${price} </div>
<div class="favAdd" data-id="${id}"><button>Add to cart</button></div>
<div class="favDel" data-id="${id}"><button>Delete</button></div>
</div>`;
      });
      html += `<div class="remove favDel" data-id="-1"><button>Remove all</button></div>`;
      renderfav.innerHTML = html;

      const addItemToCart = document.querySelectorAll(".favAdd");
      addItemToCart.forEach((elem) =>
        elem.addEventListener("click", moveToCart)
      );

      const deleteFavItem = document.querySelectorAll(".favDel");
      deleteFavItem.forEach((elem) =>
        elem.addEventListener("click", deleteFav)
      );
    } else {
      renderfav.innerHTML = "No items";
    }
    favNum();

    localStorage.setItem("favourites", JSON.stringify(favourites));
  }

  function moveToCart() {
    let id = this.dataset.id;
    let item = {
      id: id,
      quantity: 1,
    };
    if (cart.some((elem) => elem.id == id)) {
      cart.find((element) => element.id == id).quantity++;
    } else {
      cart.push(item);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    favourites = favourites.filter((element) => element.id != id);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    renderFavourites();
    cartNum();
    favNum();
  }

  function deleteFav() {
    let id = this.dataset.id;
    favourites = favourites.filter((element) => element.id != id);
    if (id == -1) {
      favourites = [];
    }
    localStorage.setItem("favourites", JSON.stringify(favourites));
    favNum();
    renderFavourites();
  }

  function deleteCart() {
    let id = this.dataset.id;
    cart = cart.filter((element) => element.id != id);
    if (id == -1) {
      cart = [];
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    cartNum();
    renderCart();
  }

  function updateQuantity() {
    let id = this.dataset.id;
    if (cart.some((elem) => elem.id == id)) {
      cart.find((elem) => elem.id == id).quantity = this.value;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  }
  ////////////////////////FILTERS
  function renderFilters() {
    let brands = [];
    let type = [];

    let html = `<div class="filterBy">Brands:</div>`;
    let htmll = ` <div class="filterBy">Product type:</div>`;
    products.forEach((element) => {
      if (!brands.includes(element.brand)) {
        brands.push(element.brand);
      }
    });

    brands.forEach((element) => {
      html += ` <li><label for="${element}"><input type="checkbox" class="brands" name="brand" id="${element}"  data-id="${element}"> ${element}</label></li>`;
      document.getElementById("filters").innerHTML = html;
    });

    products.forEach((element) => {
      if (!type.includes(element.product_type)) {
        type.push(element.product_type);
      }
    });

    type.forEach((element) => {
      htmll += ` <li><label for="${element}"><input type="checkbox" class="types" name="type" id="${element}"  data-id="${element}"> ${element}</label></li>`;
      document.getElementById("filtersType").innerHTML = htmll;
    });
  }

  function showFilteredProducts() {
    let selectedBrands = Array.from(
      document.querySelectorAll(".brands:checked")
    ).map((checkbox) => checkbox.dataset.id);
    let selectedTypes = Array.from(
      document.querySelectorAll(".types:checked")
    ).map((checkbox) => checkbox.dataset.id);
    console.log(selectedBrands);
    let filteredProducts = [];
    if (selectedBrands.length > 0 && selectedTypes.length > 0) {
      filteredProducts = products.filter(
        (product) =>
          selectedBrands.includes(product.brand) &&
          selectedTypes.includes(product.product_type)
      );
    } else if (selectedBrands.length > 0) {
      filteredProducts = products.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    } else if (selectedTypes.length > 0) {
      filteredProducts = products.filter((product) =>
        selectedTypes.includes(product.product_type)
      );
    }
    let html = "";
    filteredProducts.forEach((element) => {
      html +=
        `<div class="product">
      <div class="product-item" id="img">
        <img
          src="${element.image_link}"
          alt="img"
        />
      </div>
      <div id="title">
        <div class="product-item" id="name">${element.name}</div>
        <div class="favv" data-id="${element.id}" ><button><i class="fa-regular fa-heart fa-2xl"></i></button>
         </div>
      </div>
      <div class="product-item" id="brand">${element.brand}</div>
      <div class="product-item" id="description">
      ${element.description}
      </div>
      <div class="product-item" id="price">${element.price_sign}` +
        `${element.price}</div>
      <div class="product-item add" data-id="${element.id}"><button>Add to cart</button></div>
    </div>`;
    });

    document.getElementById("main").innerHTML = html;
  }
  function reset() {
    allProducts();
    showProducts();
    renderFilters();
  }
}
///////////////////////////////MODALS
function showFavourites() {
  if (favourites.style.display == "flex") {
    favourites.style.display = "none";
  } else {
    favourites.style.display = "flex";
  }
  if (cart.style.display == "flex") {
    cart.style.display = "none";
  }
}

function showCart() {
  if (favourites.style.display == "flex") {
    favourites.style.display = "none";
  }
  if (cart.style.display == "flex") {
    cart.style.display = "none";
  } else {
    cart.style.display = "flex";
  }
}
