const axios = require("axios");

async function getFlag(countryCode){
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    return response.data[0].flags.svg;
}

module.exports = {
    getFlag
};
