# Aplikacja webowa `IOProjekt`
Projekt na Inżynierię programowania, kierunek Nowoczene Technologie w Kryminalistyce, sem. V, grupa I, piątek 13:15

## 📋 Opis projektu
`IOProjekt` to  aplikacja webowa stworzona w Pythonie z wykorzystaniem frameworka **Flask** oraz kaskadowych arkuszy stylów **Bootstrap**. Projekt pokazuje, jak można stworzyć wielomodułową aplikację webową z obsługą zewnętrznego API, systemem logowania użytkowników oraz integracją z bazą danych.

### Cel projektu
Aplikacja tworzona w ramach zajęć z Inżynierii Oprogramowania, ma za zadanie dostarczyć informacje pogodowe, kryminalne i sportowe prosty i przejrzysty sposób dla użytkowników. System ma umożliwiać także wizualizację historycznych danych pogodowych i ekonomicznych. 

### Główne funkcje
- Aplikacja musi wyświetlać temperature, opady i ciśnienie dla pięciu lokalizacji
- Użytkownik powinien otrzymać alerty o opadach śniegu i temperaturach poniżej 0 C
- Użytkownik może przeglądać najnowsze wiadomości kryminalne dla miasta Krakowa
- Aplikacja powinna wyświetlać aktualne kursy walut, złota
- Aplikacja umożliwia wizualizację graficzną danych historycznych o pogodzie i danych ekonomicznych
- Użytkownik może sprawdzić święta, wydarzenia na uczelni oraz imieniny

### Metodologia prowadzenia projektu
Projekt prowadzony jest w metodologi SCRUM. Szczegółowa dikumntacja prowadzenia projektu dostepna jest w [Project Plan](docs/SerwisInformacyjny-1315.xlsx).

## 📐 Architektura Projektu

### Warsty Aplikacji
Aplikacja składa się z trzech głównych warstw:

1. Frontend:
   **Opis**: Warstwa frontendowa odpowiada za interfejs użytkownika. Szablony HTML są renderowane przez Flask i mogą korzystać z frameworka CSS Bootstrap.
   **Pliki**: Znajdują się w katalogach templates/ oraz static/ w poszczególnych modułach.

2. Backend:
   **Opis**: Warstwa backendowa obsługuje logikę aplikacji, przetwarzanie danych oraz komunikację z bazą danych. Flask API obsługuje zapytania HTTP i zarządza trasami.
   **Pliki**: Znajdują się w plikach .py w poszczególnych modułach.

3. Baza Danych:
   **Opis**: Warstwa bazy danych przechowuje dane aplikacji, takie jak dane logowania użytkowników. SQLAlchemy jest używane jako ORM do zarządzania bazą danych.
   **Pliki**: Konfiguracja bazy danych znajduje się w config.py.

### Moduły Aplikacji
Aplikacja składa się z nastepujących modułów:
1. Moduł Główny (`Home`)
- **Ścieżka** : `/home`
- **Opis**: Zawiera główne trasy aplikacji, stronę główną, toolbar do nawigacji oraz przekierowanie do poszczefólnych serwisów plikacji. Obsługuje mechaniz rejestracji i logowania. 

2. Moduł Ekonomii (`economy`)
- **Ścieżka**: `/economy`
- **Opis**: Zawiera trasy związane z ekonomią i finansami. Wyświetlane są informacje o kursie walut i złota oraz ich wykresy. Dostarcza preview kursów walut i dane historyczne na stronę główną.
- **Dokumentacja**: [Dokumentacja_modulu_ekonomicznego](docs/EconomyDocs.md)

3. Moduł Pogody (`weather`)
- **Ścieżka**: `/weather`
- **Opis**: Zawiera trasy związane z pogodą, wyświetla dane pogodowe dla wybranych przez użytkownika miast. Dostarcza na stronę główną preview z aktualnymi informacjami pogodowymi dla wynranych miast oraz wykres danych hisorycznych.

4. Moduł Kalendarza (`calendar`)
- **Ścieżka**: `/calendar`
- **Opis**: Zawiera trasy związane z kalendarzem i wydarzeniami. Dostarcza na stronę główną moduł kalendarza umożliwiający sprawdzenie imienin i wydarzeń w wybranym dniu.

5. Moduł Wiadomości (`news`)
- **Ścieżka**: `/news`
- **Opis**: Zawiera trasy związane z wiadomościami i artykułami. Wyświetla informacje kryminalne dla miasta Krakowa, dostarcza preview na stronę główną z najnowszą wiadomością.

