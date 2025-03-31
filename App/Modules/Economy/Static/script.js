import { drawGoldChartWeek, drawGoldChartHalfYear, drawGoldChartMonth } from "./charts.js";
import { CurrencyValueData, GoldValueData, fetchCurrencyChartData, clearCurrencyData } from "./chart_data.js";

// Link do dokumentacji API: https://api.nbp.pl

// Ustawienie daty na wczoraj
var yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
yesterday = SetDay(yesterday); // Funkcja dostosowująca dzień do roboczego (pomija weekendy)
let editMode = false; // Flaga do określenia, czy edytowanie jest aktywne
let chartVisible = false; // Flaga do śledzenia, czy wykres jest widoczny
const apiURl = "https://api.nbp.pl/api/"; // Bazowy URL API NBP
let currencies = apiURl + '/exchangerates/tables/A'; // Ścieżka do tabeli kursów walut

let isCurrencies;
let timeSpanChanged = false;
let newTimeSpanId ="";


let day="";
let month ="";
let day1 ="";
let month1 ="";
// Formatowanie daty na wczoraj w formacie YYYY-MM-DD
if (yesterday.getDate() < 10) {
    day = "0" + yesterday.getDate();
} else {
    day = yesterday.getDate();
}

if (yesterday.getMonth() < 10) {
    month = "0" + (yesterday.getMonth() + 1);
} else {
    month = yesterday.getMonth() + 1;
}

let yesterdayDate = yesterday.getFullYear() + '-' + month + '-' + day; // Sformatowana data wczorajsza
let yesterdayCurrencies = "//api.nbp.pl/api/exchangerates/tables/A/" + yesterdayDate; // URL do tabeli na wczoraj

// Sekcja obsługi API złota
let chartVisible1 = false; // Flaga dla widoczności wykresu dla złota
var yesterday1 = new Date();
yesterday1.setDate(yesterday1.getDate() - 1); // Ustawienie daty na wczoraj
yesterday1 = SetDay(yesterday1); // Funkcja do ustawiania dnia roboczego

// Formatowanie daty dla API złota
if (yesterday1.getDate() < 10) {
    day1 = "0" + yesterday1.getDate();
} else {
    day1 = yesterday1.getDate();
}

if (yesterday1.getMonth() < 10) {
    month1 = "0" + (yesterday1.getMonth() + 1);
} else {
    month1 = yesterday1.getMonth() + 1;
}

let yesterdayDate1 = yesterday1.getFullYear() + '-' + month1 + '-' + day1; // Data wczorajsza w formacie dla złota
let yesterdayGold = "https://api.nbp.pl/api/cenyzlota/" + yesterdayDate1; // URL dla wczorajszej ceny złota
let APIGoldURL = "https://api.nbp.pl/api/cenyzlota"; // URL dla bieżącej ceny złota

// Funkcja do ustawiania dnia roboczego, pomijając soboty i niedziele
function SetDay(day) {
    let newday = new Date();
    newday.setDate(day.getDate());
    if (day.getDay() == 0) { // Jeśli niedziela
        newday.setDate(day.getDate() - 1);
    }
    if (newday.getDay() == 6) { // Jeśli sobota
        newday.setDate(newday.getDate() - 1);
    }
    return newday;
}

function changeView(){
    isGold = !isGold;
    isCurrencies = !isCurrencies;
    if(isCurrencies){
        $("#CurrencyViewButton").off('click'); 
        $("#GoldViewButton").on('click', changeView); 
    }
    else{
        $("#GoldViewButton").off('click'); 
        $("#CurrencyViewButton").on('click', changeView); 
    }
    console.log(`Złoto:${isGold} -- Waluty:${isCurrencies}`);
}

