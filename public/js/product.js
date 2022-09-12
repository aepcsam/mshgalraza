const productImages = document.querySelectorAll(".product-images img");

const productImageSlide = document.querySelector(".image-slider");

let activeImageSlide = 0;

productImages.forEach((item, i) => {
    item.addEventListener("click", () => {
        productImages[activeImageSlide].classList.remove("active");
        item.classList.add("active");
        productImageSlide.style.backgroundImage = `url(${item.src})`;
        activeImageSlide = i;
    });
});

// toggle size

const sizeBtns = document.querySelectorAll(".size-radio-btn");

let checkBtn = 0;
let size;

sizeBtns.forEach((item, i) => {
    item.addEventListener("click", () => {
        sizeBtns[checkBtn].classList.remove("check");
        item.classList.add("check");
        checkBtn = i;
        size = item.innerHTML;
    });
});

const setData = (data) => {
    let title = document.querySelector("title");
    // title.innerHTML += data.name;

    // set images
    productImages.forEach((img, i) => {
        if (data.images[i]) {
            img.src = data.images[i];
        } else {
            img.style.display = "none";
        }
    });
    productImages[0].click();

    // Setup Sizes
    sizeBtns.forEach((item) => {
        if (!data.sizes.includes(item.innerHTML)) {
            item.style.display = "none";
        }
    });

    // setup Texts
    const name = document.querySelector(".product-brand");
    const shortDes = document.querySelector(".product-short-des");
    const des = document.querySelector(".des");

    title.innerHTML += name.innerHTML = data.name;
    shortDes.innerHTML = data.shortDe;
    des.innerHTML = data.des;

    // Pricing
    const sellPrice = document.querySelector(".product-price");
    const actualPrice = document.querySelector(".product-actual-price");
    const discount = document.querySelector(".product-discount");

    sellPrice.innerHTML = `$${data.sellPrice}`;
    actualPrice.innerHTML = `$${data.actualPrice}`;
    discount.innerHTML = `(${data.discount}% off)`;

    // Wishlist and Cart btn
    const wishlistBtn = document.querySelector(".wishlist-btn");
    wishlistBtn.addEventListener("click", () => {
        wishlistBtn.innerHTML = add_product_to_cart_or_wishlist(
            "wishlist",
            data
        );
    });

    const cartBtn = document.querySelector(".cart-btn");
    cartBtn.addEventListener("click", () => {
        cartBtn.innerHTML = add_product_to_cart_or_wishlist("cart", data);
    });
};

// Fetch Data
const fetchProductData = () => {
    fetch("/get-products", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ id: productId }),
    })
        .then((res) => res.json())
        .then((data) => {
            // console.log(data);
            setData(data);
            getProducts(data.tags[1]).then((data) => {
                createProductSlider(
                    data,
                    ".container-for-card-slider",
                    "similar products"
                );
            });
        })
        .catch((err) => {
            location.replace("/404");
        });
};

let productId = null;
if (location.pathname != "/product") {
    productId = decodeURI(location.pathname.split("/").pop());
    // console.log(productId);
    fetchProductData();
}
