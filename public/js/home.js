const setupSlidingEffect = () => {
    const productContainers = [
        ...document.querySelectorAll(".product-container"),
    ];

    const nxtBtn = [...document.querySelectorAll(".nxt-btn")];
    const preBtn = [...document.querySelectorAll(".pre-btn")];

    productContainers.forEach((item, i) => {
        let containerDimenstions = item.getBoundingClientRect();
        let containerWidth = containerDimenstions.width;

        nxtBtn[i].addEventListener("click", () => {
            item.scrollLeft += containerWidth;
        });

        preBtn[i].addEventListener("click", () => {
            item.scrollLeft -= containerWidth;
        });
    });
};

const getProducts = (tag) => {
    return fetch("/get-products", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ tag: tag }),
    })
        .then((res) => res.json())
        .then((data) => {
            // console.log(data);
            return data;
        });
};

// create product Slider

const createProductSlider = (data, parent, title) => {
    let sliderContainer = document.querySelector(`${parent}`);
    // console.log(sliderContainer);

    sliderContainer.innerHTML += `
        <section class="product">
            <h2 class="product-category">${title}</h2>
            <button class="pre-btn">
                <img src="../img/arrow.png" alt="" />
            </button>
            <button class="nxt-btn">
                <img src="../img/arrow.png" alt="" />
            </button>
            ${createProductCards(data)}

        <section/>
    `;
    setupSlidingEffect();
};

const createProductCards = (data, parent) => {
    //Here parent is for Search product
    let start = `<div class= 'product-container'>`;
    let middle = "";
    let end = `</div>`;
    // console.log(data.discount);
    // console.log(data.images[0]);
    // console.log(data.name);
    // console.log(data.shortDe);
    // console.log(data.sellPrice);
    // console.log(data.actualPrice);
    for (let i = 0; i < data.length; i++) {
        if (data[i].id != decodeURI(location.pathname.split("/").pop())) {
            middle += `
            <div class="product-card" style="cursor: pointer;">

                <div class="product-image">
                    <span class="discount-tag">${data[i].discount}% off</span>
                    <img src="${data[i].images[0]}" alt="card7" class="product-thumb"/>
                </div>

                <div class="product-info" onclick="location.href='/product/${data[i].id}'" >
                    <h2 class="product-brand">${data[i].name}</h2>
                    <p class="product-short-des">${data[i].shortDe}</p>
                    <span class="price">$${data[i].sellPrice}</span>
                    <span class="actual-price">$${data[i].actualPrice}</span>
                </div>

            </div>`;
            // console.log(middle);
        }
    }

    if (parent) {
        let cardContainer = document.querySelector(parent);
        cardContainer.innerHTML = start + middle + end;
    } else {
        return start + middle + end;
    }
    // console.log(middle);
};

const add_product_to_cart_or_wishlist = (type, product) => {
    let data = JSON.parse(localStorage.getItem(type));
    if (data == null) {
        data = [];
    }

    product = {
        item: 1,
        name: product.name,
        sellPrice: product.sellPrice,
        size: size || null,
        shortDes: product.shortDe,
        image: product.images[0],
    };
    data.push(product);
    // console.log(data);
    localStorage.setItem(type, JSON.stringify(data));
    return "added";
};

// add_product_to_cart_or_wishlist(type, product);