// Funkcja pobierająca dane o cenie złota z API
async function fetchGoldData() {
    try {
        // Równoczesne żądania dla bieżących i wczorajszych danych
        const [todayResponse, yesterdayResponse] = await Promise.all([
            fetch(APIGoldURL),
            fetch(yesterdayGold),
        ]);

        // Sprawdzenie odpowiedzi
        if (!todayResponse.ok || !yesterdayResponse.ok) {
            throw new Error('Error fetching gold data'); // Obsługa błędów
        }

        // Przetworzenie odpowiedzi na JSON
        const [todayData, yesterdayData] = await Promise.all([
            todayResponse.json(),
            yesterdayResponse.json(),
        ]);

        // Wyciągnięcie cen złota
        let todayPrice = todayData[0].cena;
        let yesterdayPrice = yesterdayData[0].cena;

        // Konwersja cen na uncję (1 gram = 31.1035 uncji)
        let todayPricePerOunce = (todayPrice * 31.1035).toFixed(2);
        let yesterdayPricePerOunce = (yesterdayPrice * 31.1035).toFixed(2);

        // Formatowanie ceny z dwoma miejscami po przecinku
        let formattedTodayPrice = Number(todayPricePerOunce).toLocaleString('pl-PL', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        // Ustawienie ikony zmiany ceny
        let arr = "";
        if (todayPricePerOunce > yesterdayPricePerOunce) {
            arr = `<i class="bi bi-caret-up-fill" style="color:green;"></i>`; // Wzrost
        } else if (todayPricePerOunce < yesterdayPricePerOunce) {
            arr = '<i class="bi bi-caret-down-fill" style="color:red;"></i>'; // Spadek
        }

        // Wyświetlenie aktualnej ceny złota w HTML
        $("#Gold_Price").html(`<h2>Aktualny kurs złota: <h3>${formattedTodayPrice} ${arr} PLN/uncję</h3></h2>`);
    } catch (error) {
        console.error(error.message); // Obsługa błędów
    }
}

// Funkcja do formatowania wprowadzonej kwoty w polu wejściowym
function formatAmount() {
    const amountInput = document.getElementById('amountInput');
    let value = amountInput.value;

    // Zamiana przecinków na kropki
    value = value.replace(/,/g, '.');

    // Usunięcie nadmiarowych zer na początku
    if (value.startsWith('0') && !value.startsWith('0.')) {
        value = value.replace(/^0+/, '');
    }

    // Dodanie '0' na początku, jeśli liczba zaczyna się od kropki
    if (value.startsWith('.')) {
        value = '0' + value;
    }

    // Ograniczenie liczby miejsc po kropce do dwóch
    const dotIndex = value.indexOf('.');
    if (dotIndex !== -1) {
        value = value.substring(0, dotIndex + 1) + value.substring(dotIndex + 1).replace(/[^0-9]/g, '').substring(0, 2);
    } else {
        value = value.replace(/[^0-9]/g, '');
    }

    // Zaktualizowanie wartości w polu wejściowym
    amountInput.value = value;
}

// Funkcja walidująca wprowadzaną kwotę
function validateAmount() {
    const amount = document.getElementById('amountInput');
    const value = parseFloat(amount.value);

    // Sprawdzenie, czy wartość jest liczbą większą od 0
    if (isNaN(value) || value <= 0) {
        alert("Proszę podać liczbę większą od zera");
        amount.value = '';
    }
}

// Funkcja do zamiany walut w polach wyboru
function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');

    // Zamiana wartości pól
    const tempValue = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempValue;
}

// Funkcja przełącza tryb edycji, umożliwiając edytowanie walut
function toggleEditMode() {
    // Zmienia wartość zmiennej editMode, co oznacza włączenie/wyłączenie trybu edycji
    editMode = !editMode;

    const removeButtons = document.querySelectorAll('.btn-remove');
    const addCurrencyBtn = document.getElementById('addCurrencyBtn');
    const editButton = document.getElementById('editButton');
    const currencyDropdown = document.getElementById('currencyDropdown');
    
    // Przełączanie widoczności przycisków usuwania walut
    removeButtons.forEach(button => {
        // Ukrywa przyciski usuwania walut dla walut, które nie są aktywne
        if (!button.closest('.currency-active')) {
            button.style.display = editMode ? 'inline' : 'none';
        }
    });

    // Zmiana stanu przycisku dodawania waluty (zablokowanie w trybie edycji)
    addCurrencyBtn.disabled = editMode;

    // Zmiana tekstu przycisku edycji, zależnie od stanu edycji
    editButton.innerText = editMode ? 'Potwierdź' : 'Edytuj';

    // Ukrywa rozwijaną listę walut, jeśli tryb edycji jest aktywny
    if (editMode && !currencyDropdown.classList.contains('d-none')) {
        currencyDropdown.classList.add('d-none');
    }
}