### 📦 Struktura katalogów

```
IOProjekt
|   .gitignore
|   diagram aktywności.jpg
|   README.md
|
\---App
    |   app.py
    |   config.py
    |   models.py
    |   requirements.txt
    |   run.py
    |
    +---docs
    |       Acceptance_TP.xlsx
    |       InżynieriaOprogramowania.md
    |       testing.md
    |
    +---instance
    |       app.db
    |
    +---Modules
    |   |   __init__.py
    |   |
    |   +---Economy
    |   |   |   routes.py
    |   |   |   __init__.py
    |   |   |
    |   |   +---Static
    |   |   |       charts.js
    |   |   |       chart_data.js
    |   |   |       script.js
    |   |   |       script_preview.js
    |   |   |       style.css
    |   |   |
    |   |   +---Templates
    |   |   |       About.txt
    |   |   |       currency.html
    |   |   |       economyBase.html
    |   |   |       economy_preview.html
    |   |   |       gold.html
    |   |   |
    |   |   \---__pycache__
    |   |           routes.cpython-310.pyc
    |   |           __init__.cpython-310.pyc
    |   |
    |   +---Home
    |   |   |   About.txt
    |   |   |   forms.py
    |   |   |   routes.py
    |   |   |   __init__.py
    |   |   |
    |   |   +---static
    |   |   |       charts.js
    |   |   |       chart_data.js
    |   |   |       style.css
    |   |   |
    |   |   +---Templates
    |   |   |       About.txt
    |   |   |       base.html
    |   |   |       home.html
    |   |   |       info.html
    |   |   |       login.html
    |   |   |       register.html
    |   |   |
    |   |   \---__pycache__
    |   |           forms.cpython-310.pyc
    |   |           routes.cpython-310.pyc
    |   |           __init__.cpython-310.pyc
    |   |
    |   +---News
    |   |   |   About.txt
    |   |   |   calendar_routes.py
    |   |   |   Diagram_komponentów_UML_CALENDAR.jpg
    |   |   |   jest.config.js
    |   |   |   news.py
    |   |   |   news_scraper.py
    |   |   |   package-lock.json
    |   |   |   package.json
    |   |   |   requirements.txt
    |   |   |   __init__.py
    |   |   |
    |   |   +---static
    |   |   |       news_style.css
    |   |   |       script_calendar.js
    |   |   |       styles_calendar.css
    |   |   |
    |   |   +---Templates
    |   |   |       About.txt
    |   |   |       calendar.html
    |   |   |       error.html
    |   |   |       news.html
    |   |   |       news_base.html
    |   |   |       news_preview.html
    |   |   |       search_results.html
    |   |   |
    |   |   +---tests
    |   |   |       script_calendar.test.js
    |   |   |
    |   |   \---__pycache__
    |   |           calendar_routes.cpython-310.pyc
    |   |           news.cpython-310.pyc
    |   |           news_scraper.cpython-310.pyc
    |   |           __init__.cpython-310.pyc
    |   |
    |   +---Weather
    |   |   |   About.txt
    |   |   |   routes.py
    |   |   |   test.py
    |   |   |   test_routes.py
    |   |   |   weather_graph_info.py
    |   |   |   weather_models.py
    |   |   |   __init__.py
    |   |   |
    |   |   +---Static
    |   |   |       home.js
    |   |   |       preview.js
    |   |   |       previewstyle.css
    |   |   |       style.css
    |   |   |
    |   |   +---Templates
    |   |   |       About.txt
    |   |   |       home_js_test.html
    |   |   |       weather.html
    |   |   |       weather_preview.html
    |   |   |
    |   |   \---__pycache__
    |   |           routes.cpython-310.pyc
    |   |           test_routes.cpython-310.pyc
    |   |           weather_graph_info.cpython-310.pyc
    |   |           weather_models.cpython-310.pyc
    |   |           __init__.cpython-310.pyc
    |   |
    |   \---__pycache__
    |           __init__.cpython-310.pyc
    |
    +---static
    |       favicon.ico
    |
    +---tests
    |   |   __init__.py
    |   |
    |   +---acceptance
    |   |       test_calendar_acceptance.py
    |   |       test_economy_acceptance.py
    |   |       test_home_acceptance.py
    |   |       test_news_acceptance.py
    |   |       test_weather_acceptance.py
    |   |       __init__.py
    |   |
    |   +---integration
    |   |       test_home_integration.py
    |   |       test_news_integration.py
    |   |       __init__.py
    |   |
    |   \---unit
    |           test_home_unit.py
    |           test_news_unit.py
    |           __init__.py
    |
    \---__pycache__
            app.cpython-310.pyc
            config.cpython-310.pyc
            models.cpython-310.pyc

---

### 📊 Wykorzystywane technologie

## 1. Frontend
- **HTML**: Struktura aplikacji.
- **CSS (Bootstrap)**: Stylizacja aplikacji.
- **JavaScript**: Funkcjonalności interaktywne.
- **Google Charts**: Wizualizacja danych w aplikacji.

## 2. Backend
- **Python (Flask)**: Framework Flask do obsługi backendu.
- **SQLAlchemy**: ORM do zarządzania bazą danych.
- **BeautifulSoup**: Biblioteka do web scrapingu (dane pobierane ze strony `krknews.pl/category/kryminalne`).

## 3. Testowanie
- **JavaScript (Jest)**: Testy jednostkowe.
  - Mockowanie elementów DOM i `fetch`.
- **Python (unittest, pytest)**: Testy integracyjne i funkcjonalne.
  - Selenium do testowania interfejsu użytkownika.

## 4. Automatyzacja testów
- **Selenium**: Testowanie interfejsu użytkownika w przeglądarce.
- **WebDriver**: Automatyzacja testów przeglądarkowych.

## 5. Narzędzia wspomagające
- **JSON**: Format danych do komunikacji z zewnętrznymi API.
- **Flask-Login**: Obsługa autoryzacji użytkowników.
- **Flask-WTF**: Obsługa formularzy.
- **Flask-Limiter**: Ograniczanie liczby żądań.
- **Prettier, Pylint**: Narzędzia do formatowania i analizy kodu.

## 🚀 Instalacja i uruchomienie

### 1. Wymagania:
- **Python 3.8+**
- **Pip**
- **Virtualenv** (opcjonalnie, ale zalecane)

### 2. Instalacja:
1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/JakubBukowski/IOProjekt.git
   cd news
   ```

