const axios = require('axios');
const xml2js = require('xml2js');

const getCountries = async () => {
    try {
        const arrayCountries = [];
        const parser = new xml2js.Parser();
        const ContinentrResponse = await axios.get(
            'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso/ListOfContinentsByName'
        );
        const parseResultContinent = await parser.parseStringPromise(ContinentrResponse.data);
        const response = await axios.get(
            'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso/ListOfCountryNamesByName'
        );
        const parseResult = await parser.parseStringPromise(response.data);
        const countries = parseResult.ArrayOftCountryCodeAndName.tCountryCodeAndName;
        for (const country of countries) {
            const countryISOCode = country.sISOCode[0];
            const countryResponse = await axios.get(
                `http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso/FullCountryInfo?sCountryISOCode=${countryISOCode}`
            );
            let countryInfo = await parser.parseStringPromise(countryResponse.data);
            countryInfo = countryInfo.tCountryInfo
            let countryInfoContinent = countryInfo
            for (const continent of parseResultContinent.ArrayOftContinent.tContinent) {
                if (countryInfo.sContinentCode[0] == continent.sCode[0]) {
                    countryInfoContinent = Object.assign({}, countryInfoContinent, {"continentName": continent.sName})
                }
            }
            const currencyResponse = await axios.get(
                `http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso/CurrencyName/JSON/debug?sCurrencyISOCode=${countryInfoContinent.sCurrencyISOCode[0]}`
            );
            const currencyObject = { "currency": currencyResponse.data }
            let countryInfoContinentCurrency = {}
            if (currencyResponse.data) {
                countryInfoContinentCurrency = Object.assign({}, countryInfoContinent, currencyObject)
            } else {
                countryInfoContinentCurrency = countryInfoContinent
            }
            console.log(countryInfoContinentCurrency)
            arrayCountries.push(countryInfoContinentCurrency);
        }
        return arrayCountries;
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
};

module.exports = { getCountries };
// const axios = require('axios');
// const xml2js = require('xml2js');

// const getCountries = async () => {
//     const arrayCountries = []
    // const parser = new xml2js.Parser({ explicitArray: false });
    // const response = await axios.get(
    //     'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso/ListOfCountryNamesByName'
    // );
    // const parseResult = await parser.parseStringPromise(response.data);
    // const parser2 = new xml2js.Parser({ explicitArray: false });
    // const response2 = await axios.get(
    //     'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?op=FullCountryInfo'
    // );
    // console.log(response2.data)
    // const parsedResult2 = await parser2.parseStringPromise(response2.data);
    
    // parser.parseString(response.data, (err, result) => {
    //     const countries = result.ArrayOftCountryCodeAndName.tCountryCodeAndName;
    //     countries.forEach(country => {
    //         arrayCountries.push(country)
    //     });
    // });
    // const response2 = await axios.get(
    //     'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?op=FullCountryInfo'
    // );
    // parser.parseString(response2.data, (err, result) => {
    //     const countries2 = result.ArrayOftCountryCodeAndName.tCountryCodeAndName;
    //     countries2.forEach(country2 => {
    //         arrayCountries.push(country2)
    //     });
    // });
    //console.log(parsedResult2)
//     return parsedResult2;
// };

// module.exports = { getCountries }