const createNav = () => {
    let nav = document.querySelector(".navbar");
    nav.innerHTML = `
    <div class="nav">
        <img src="../img/dark-logo.png" alt="logo" class="brand-logo" />
        <div class="nav-items">
            <div class="search">
                <input
                    type="text"
                    placeholder="Search brand,product"
                    class="search-box"
                    />
                <button class="search-btn">Search</button>
            </div>

            <a href="#"><img src="../img/user.png" id="user-img" alt="User" />
                <div class="login-logout-popup hide">
                    <p class="account-info">Log in, as name</p>
                    <button class="btn" id="user-btn">Logout</button>
                </div>
            </a>

                <a href="/cart"><img src="../img/cart.png" alt="Cart" /></a>

        </div>
    </div>

            <ul class="links-container">
                <li class="link-item"><a href="/" class="link">Home</a></li>
                <li class="link-item">
                    <a href="#" class="link">Jalabiyas</a>
                </li>
                <li class="link-item"><a href="#" class="link">NewCollection</a></li>
                <li class="link-item"><a href="#" class="link">Kids Dresses</a></li>
                <li class="link-item">
                    <a href="#" class="link">Accessories</a>
                </li>
            </ul>


    `;
};

createNav();

const userImageButton = document.querySelector("#user-img");
const userPop = document.querySelector(".login-logout-popup");
const popuptext = document.querySelector(".account-info");
const actionBtn = document.querySelector("#user-btn");

userImageButton.addEventListener("click", () => {
    userPop.classList.toggle("hide");
});

window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null);
    if (user != null) {
        //means logged in
        popuptext.innerHTML = `Log in as, ${user.name}`;
        actionBtn.innerHTML = "Log out";
        actionBtn.addEventListener("click", () => {
            sessionStorage.clear();
            location.reload();
        });
    } else {
        //logout
        popuptext.innerHTML = `Log in to place order`;
        actionBtn.innerHTML = `Log in`;
        actionBtn.addEventListener("click", () => {
            location.href = "/login";
        });
    }
};

// SearchBox
const searchBtn = document.querySelector(".search-btn");
const searchBox = document.querySelector(".search-box");
searchBtn.addEventListener("click", () => {
    if (searchBox.value.length) {
        location.href = `/search/${searchBox.value}`;
    }
});
