

export let GoldValueData = [];
export let CurrencyValueData = [];

export async function fetchGoldData(startDate, endDate) { 
    try {
        const [goldResponse] = await Promise.all([
            fetch(`https://api.nbp.pl/api/cenyzlota/${startDate}/${endDate}`),
        ]);

        if (!goldResponse.ok) {
            throw new Error('Error fetching gold data');
        }

        const [goldData] = await Promise.all([
            goldResponse.json(),
        ]);
 
        for(let i=0; i<goldData.length;i++){
            GoldValueData.push([`${goldData[i].data}`, goldData[i].cena]); 
        }

    } catch (error) {
        console.error(error.message);
    }
}

function clearGoldData(){
    GoldValueData = {};
}

async function fetchCurrenyData(startDate,endDate) {
    try {
        const [currencyResponse] = await Promise.all([
            fetch(`https://api.nbp.pl/api/exchangerates/rates/A/USD/${startDate}/${endDate}/`),
        ]);

        if (!currencyResponse.ok) {
            throw new Error('Error fetching gold data');
        }

        const [currencyData] = await Promise.all([
            currencyResponse.json(),
        ]);
        

        for(let i=0; i<currencyData.rates.length;i++){
            CurrencyValueData.push([`${currencyData.rates[i].effectiveDate}`, currencyData.rates[i].mid]); 
        }

    } catch (error) {
        console.error(error.message);
    }
}

function clearCurrencyData(){
    CurrencyValueData = {};
}

let today = new Date().toISOString().slice(0, 10)
var halfYear = new Date(new Date().setDate(new Date().getDate() - 183)).toISOString().slice(0, 10);

$(document).ready(function(){
    fetchGoldData(halfYear, today);
    fetchCurrenyData(halfYear,today);
});
    