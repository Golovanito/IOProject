var yesterday = new Date(); // Tworzenie obiektu daty reprezentującego dzień wczorajszy.
let editMode = false; // Flaga określająca tryb edycji.
yesterday.setDate(yesterday.getDate() - 1); // Ustawienie wczorajszej daty poprzez odjęcie jednego dnia od dzisiejszej.
yesterday = SetDay(yesterday); // Dostosowanie daty wczorajszej, aby nie przypadała na weekend.

const apiURl = "https://api.nbp.pl/api/"; // Podstawowy URL do API NBP.
const APIGoldURL = "https://api.nbp.pl/api/cenyzlota"; // URL do pobierania danych o cenach złota.
let currencies = apiURl + '/exchangerates/tables/A'; // URL do pobierania tabel kursów walut.
const MaxCurrenciesNumber = 2; // Maksymalna liczba walut, które można wyświetlić jednocześnie.
let CurrentCurrnciesNumber = 0; // Liczba aktualnie wyświetlanych walut.

const curreciesShowCode = ['USD', 'EUR', 'CHF']; // Tablica kodów walut, które mają być wyświetlane.

if (yesterday.getDate() < 10) {
    day = "0" + yesterday.getDate(); // Formatowanie dnia na dwucyfrową postać, np. 01, 02.
} else {
    day = yesterday.getDate();
}

if (yesterday.getMonth() < 10) {
    month = "0" + (yesterday.getMonth() + 1); // Formatowanie miesiąca na dwucyfrową postać.
} else {
    month = yesterday.getMonth() + 1;
}

if (yesterday.getDay() == 0 || yesterday.getDay() == 6) {
    yesterday.setDate(); // Obsługa sytuacji, gdy wczorajszy dzień przypada na weekend.
}

let yesterdayDate = yesterday.getFullYear() + '-' + month + '-' + day; // Tworzenie daty w formacie YYYY-MM-DD.
let yesterdayCurrencies = "//api.nbp.pl/api/exchangerates/tables/A/" + yesterdayDate; // URL do pobierania kursów walut dla dnia wczorajszego.
let yesterdayGold = "https://api.nbp.pl/api/cenyzlota/" + yesterdayDate; // URL do pobierania cen złota dla dnia wczorajszego.

// Funkcja dostosowująca datę w taki sposób, aby nie przypadała na weekend.
// - Jeśli data przypada na niedzielę, przesuwa na sobotę.
// - Jeśli data przypada na sobotę, przesuwa na piątek.
function SetDay(day) {
    let newday = new Date();
    newday.setDate(day.getDate());
    if (day.getDay() == 0) {
        newday.setDate(day.getDate() - 1); // Jeśli niedziela, cofnij o jeden dzień.
    }
    if (newday.getDay() == 6) {
        newday.setDate(newday.getDate() - 1); // Jeśli sobota, cofnij o jeden dzień.
    }
    return newday;
}

// Funkcja wyświetlająca kursy walut.
// - `todayData`: dane dotyczące kursów walut na dziś.
// - `yesterdayData`: dane dotyczące kursów walut na wczoraj.
function DisplayCurrencies(todayData, yesterdayData) {
    for (let i = 0; i < todayData[0].rates.length; i++) {
        for (let j = 0; j < curreciesShowCode.length; j++) {
            if (todayData[0].rates[i].code == curreciesShowCode[j]) {
                console.log(todayData[0].rates[i]);
                let backgroundcolor = "#e6f4ea"; // Domyślny kolor tła dla wzrostu kursu.
                let color = "#28a745"; // Domyślny kolor tekstu dla wzrostu kursu.
                let rate = todayData[0].rates[i];
                let amount = todayData[0].rates[i].mid;
                let optText = `${rate.code} - ${rate.currency}`;
                let change = (rate.mid - yesterdayData[0].rates[i].mid) / yesterdayData[0].rates[i].mid * 100; // Obliczenie zmiany kursu w procentach.
                if (change < 0) {
                    color = "#dc3545"; // Kolor tekstu dla spadku kursu.
                    backgroundcolor = "#faf0f3"; // Kolor tła dla spadku kursu.
                }
                const row = document.createElement('div');
                row.classList.add('currency-row');
                row.innerHTML = ` <div class="col-4  text-center">${optText}</div>
                                <div class="col-4  text-center fit">${amount}</div>
                                <div class="col-4 currency-change  text-center" style="color:${color}; background-color:${backgroundcolor}">${change.toFixed(4)}%</div>`;
                $('.currency-list').append(row); // Dodanie wiersza z danymi waluty do listy.
            }
        }
    }
}

// Funkcja pobierająca dane do podglądu.
// - Pobiera aktualne i wczorajsze dane o kursach walut oraz cenach złota.
// - Wyświetla dane w odpowiednich elementach strony.
async function FetchPreviewData() {
    try {
        const [todayCurrResponse, yesterdayCurrResponse, todayGoldResponse, yesterdayGoldResponse] = await Promise.all([
            fetch(currencies), // Pobieranie kursów walut na dziś.
            fetch(yesterdayCurrencies), // Pobieranie kursów walut na wczoraj.
            fetch(APIGoldURL), // Pobieranie ceny złota na dziś.
            fetch(yesterdayGold), // Pobieranie ceny złota na wczoraj.
        ]);

        if (!todayCurrResponse.ok || !yesterdayCurrResponse.ok || !todayGoldResponse.ok || !yesterdayGoldResponse.ok) {
            throw new Error('Error fetching gold data'); // Obsługa błędów w odpowiedziach z API.
        }

        const [todayCurrData, yesterdayCurrData, todayGoldData, yesterdayGoldData] = await Promise.all([
            todayCurrResponse.json(),
            yesterdayCurrResponse.json(),
            todayGoldResponse.json(),
            yesterdayGoldResponse.json(),
        ]);

        DisplayCurrencies(todayCurrData, yesterdayCurrData); // Wyświetlenie kursów walut.

        let todayPrice = todayGoldData[0].cena; // Cena złota na dziś.
        let yesterdayPrice = yesterdayGoldData[0].cena; // Cena złota na wczoraj.

        // Obliczanie ceny złota za uncję.
        let todayPricePerOunce = (todayPrice * 31.1035).toFixed(2);
        let yesterdayPricePerOunce = (yesterdayPrice * 31.1035).toFixed(2);

        // Formatowanie ceny złota na dziś do wyświetlenia.
        let formattedTodayPrice = Number(todayPricePerOunce).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        let arr = ""; // Strzałka wskazująca kierunek zmiany ceny złota.

        if (todayPricePerOunce > yesterdayPricePerOunce) {
            arr = `<i class="bi bi-caret-up-fill" style="color:green;"></i>`; // Strzałka w górę dla wzrostu ceny.
        } else if (todayPricePerOunce < yesterdayPricePerOunce) {
            arr = '<i class="bi bi-caret-down-fill" style="color:red;"></i>'; // Strzałka w dół dla spadku ceny.
        }

        // Wyświetlenie ceny złota na stronie.
        $("#Gold_Price").html(`<h5 class="gold-text">Aktualny kurs złota:</h5> <h2>${formattedTodayPrice} ${arr}PLN/uncję</h2>`);
 
    } catch (error) {
        console.error(error.message); // Wyświetlenie błędu w konsoli w przypadku problemów z pobieraniem danych.
    }
}

// Wywołanie funkcji FetchPreviewData po załadowaniu dokumentu.
$(document).ready(function () {
    FetchPreviewData();
});