// Funkcja usuwa walutę z listy
function removeCurrency(element) {
    // Usuwanie całego wiersza waluty z listy
    element.closest('.currency-row').remove();
}

// Funkcja pokazuje lub ukrywa rozwijaną listę walut do dodania
function showAddCurrency() {
    // Jeśli nie jesteśmy w trybie edycji, pokazujemy listę rozwijaną
    if (!editMode) {
        document.getElementById('currencyDropdown').classList.toggle('d-none');
    }
}

// Funkcja dodaje walutę do listy
function addCurrency(name, amount, change) {
    // Pobranie kontenera na listę walut
    const currencyList = document.querySelector('.currency-list');
    // Tworzenie nowego elementu - wiersza waluty
    const row = document.createElement('div');
    row.classList.add('currency-row');

    // Ustalenie kolorów na podstawie zmiany kursu waluty
    let color = "#28a745"; // Zielony dla wzrostu kursu
    let backgroundcolor = "#e6f4ea"; // Jasnozielone tło
    if (change < 0) { // Czerwony dla spadku kursu
        color = "#dc3545";
        backgroundcolor = "#faf0f3";
    }

    // Tworzenie HTML wiersza z walutą
    row.innerHTML = `
        <div class="col-4  text-center">${name}</div>
        <div class="col-4  text-center fit">${amount}</div>
        <div class="col-4 currency-change  text-center" style="color:${color}; background-color:${backgroundcolor}">${change}%</div>
        <div class="col-1 text-center">
            <span class="btn-remove">&#x2212;</span>
        </div>
    `;

    // Dodanie nowego wiersza do listy walut
    currencyList.appendChild(row);

    $(document).on('click', '.btn-remove', function () {
        removeCurrency(this);
    });
}

// Funkcja konwertuje waluty na podstawie wprowadzonych danych
function convertCurencies() {
    // Pobranie kwoty do konwersji
    let amount = $('#amountInput').val();
    if (amount != 0) { // Jeśli kwota jest większa od 0
        // Pobranie wybranych walut
        let fromCurrency = $('#fromCurrency').val();
        let toCurrency = $('#toCurrency').val();
        let valueFromCurrency = fromCurrency.split(",");
        let valueToCurrency = toCurrency.split(",");
 
        
        // Sprawdzenie, czy wybrano różne waluty do konwersji
        if (valueFromCurrency[0] == valueToCurrency[0]) {
            alert("Wybierz różne waluty");
            return 0; // Jeśli waluty są takie same, zatrzymujemy działanie
        }

        // Jeśli wybrano waluty, które są różne, wykonujemy konwersję
        if (valueFromCurrency[0] != -1 && valueToCurrency[0] != -1) {
            exchange(valueFromCurrency[0], valueToCurrency[0], amount);
        }
        
        // Obsługa przypadku, gdy jedna z walut jest niewłaściwa (np. PLN)
        if (valueFromCurrency[0] == -1) {
            exchange(1, valueToCurrency[0], amount); // Wymiana z PLN
        }
        if (valueToCurrency[0] == -1) {
            exchange(valueFromCurrency[0], 1, amount); // Wymiana na PLN
        }
    } else {
        // Powiadomienie o błędzie, jeśli podano niewłaściwą wartość kwoty
        alert("Proszę podać liczbę większą od zera");
    }
}

