const countryService = require('../services/countryService');

const getCountries = async (req, res) => {
  try {
    const countries = await countryService.getCountries();
    //console.log(countries)
    res.send(countries);
  } catch (error) {
    console.error(error);
    res.status(500).res.send(error);
  }
};

module.exports = {
    getCountries
}