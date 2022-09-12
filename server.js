// import Package:
const express = require("express");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const path = require("path");
const s3 = require("./aws.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const PORT = process.env.PORT || 3000;

const nodemailer = require("nodemailer");

// console.log(s3Client);
const { v4: uuidv4 } = require("uuid");

// Firebase confiq

let serviceAccount = require("./mshgal-raza-firebase-adminsdk-bdgl6-b0605e0c03.json");
const { rmSync } = require("fs");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

//intializing express.js

const app = express();

// declare static path
let staticPath = path.join(__dirname, "public");

//Middleware
app.use("/", express.static(staticPath));
app.use(express.json());

//generate image upload link
const generateUrl = async () => {
    const date = new Date();
    const fileId = parseInt(Math.random() * 10000000000);
    const imageName = `${fileId}${date.getTime()}.jpg`;

    const signedUrlExpireSeconds = 60 * 15; //900ms

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        ContentType: "image/jpeg",
        Expires: signedUrlExpireSeconds,
    };

    // const expiresIn = signedUrlExpireSeconds;
    // const command = new GetObjectCommand(params);

    // const url = await getSignedUrl(s3, command, { expiresIn });

    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);
    // console.log(uploadUrl);
    return uploadUrl;
};

// generateUrl();

//get the upload link
app.get("/s3url", (req, res) => {
    generateUrl().then((url) => res.json(url));
});

// route
// home route
app.get("/", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
});

// Signup route
app.get("/signup", (req, res) => {
    res.sendFile(path.join(staticPath, "signup.html"));
});

//Signup Post route
app.post("/signup", (req, res) => {
    let { name, email, password, number, tac, notification } = req.body;

    // Form validations

    if (name.length < 3) {
        return res.json({ alert: "name must be 3 letters long" });
    } else if (!email.length) {
        return res.json({ alert: "Enter your email..." });
    } else if (password.length < 8) {
        return res.json({ alert: "Password should be 8 letters long" });
    } else if (!number.length) {
        return res.json({ alert: "enter your mobile number" });
    } else if (!Number(number) || number.length < 10) {
        return res.json({ alert: "invalid number, please enter valid one" });
    } else if (!tac) {
        return res.json({
            alert: "you must agree to our terms and conditions",
        });
    } else {
        // user details store in Db
    }

    db.collection("users")
        .doc(email)
        .get()
        .then((user) => {
            if (user.exists) {
                return res.json({ alert: "email already exists" });
            } else {
                //encrypt the password before storing it.
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        req.body.password = hash;
                        db.collection("users")
                            .doc(email)
                            .set(req.body)
                            .then((data) => {
                                res.json({
                                    name: req.body.name,
                                    email: req.body.email,
                                    seller: req.body.seller,
                                });
                            });
                    });
                });
            }
        });

    // res.json("data receieved");
});

//Login Page
app.get("/login", (req, res) => {
    res.sendFile(path.join(staticPath, "login.html"));
});

app.post("/login", (req, res) => {
    let { email, password } = req.body;

    if (!email.length || !password.length) {
        return res.json({ alert: "fill all the inputs" });
    }

    db.collection("users")
        .doc(email)
        .get()
        .then((user) => {
            if (!user.exists) {
                //email does not exists
                return res.json({ alert: "log in email does not exists" });
            } else {
                bcrypt.compare(
                    password,
                    user.data().password,
                    (err, result) => {
                        if (result) {
                            let data = user.data();
                            return res.json({
                                name: data.name,
                                email: data.email,
                                seller: data.seller,
                            });
                        } else {
                            return res.json({ alert: "password in incorrect" });
                        }
                    }
                );
            }
        });
});

//seller Dashboard
app.get("/seller", (req, res) => {
    res.sendFile(path.join(staticPath, "seller.html"));
});

//seller Post
app.post("/seller", (req, res) => {
    let { name, about, address, number, tac, legit, email } = req.body;

    if (
        !name.length ||
        !about.length ||
        number.length < 10 ||
        !Number(number)
    ) {
        return res.json({ alert: "some inforamation(s) is/are invalid" });
    } else if (!tac || !legit) {
        return res.json({
            alert: "you must agree to our terms and conditions",
        });
    } else {
        //update users sellers staus here
        db.collection("sellers")
            .doc(email)
            .set(req.body)
            .then((data) => {
                db.collection("users").doc(email).update({
                    seller: true,
                });
            })
            .then((data) => {
                res.json(true);
            });
    }
});

// add product
app.get("/add-product", (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
});

app.get("/add-product/:id", (req, res) => {
    res.sendFile(path.join(staticPath, "addProduct.html"));
});

