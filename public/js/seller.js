let loader = document.querySelector(".loader");
let user = JSON.parse(sessionStorage.user || null);
// console.log(user);

const becomeSellerElement = document.querySelector(".become-seller");
const productListingElement = document.querySelector(".product-listing");
const applyForm = document.querySelector(".apply-form");
const showApplyFormBtn = document.querySelector("#apply-btn");

window.onload = () => {
    // if (sessionStorage.user) {
    if (user) {
        // let user = JSON.parse(sessionStorage.user);
        if (compareToken(user.authToken, user.email)) {
            if (!user.seller) {
                becomeSellerElement.classList.remove("hide");
            } else {
                productListingElement.classList.remove("hide");
                // loader.style.display = "block";
                setupProducts();
            }
        } else {
            location.replace("/login");
        }
    }
};

// Show form

showApplyFormBtn.addEventListener("click", () => {
    becomeSellerElement.classList.add("hide");
    applyForm.classList.remove("hide");
});

//form Submission

let applyFormBtn = document.querySelector("#apply-form-btn");
let businessName = document.getElementById("business-name");
let address = document.querySelector("#business-add");
let about = document.querySelector("#about");
let number = document.querySelector("#number");
let tac = document.querySelector("#terms-and-cond");
let legitInfo = document.querySelector("#legitInfo");

applyFormBtn.addEventListener("click", () => {
    if (
        !businessName.value.length ||
        !address.value.length ||
        !about.value.length ||
        !number.value.length
    ) {
        showAlert("fill all the inputs");
    } else if (!tac.checked || !legitInfo.checked) {
        showAlert("you must agee to our terms and conditions");
    } else {
        //make server request
        loader.style.display = "block";
        sendData("/seller", {
            name: businessName.value,
            address: address.value,
            about: about.value,
            number: number.value,
            tac: tac.checked,
            legit: legitInfo.checked,
            email: JSON.parse(sessionStorage.user).email,
        });
    }
});

const setupProducts = () => {
    fetch("/get-products", {
        method: "post",
        headers: new Headers({
            "Content-Type": "application/json",
        }),
        body: JSON.stringify({ email: user.email }),
    })
        .then((res) => res.json())
        .then((data) => {
            loader.style.display = null;
            productListingElement.classList.remove("hide");
            if (data == "no products") {
                let emptySvg = document.querySelector(".no-product-image");
                emptySvg.classList.remove("hide");
            } else {
                data.forEach((product) => createProduct(product));
            }
        });
};