// Funkcja wykonuje wymianę walut na podstawie wybranych kursów
function exchange(from, to, amount) {
    // Obliczenie wartości po konwersji
    let exchangeValue = (from * amount) / to;
    console.log(exchangeValue); // Zapisanie wyniku w konsoli

    // Pobranie kontenera, w którym wyświetlamy wynik konwersji
    const conversionResultDiv = document.getElementById('conversionResult');
    conversionResultDiv.innerHTML = ''; // Czyszczenie poprzedniego wyniku

    // Wyświetlenie wyniku przewalutowania
    conversionResultDiv.innerHTML = `
        <h3>Wynik przewalutowania</h3>
        <p>${amount} 
           ${$('#fromCurrency option:selected').text()} 
           przekonwertowane na ${$('#toCurrency option:selected').text()} 
           wynosi <strong>${exchangeValue.toFixed(2)}</strong>.
        </p>
    `;
}

// Funkcja pobiera dane kursów walut
async function fetchCurrenciesData() {
    try {
        // Wykonanie równoczesnych zapytań do dwóch API
        const [todayResponse, yesterdayResponse] = await Promise.all([
            fetch(currencies),
            fetch(yesterdayCurrencies),
        ]);

        // Sprawdzenie, czy odpowiedzi są poprawne
        if (!todayResponse.ok || !yesterdayResponse.ok) {
            throw new Error('Error fetching currency data');
        }

        // Parsowanie odpowiedzi JSON
        const [todayData, yesterdayData] = await Promise.all([
            todayResponse.json(),
            yesterdayResponse.json(),
        ]);

        // Wywołanie funkcji do wypełnienia danych walutami
        populateCurrencies(todayData, yesterdayData);
    } catch (error) {
        // Obsługa błędów, gdy dane nie mogą zostać pobrane
        console.error(error.message);
    }
}

// Funkcja wypełnia listę walut na podstawie danych z API
function populateCurrencies(todayData, yesterdayData) {
    // Dodanie opcji PLN na początku listy
    let pln = new Option("PLN - Polski Złoty", "-1");
    $('select').append(pln);

    // Iteracja przez dane dzisiejsze kursy walut
    for (let i = 0; i < todayData[0].rates.length; i++) {
        let rate = todayData[0].rates[i];
        let optText = `${rate.code} - ${rate.currency}`;
        let values = [rate.mid, rate.code];
        let option = new Option(optText, values);
        
        // Obliczenie zmiany kursu w porównaniu do wczoraj
        let change = (rate.mid - yesterdayData[0].rates[i].mid) / yesterdayData[0].rates[i].mid * 100;
        
        // Dodanie opcji do rozwijanej listy walut
        $('select').append(option);

        // Tworzenie elementu listy, który dodaje walutę do aktywnej listy walut
        let currencyListElement = `<li class='dropdown-item' id='currencyNo${i}');">${optText}</li>`;
        $("#currencyDropDownList").append(currencyListElement);
        $(`#currencyNo${i}`).on('click',function(){
          addCurrency(`${rate.code} - ${rate.currency}`,rate.mid, change.toFixed(4));
        });
    }
}

function ChangeGoldTimeSpan(timespan){
    let timeSpansDivs = ["chartWeek_div","chartMonth_div", "chartHalfYear_div"];

    if(!timeSpanChanged){
        $("#chartWeek_div").attr('id',`${timeSpansDivs[timespan]}`);
        
        timeSpanChanged = true;
        newTimeSpanId = timeSpansDivs[timespan];
    }
    else{
        $(`#${newTimeSpanId}`).attr('id',`${timeSpansDivs[timespan]}`);
        newTimeSpanId = timeSpansDivs[timespan];
    }

    switch (timespan){
        case 1:
            drawGoldChartMonth(GoldValueData);
            break;
        case 2:
            drawGoldChartHalfYear(GoldValueData)
            break;
        case 0:
            drawGoldChartWeek(GoldValueData);
            break;
    }
}


function ChangeCurrenciesTimeSpan(timespan){
    let timeSpansDivs = ["chartWeek_div","chartMonth_div", "chartHalfYear_div"];

    if(!timeSpanChanged){
        $("#chartWeek_div").attr('id',`${timeSpansDivs[timespan]}`);
        
        timeSpanChanged = true;
        newTimeSpanId = timeSpansDivs[timespan];
    }
    else{
        $(`#${newTimeSpanId}`).attr('id',`${timeSpansDivs[timespan]}`);
        newTimeSpanId = timeSpansDivs[timespan];
    }

    switch (timespan){
        case 1:
            drawGoldChartMonth(CurrencyValueData);
            break;
        case 2:
            drawGoldChartHalfYear(CurrencyValueData)
            break;
        case 0:
            drawGoldChartWeek(CurrencyValueData);
            break;
    }
}

