const axios = require("axios");

const api = axios.create({
  baseURL: "http://49.13.88.109:1051/",
});

module.exports = api;