2. Utwórz i aktywuj wirtualne środowisko:
   ```bash
   python3 -m venv .env
   .\.env\Scripts\activate

   ```

3. Zainstaluj wymagane zależności:
   ```bash
   pip install -r requirements.txt
   ```


### 3. Uruchomienie aplikacji:
1. Uruchom serwer:
   ```bash
   python .\app\run.py
   ```
2. Otwórz przeglądarkę i przejdź do:
   ```
   http://127.0.0.1:8000
   ```

---

## ⚙️ Konfiguracja

Aplikacja używa pliku `config.py` do przechowywania ustawień. Przykładowa konfiguracja:
```python
class Config:
    SECRET_KEY = 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
```

Jeśli potrzebujesz niestandardowej konfiguracji, utwórz plik `.env` i zdefiniuj zmienne środowiskowe:
```env
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///app.db
```

---

## 🛠️ Testowanie
Większość testów jest zorganizowana w katalogu `tests/`. 
Dla Aplikacji opracowano testy jednostkowe, integracyjne i akceptacyjne.
Dla testów akceptacyjnych reazlizowanych z wykorzystaniem Selenium opracowany został plan testowania [Test Plan](App/docs/Acceptance_TP.xlsx).
Więcej szczegółów znajdziesz w pliku [Testing Documentation](App/docs/testing.md).`

## 📖 API Dokumentacja

### API Zewnętrzne

1. Serwis pogodowy
   Dane pogodowe pobierane są z API udostepnianego przez OpenWeather
   
    - **Dokumentacja API**: https://openweathermap.org/api
    - **Opis**: Używane do uzyskania aktualnych danych pogodowych oraz widgetów.
    - **Przykładowe żądanie**:
      ``` GET: https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric ```
      ``` Host: api.openweathermap.org ``` 
  
   oraz API udostępnianego przez IMGW-PIB

    - **Dokumentacja API**: https://danepubliczne.imgw.pl/pl/apiinfo
    - **Opis**: Używane do uzyskania aktualnych danych o deszczu.
    - **Przykładowe żądanie**:
       ``` GET  https://danepubliczne.imgw.pl/api/data/synop/station/${cityNameNoSpace} ```