// Funkcja pokazuje wykres z danymi konwersji
function showChart() {
    
    if (chartVisible) {
        // Jeśli wykres jest już widoczny, usuń zawartość
        chartContainer.innerHTML = '';
        chartVisible = false;
        $("#chartWeek_div").hide();
        $("#chartHalfYear_div").hide();
        $("#chartMonth_div").hide();
    } else {
            // Jeśli wykres nie jest widoczny, dodaj zawartość
            chartContainer.innerHTML = `
            <div id="chartButtons" class="d-flex justify-content-center mb-3">
            <button class="btn btn-outline-light mx-2" data-range="1w" id="WeekBtn">1W</button>
            <button class="btn btn-outline-light mx-2" data-range="1m" id='MonthBtn'>1M</button>
            <button class="btn btn-outline-light mx-2" data-range="6m" id='HalfYearBtn'>6M</button>
            </div>
            <div id="chartContentContainer">
            <div id="chartWeek_div"></div>
            </div>
            `;
            chartVisible = true;
            $("#chartWeek_div").show();
            $("#chartHalfYear_div").show();
            $("#chartMonth_div").show();
            
            if(isCurrencies=="False"){      
                ChangeGoldTimeSpan(0);
                $("#WeekBtn").on('click', function() {ChangeGoldTimeSpan(0)});
                $("#MonthBtn").on('click', function() {ChangeGoldTimeSpan(1)});
                $("#HalfYearBtn").on('click', function() {ChangeGoldTimeSpan(2)});
            }
            else{
                ChangeCurrenciesTimeSpan(0)
                $("#WeekBtn").on('click', function() {ChangeCurrenciesTimeSpan(0)});
                $("#MonthBtn").on('click', function() {ChangeCurrenciesTimeSpan(1)});
                $("#HalfYearBtn").on('click', function() {ChangeCurrenciesTimeSpan(2)});
            }
            
            // Ustawienie domyślnie aktywnego przycisku
            document.querySelector('#chartButtons button[data-range="1w"]').classList.add('active');
        
    }
}


function UpdateCurrentCurrencyData(){
    let fromCurrencyCode = $('#fromCurrency').val().split(",");
    let toCurrencyCode = $('#toCurrency').val().split(",");
    let today = new Date().toISOString().slice(0, 10)
    var halfYear = new Date(new Date().setDate(new Date().getDate() - 183)).toISOString().slice(0, 10);
    fetchCurrencyChartData(halfYear,today,fromCurrencyCode[1],toCurrencyCode[1]);
    if (chartVisible) {
        // Jeśli wykres jest już widoczny, usuń zawartość
        chartContainer.innerHTML = '';
        chartVisible = false;
        $("#chartWeek_div").hide();
        $("#chartHalfYear_div").hide();
        $("#chartMonth_div").hide();
    }
}

$(document).ready(function () {
    $("#amountInput").blur(function(){
        formatAmount();
        validateAmount();
    });

    $("#editButton").on('click', toggleEditMode);
    $("#addCurrencyBtn").on('click',showAddCurrency);
    $("#switchBtn").on('click',swapCurrencies);
    $("#chartWeek_div").hide();
    isCurrencies = $(".PageView").attr("id");
    $('#toCurrency').on('change',UpdateCurrentCurrencyData);
    $('#fromCurrency').on('change',UpdateCurrentCurrencyData);
    fetchCurrenciesData(); // Pobierz dane walut
    $('#convertButton').on('click', convertCurencies); // Obsługa przycisku konwersji
    $('#chartButton').on('click', showChart); // Obsługa przycisku wykresu
    $("#GoldViewButton").on('click', changeView); 
    fetchGoldData(); // Pobierz dane o złocie
});