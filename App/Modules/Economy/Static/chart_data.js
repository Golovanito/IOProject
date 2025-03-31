

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
            GoldValueData.push([`${goldData[i].data}`, goldData[i].cena*31.1035]); 
        }

    } catch (error) {
        console.error(error.message);
    }
}

function clearGoldData(){
    GoldValueData = [];
}

export async function fetchCurrencyChartData(startDate,endDate,code="USD",code2="Eur") {
    try {
        clearCurrencyData();
        const [currencyResponse, secondCurrnecyResponse] = await Promise.all([
            fetch(`https://api.nbp.pl/api/exchangerates/rates/A/${code}/${startDate}/${endDate}/`),
            fetch(`https://api.nbp.pl/api/exchangerates/rates/A/${code2}/${startDate}/${endDate}/`)
        ]);

        if (!currencyResponse.ok || !secondCurrnecyResponse.ok) {
            throw new Error('Error fetching currency data');
        }

        const [currencyData, secondCurrencyData] = await Promise.all([
            currencyResponse.json(),
            secondCurrnecyResponse.json()
        ]);
        let value = [];
        let helpie =0;
        console.log(currencyData.rates.length);
        console.log(secondCurrencyData.rates.length);
        if(code2!="-1"&&code!="-1"){
            for(let i=0; i<currencyData.rates.length;i++){
                helpie = currencyData.rates[i].mid / secondCurrencyData.rates[i].mid;
                value.push(helpie);
            }
        }
        else if(code=="-1"){
            for(let i=0; i<currencyData.rates.length;i++){
                value.push(secondCurrencyData.rates[i].mid);
            }
        }
        else{
            for(let i=0; i<currencyData.rates.length;i++){
                value.push(currencyData.rates[i].mid);
            }
        }
        for(let i=0; i<currencyData.rates.length;i++){
            CurrencyValueData.push([`${currencyData.rates[i].effectiveDate}`, value[i]]);
        }
        console.log(CurrencyValueData);
    } catch (error) {
        console.error(error.message);
    }
}

export function clearCurrencyData(){
    CurrencyValueData = [];
}

let today = new Date().toISOString().slice(0, 10)
var halfYear = new Date(new Date().setDate(new Date().getDate() - 183)).toISOString().slice(0, 10);

$(document).ready(function(){
    fetchGoldData(halfYear, today);
    fetchCurrencyChartData(halfYear,today);
});
    