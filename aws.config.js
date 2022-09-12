const AWS = require("aws-sdk");
const dotenv = require("dotenv").config();
const credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
};

const s3 = new AWS.S3({
    credentials: credentials,
    region: process.env.AWS_REGION_NAME,
    signatureVersion: "v4",
});

module.exports = s3;