//add product item
app.post("/add-product", (req, res) => {
    let {
        name,
        shortDe,
        des,
        images,
        sizes,
        actualPrice,
        discount,
        sellPrice,
        stock,
        tags,
        tac,
        email,
        draft,
        id,
    } = req.body;

    // Validation
    if (!draft) {
        if (!name.length) {
            return res.json({ alert: "Enter product Name" });
        } else if (shortDe.length > 100 || shortDe.length < 10) {
            return res.json({
                alert: "short description must be between 10 to 100 letters long",
            });
        } else if (!des.length) {
            return res.json({
                alert: "enter detail description about the product",
            });
        } else if (!images.length) {
            //image link array
            return res.json({ alert: "upload atleast one product image" });
        } else if (!sizes.length) {
            //size array
            return res.json({ alert: "select at least one size" });
        } else if (
            !actualPrice.length ||
            !discount.length ||
            !sellPrice.length
        ) {
            return res.json({ alert: "you must add pricings" });
        } else if (stock < 20) {
            return res.json({
                alert: "you should have at least 20 items in stock",
            });
        } else if (!tags.length) {
            return res.json({
                alert: "enter few tags to help ranking your product in search",
            });
        } else if (!tac) {
            return res.json({
                alert: "you must agree to our terms and conditions",
            });
        }
    }
    // add product
    let docName = `${name.toLowerCase()}-${Math.floor(Math.random() * 5000)}`;
    db.collection(`products`)
        .doc(docName)
        .set(req.body)
        .then((data) => {
            res.json({ product: name });
        })
        .catch((err) => {
            return res.json({ alert: "some error occured. Try again" });
        });
});

//generate image upload link

// get products
app.post("/get-products", (req, res) => {
    let { email, id, tag } = req.body;
    // let docRef = id
    // ? db.collection("products").doc(id)
    // : db.collection("products").where("email", "==", email);

    if (id) {
        docRef = db.collection("products").doc(id);
    } else if (tag) {
        docRef = db.collection("products").where("tags", "array-contains", tag);
    } else {
        docRef = db.collection("products").where("email", "==", email);
    }

    docRef.get().then((products) => {
        if (products.empty) {
            return res.json("no products");
        }
        let productArr = [];
        if (id) {
            return res.json(products.data());
        } else {
            products.forEach((item) => {
                let data = item.data();
                data.id = item.id;
                // res.json(data);
                productArr.push(data);
                // console.log(productArr);
            });
            res.json(productArr);
        }
    });
});

app.post("/delete-product", (req, res) => {
    let { id } = req.body;
    db.collection("products")
        .doc(id)
        .delete()
        .then((data) => {
            res.json("success");
        })
        .catch((err) => {
            res.json("err");
        });
});

// product Page
app.get("/product/:id", (req, res) => {
    res.sendFile(path.join(staticPath, "product.html"));
});
app.get("/search/:key", (req, res) => {
    res.sendFile(path.join(staticPath, "search.html"));
});

app.get("/cart", (req, res) => {
    res.sendFile(path.join(staticPath, "cart.html"));
});

app.get("/checkout", (req, res) => {
    res.sendFile(path.join(staticPath, "checkout.html"));
});

app.post("/order", (req, res) => {
    const { order, email, add } = req.body;
    console.log(order.length);
    // Nodemailer
    let transporter = nodemailer.createTransport({
        // service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const mailOption = {
        from: "Valid sender email id",
        to: email,
        subject: `Clothing : Order Placed`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Clothing :</title>
                <style>
                    body {
                        min-width: 90vh;
                        background: #f5f5f5;
                        font-family: sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .heading {
                        text-align: center;
                        font-size: 40px;
                        width: 50%;
                        display: block;
                        line-height: 50px;
                        margin: 30px auto 60px;
                        text-transform: capitalize;
                    }
                    .heading span {
                        font-weight: 300;
                    }
                    .btn {
                        width: 200px;
                        height: 50px;
                        border-radius: 5px;
                        background: #3f3f3f;
                        color: #fff;
                        display: block;
                        margin: auto;
                        font-size: 18px;
                        text-transform: capitalize;
                    }
                    .link{
                        padding: 10px;
                        border: 1px solid black;
                        border-radius: 5px;
                        background: #383838;
                    }

                </style>
            </head>
            <body>
                <div>
                    <h1 class="heading">
                        dear ${
                            email.split("@")[0]
                        }, <span>your order is successfully placed</span>
                    </h1>
                    <button class="btn">Check status</button>
                    <a href="http://localhost:3000/" class="link">Click Link</a>
                </div>
            </body>
        </html>

        `,
    };
    // Nodemailer

    let docName = email + Math.floor(Math.random() * 1237191231231231);
    // db.collection("order")
    //     .doc(docName)
    //     .set(req.body)
    //     .then((data) => {
    //         res.json("done");
    //     });

    db.collection("order")
        .doc(docName)
        .set(req.body)
        .then((data) => {
            transporter.sendMail(mailOption, (err, info) => {
                if (err) {
                    res.json({
                        alert: "oops! its seems like some err occured. Try again",
                    });
                } else {
                    res.json({ alert: "your order is placed" });
                }
            });
        });
});

// 404 route
app.get("/404", (req, res) => {
    res.sendFile(path.join(staticPath, "404.html"));
});

app.use((req, res) => {
    res.redirect("/404");
});

app.listen(PORT, () => {
    console.log(`server is Running at ${PORT}....`);
});