2. Serwis ekonomiczny
   Dane ekonomiczne są pobierane z API udostępnianego przez NBP:
   
    - **Dokumentacja API**: https://api.nbp.pl
    - **Opis**: Używane do uzyskania aktualnych danych o kursach walut w Polsce.
    - **Przykładowe żądanie**:
      ``` GET: http://api.nbp.pl/api/exchangerates/rates/A/USD/?format=json ```
      ``` Host: https://api.nbp.pl ``` 

    - **Opis**: Używane do uzyskania aktualnych danych o kursie złota w Polsce.
    - **Przykładowe żądanie**:
       ``` GET:  https://api.nbp.pl/api/cenyzlota/today ```
       ``` Host: https://api.nbp.pl ```

3. Serwis wiadomości kryminalnych
   Wiadomości są pobierane ze strony 'krknews.pl' za pomocą stworzonego w ramach projektu webscrapera:
   
    - **Dokumentacja biblioteki użytej do scrapingu**: https://www.crummy.com/software/BeautifulSoup/bs4/doc/
    - **Opis**: Używane do uzyskania ostatnich wiadomości kryminalnych z Krakowa.
    - **Przykładowe żądanie**:
      ``` GET: https://krknews.pl/category/kryminalne/page/1/ ```

4. Kalendarz

   Informacje o Imieninach
    - **Dokumentacja API**: https://github.com/xnekv03/nameday-api
    - **Opis**: Używane do uzyskania informacji o imieninach w podanym dniu.
    - **Przykładowe żądanie**:
      ``` https://nameday.abalin.net/api/V1/getdate?day=15&month=1&country=pl&timezone=Europe/Warsaw ```
      
   Informacje o świętach  
    - **Dokumentacja API**: https://github.com/pniedzwiedzinski/kalendarz-swiat-nietypowych
    - **Opis**: Używane do uzyskania informacji o świętach w podanym dniu.
    - **Przykładowe żądanie**:
      ``` GET: https://pniedzwiedzinski.github.io/kalendarz-swiat-nietypowych/1/15.json  ``` 

### API Aplikacji
Szczegółowa dokumentacja API znajduje się w pliku [API Documentation](docs/api.md).

Przykładowy endpoint:

1. Endpoint: `/weather`

**GET /weather**
    - **Opis**: Pobiera aktualne dane pogodowe oraz prognozę dla 5 miast
    - **Metoda HTTP**: GET
    - **URL**: `/weather`
    - **Parametry**: Brak

2. Endpoint: `/economy/currency`

**GET /economy/currency**
    - **Opis**: Pobiera aktualne dane o kursach walut
    - **Metoda HTTP**: GET
    - **URL**: `/economy/currency`
    - **Parametry**: Brak

3. Endpoint: `/economy/gold`

**GET /economy/gold**
    - **Opis**: Pobiera aktualne dane o kursie złota
    - **Metoda HTTP**: GET
    - **URL**: `/economy/gold`
    - **Parametry**: Brak

4. Endpoint: `/news/1`

**GET /news/<int:page>**
    - **Opis**: Pobiera ostatnie artykuły kryminalne z Krakowa
    - **Metoda HTTP**: GET
    - **URL**: `/news/<int:page>`
    - **Parametry**: Brak

5. Endpoint: `/news/search?q=krakow`

**GET /news/search**
    - **Opis**: Wyszukuje wiadomości kryminalne z Krakowa po słowie-klucz
    - **Metoda HTTP**: GET
    - **URL**: `/news/search`
    - **Parametry**: Brak

6. Endpoint: `/api/data?day=15&month=1`

**GET /api/data**
    - **Opis**: Zwraca informacje o imieninach oraz nietypowych świętach dla podanej daty
    - **Metoda HTTP**: GET
    - **URL**: `/api/data`
    - **Parametry**:
     - `day` (wymagane) – dzień miesiąca.
     - `month` (wymagane) – numer miesiąca.


## 👥 Autorzy

- **Mirosław Ossysek** - Project Owner
- **Jakub Bukowski** - Scrum Master
- **Studenci NTwK AGH w Krakowie** - Scrum Team

---

## 📄 Licencja

Projekt jest udostępniony na licencji MIT. Szczegóły znajdziesz w pliku [LICENSE](LICENSE).

---

## ❓ Kontakt

Jeśli masz pytania lub problemy, napisz na:
- GitHub: [https://github.com/JakubBukowski](https://github.com/JakubBukowski)


