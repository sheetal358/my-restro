const list1 = document.querySelector('.menu-list');

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-item');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
const cartItemss = document.querySelector('.cart-itemss')




//placing and getting info from local storage
let cart = [];

//class
class Products {
    async getProducts() {
        try {
            let result = await fetch('menu.json');
            let data = await result.json();

            let products = data.items;

            products = products.map(item => {
                const { title1, title2, price, id } = item.fields;
                const { name } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title1, title2, price, name, image, id }
            })
            return products
        }
        catch (error) {
            console.log('error');

        }
    }
}


class UI {


    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            //<div class="m">
            result += `
                <div class="menu-list-item">
                    <div  class="menu-list-item-img">
                        <img src=${product.image} height="80px" class="menu-list-item-image" width="80px" alt="">
                    </div>
                    <div class="menu-list-item-name">
                        <h4 class="item-name1">${product.title1}</h4>
                        <h6 class="item-name2">${product.title2}</h6>
                    </div>
                    <div class="menu-list-item-price">
                        <div class="price">$ <span>${product.price}</span></div>
                        <div class="border2"></div>
                    </div>
                    <div>
                        <button  class="bag-btn" data-id=${product.id}><i class="fas fa-shopping-cart"></i>add to cart</button>
                    </div>
                </div>`

        });
        list1.innerHTML = result;
    }


    preloader() {
        window.addEventListener('load', function () {
            document.querySelector('.preloader').style.display = 'none';
        })
    }
    workmodal() {
        const link = document.querySelectorAll('.gallery-item-icon');
        link.forEach(function (item) {
            item.addEventListener('click', function (event) {
                event.preventDefault();
                //console.log(event.target.parentElement);
                if (event.target.parentElement.classList.contains('gallery-item-icon')) {
                    let id = event.target.parentElement.dataset.id;
                    //console.log(id);

                    const modal = document.querySelector('.work-modal');
                    const modalitem = document.querySelector('.work-modal-item');
                    modal.classList.add('work-modal-show');
                    modalitem.style.backgroundImage = `url(img/img-${id}.jpg)`

                }

            })
        })
    }

    closebtn() {
        const close = document.querySelector('.work-modal-close')
        close.addEventListener('click', function () {
            const modal = document.querySelector('.work-modal')
            modal.classList.remove('work-modal-show')
        })

    }


    getBagButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttons.forEach(button => {
            let id = button.dataset.id;
            //console.log(id);
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.innerText = "In Cart";
                button.disabled = true;
            }
            button.addEventListener("click", (event) => {
                // disable button
                event.target.innerText = 'in cart';
                event.target.disabled = true;
                // add to cart
                let cartItem = { ...Storage.getProduct(id), amount: 1 };
                //console.log(cartItem);

                cart = [...cart, cartItem];
                //console.log(cart);

                Storage.saveCart(cart);
                // add to DOM
                this.setCartValues(cart);
                this.addCartItem(cartItem);//cartItem
                this.showCart();
            });
        });
    }
    setCartValues(cart) {
        let tempTotal = 0
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount
            itemsTotal += item.amount;
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItemss.innerText = itemsTotal;
        //console.log(cartTotal , cartItemss);

    }
    addCartItem(item) {

        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.innerHTML = `<!-- cart item -->
                <!-- item image -->
                <img src=${item.image} alt="product" />
                <!-- item info -->
                <div>
                  <h4>${item.title1}</h4>
                  <h5>$${item.price}</h5>
                  <span class="remove-item" data-id=${item.id}>remove</span>
                </div>
                <!-- item functionality -->
                <div>
                    <i class="fas fa-chevron-up" data-id=${item.id}></i>
                  <p class="item-amount">
                    ${item.amount}
                  </p>
                    <i class="fas fa-chevron-down" data-id=${item.id}></i>
                </div>
              <!-- cart item -->
        `
        cartContent.appendChild(div);
    }
    showCart() {
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");
    }
    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener("click", this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart);
    }
    populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
    }
    hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
    }

    cartLogic() {
        clearCartBtn.addEventListener("click", () => {
            this.clearCart();
        });
        cartContent.addEventListener("click", event => {
            if (event.target.classList.contains("remove-item")) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cart = cart.filter(item => item.id != id);
                console.log(cart);

                this.setCartValues(cart);
                Storage.saveCart(cart);
                cartContent.removeChild(removeItem.parentElement.parentElement);
                const buttons = [...document.querySelectorAll(".bag-btn")];
                buttons.forEach(button => {
                    if (parseInt(button.dataset.id) == id) {
                        button.disabled = false;
                        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
                    }
                });
            } else if (event.target.classList.contains("fa-chevron-up")) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id == id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains("fa-chevron-down")) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id == id);
                tempItem.amount = tempItem.amount - 1;
                if (tempItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                } else {
                    cart = cart.filter(item => item.id !== id);
                    // console.log(cart);

                    this.setCartValues(cart);
                    Storage.saveCart(cart);
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    const buttons = [...document.querySelectorAll(".bag-btn")];
                    buttons.forEach(button => {
                        if (parseInt(button.dataset.id) === id) {
                            button.disabled = false;
                            button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
                        }
                    });
                }
            }
        });
    }
    clearCart() {
        // console.log(this);

        cart = [];
        this.setCartValues(cart);
        Storage.saveCart(cart);
        const buttons = [...document.querySelectorAll(".bag-btn")];
        buttons.forEach(button => {
            button.disabled = false;
            button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
        });
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
}

//local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let product = JSON.parse(localStorage.getItem('products')) //return array
        return product.find(product => product.id == id)
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cart')
            ? JSON.parse(localStorage.getItem('cart'))
            : [];
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    ui.preloader()
    ui.workmodal();


    // get all products
    products
        .getProducts()
        .then(products => {
            ui.displayProducts(products);
            Storage.saveProducts(products);
        })
        .then(() => {
            ui.getBagButtons();
            ui.setupAPP();
            ui.cartLogic();
        });
    ui.closebtn();
});;




