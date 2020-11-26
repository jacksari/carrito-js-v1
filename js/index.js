const CART_PRODUCT = "cartProductsID";

document.addEventListener("DOMContentLoaded", ()=> {
    loadProduct();
    loadProductCart();
});

function getProductsDb(){
    const url = '../dbProducts.json';
    return fetch(url).then( resp => {
        return resp.json()
    }).then(result => {
        return result
    }).catch(e => console.log(e))
}

async function loadProduct(){
    const products = await getProductsDb();
    console.log(products)
    let html = '';
    products.forEach(product => {
        html += `
            <div class="col-3 product-container">
                <div class="card product">
                    <img class="card-img-top" src="${product.image}" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.extraInfo}</p>
                        <p class="card-text">${product.price} $/Unidad</p>
                        <button type="button" class="btn btn-outline-primary btn-cart" onclick="addProductCart(${product.id})">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        
        `
    });
    document.getElementsByClassName('products')[0].innerHTML = html;
}


function openCloseCart(){
    const containerCartProducts = document.getElementsByClassName('cart-products')[0]
    //console.log(containerCartProducts.classList)
    containerCartProducts.classList.forEach(item => {
        if(item === 'hidden'){
            containerCartProducts.classList.remove('hidden');
            containerCartProducts.classList.add('active');
        }
        if(item === 'active'){
            containerCartProducts.classList.remove('active');
            containerCartProducts.classList.add('hidden');
        }
    })

    //console.log(btnCart)
}

function addProductCart(id){
    let arrayProduct = [];

    let localStorageItems = localStorage.getItem(CART_PRODUCT);
    if(localStorageItems === null){
        arrayProduct.push(id);
        localStorage.setItem(CART_PRODUCT,arrayProduct);
    }else{
        let productsId = localStorage.getItem(CART_PRODUCT);
        if(productsId.length > 0){
            productsId += ','+id
        }else{
            productsId = id
        }
        localStorage.setItem(CART_PRODUCT, productsId);
        //console.log('ya hay contenido')
    }
    //console.log('añadiendo: ', id)
    loadProductCart()
}

async function loadProductCart(){
    const productsStorage = localStorage.getItem(CART_PRODUCT);
    const products = await getProductsDb();
    let html = '';
    if(!productsStorage){
        html = `
            <div class="cart-product empty">
                <p>Carrito vacío</p>
            </div>
        `
    }else {
        const idProductSplit = productsStorage.split(',');
        //Eliminar id duplicados
        const idProductsCart = Array.from(new Set(idProductSplit));
        idProductsCart.forEach(id => {
            products.forEach(product => {
                if(id == product.id){
                    const cantidad = countDuplicateId(id,idProductSplit);
                    const total = cantidad * product.price;
                    html += `
                    <div class="cart-product">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="cart-product-info">
                            <span class="quantity">${cantidad}</span>
                            <p>${product.name}</p>
                            <p>${total.toFixed(2)}</p>
                            <p class="change-quantity">
                                <button onclick="decrementarProduct(${product.id})">-</button>
                                <button onclick="incrementProduct(${product.id})">+</button>
                            </p>
                            <p class="cart-product-delete">
                                <button onclick="deleteProductCart(${product.id})">Eliminar</button>
                            </p>
                        </div>
                    </div>
                `;
                }
            });
        });
    }

    document.getElementsByClassName('cart-products')[0].innerHTML = html;
    //console.log(idProductsCart)

}

function deleteProductCart(idProduct){
    const idProductsCart = localStorage.getItem(CART_PRODUCT);
    const idProductSplit = idProductsCart.split(',');
    const resultIdDelete = deleteElementArray(idProduct, idProductSplit);

    if (resultIdDelete){
        let count = 0;
        let idString = '';
        resultIdDelete.forEach(id => {
            count++;
            if (count < resultIdDelete.length){
                idString += id + ','
            }else {
                idString += id
            }
        });
        localStorage.setItem(CART_PRODUCT, idString);
    }
    const idsLocal = localStorage.getItem(CART_PRODUCT);
    if (!idsLocal){
        localStorage.removeItem(CART_PRODUCT);
    }

    loadProductCart();
}

function incrementProduct(id){
    const idProductsCart = localStorage.getItem(CART_PRODUCT);
    const idProductSplit = idProductsCart.split(',');
    idProductSplit.push(id);
    let count = 0;
    let idString = '';
    idProductSplit.forEach(id => {
        count++;
        if(count< idProductSplit.length){
            idString += id + ','
        }else {
            idString += id
        }
    });
    localStorage.setItem(CART_PRODUCT, idString);
    loadProductCart();
}

function decrementarProduct(id){
    const idProductsCart = localStorage.getItem(CART_PRODUCT);
    const idProductSplit = idProductsCart.split(',');
    const deleteItem = id.toString();
    let index = idProductSplit.indexOf(deleteItem);
    if (index > -1){
        idProductSplit.splice(index, 1);
    }
    let count = 0;
    let idString = '';
    idProductSplit.forEach(id => {
        count++;
        if(count< idProductSplit.length){
            idString += id + ','
        }else {
            idString += id
        }
    });
    localStorage.setItem(CART_PRODUCT, idString);
    loadProductCart();
}

function countDuplicateId(value, idProducts){
    let count = 0;
    idProducts.forEach(id => {
        if(value == id ){
            count++;
        }
    });
    return count;
}

function deleteElementArray(id,Array){
    return Array.filter(itemId => {
        return itemId != id;
    })
}
