let char = `123abcde.fmnopqlABCDE@FJKLMNOPQRSTUVWXYZ456789stuvwxyz0!#$%&ijkrgh'*+-/=?^_${"`"}{|}~`;

const generateToken = (key) => {
    let token = "";
    for (let i = 0; i < key.length; i++) {
        let index = char.indexOf(key[i]) || char.length / 2;
        let randomIndex = Math.floor(Math.random() * index);

        token += char[randomIndex] + char[index - randomIndex];
    }
    // console.log(token, key);
    return token;
};

const compareToken = (token, key) => {
    let string = "";
    for (let i = 0; i < token.length; i = i + 2) {
        let index1 = char.indexOf(token[i]);
        let index2 = char.indexOf(token[i + 1]);

        let result = char[index1 + index2];
        string += result;
    }
    // console.log(string);
    if (string === key) {
        return true;
    } else {
        return false;
    }
};

// compareToken("32ab3n1c8323db3Dxpea23D5oabba3af3.", "aepcsam@gmail.com");

const sendData = (path, data) => {
    fetch(path, {
        method: "POST",
        headers: new Headers({ "content-Type": "application/json" }),
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((response) => {
            // console.log(response);
            processData(response);
        });
};

const processData = (data) => {
    loader.style.display = null;
    if (data.alert) {
        showAlert(data.alert);
    } else if (data.name) {
        // console.log(data.email);
        // console.log(data.email.length);
        //create Authenticate
        data.authToken = generateToken(data.email);
        sessionStorage.user = JSON.stringify(data);
        location.replace("/");
    } else if (data === true) {
        //seller page
        let user = JSON.parse(sessionStorage.user);
        user.seller = true;
        sessionStorage.user = JSON.stringify(user);
        location.reload();
    } else if (data.product) {
        location.href = "/seller";
    }
};

const showAlert = (msg, type) => {
    let alertBox = document.querySelector(".alert-box");
    let alertMsg = document.querySelector(".alert-msg");

    let alertImg = document.querySelector(".alert-img");

    alertMsg.innerHTML = msg;

    if (type == "success") {
        alertImg.src = `./img/success.png`;
        alertMsg.style.color = `#0ab50a`;
    } else {
        alertImg.src = `./img/error.png`;
        alertMsg.style.color = null;
    }
    alertBox.classList.add("show");
    setTimeout(() => {
        alertBox.classList.remove("show");
    }, 2000);
    return false;
};
