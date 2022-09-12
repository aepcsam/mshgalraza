// let openEditor;

const createProduct = (data) => {
    // openEditor = () => {
    //     sessionStorage.tempProduct = JSON.stringify(data);
    //     location.href = `/add-product/${data.id}`;
    // };

    const productContainer = document.querySelector(".product-container");
    productContainer.innerHTML += `
        <div class="product-card">
            <div class="product-image">
                ${data.draft ? `<span class="tag">Draft</span>` : ``}
                <img
                    src="${data.images[0] || "img/no image.png"} "
                    alt="card7"
                    class="product-thumb"
                />
                
                <button class="edit-btn card-action-btn" 
                onclick="location.href='/add-product/${
                    data.id
                }'"><img src="img/edit.png" alt="edit"></button>

                <button class="open-btn card-action-btn" 
                onclick="location.href='/product/${data.id}'">
                <img src="img/open.png" alt="edit"></button>

                <button 
                    class="delete-popup-btn card-action-btn" onClick="openDeletePopup('${
                        data.id
                    }')">
                    <img src="img/delete.png" alt="edit"></button>

            </div>
            <div class="product-info">
                <h2 class="product-brand">${data.name}</h2>
                <p class="product-short-des">
                    ${data.shortDe}
                </p>
                <span class="price">$${data.sellPrice}</span
                ><span class="actual-price">$${data.actualPrice}</span>
            </div>
        </div>
    `;
};

const openDeletePopup = (id) => {
    let deleteAlert = document.querySelector(".delete-alert");
    deleteAlert.style.display = "flex";

    let closeBtn = document.querySelector(".close-btn");
    closeBtn.addEventListener(
        "click",
        () => (deleteAlert.style.display = null)
    );
    let deleteBtn = document.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => deleteItem(id));
};

const deleteItem = (id) => {
    fetch("/delete-product", {
        method: "post",
        headers: new Headers({
            "content-Type": "application/json",
        }),
        body: JSON.stringify({ id: id }),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data == "success") {
                location.reload();
            } else {
                showAlert(
                    "some error occured while deleting the product. try again"
                );
            }
        });
};
