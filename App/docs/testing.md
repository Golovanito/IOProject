# Testowanie - dokumentacja
Dokumentacja dotyczy testów, które wchodzą w skład aplikacji i sprawdzają jej poprawne działanie.

## 🛠️ Wersja
Wszystkie testy działają przy wersji aplikacji pobranej z brancha 'main'.

## 📊 Technologie
W tetstach wykorzystano technologie:
- SQLite - do stworzenia izolowanej, testowej bazy danych w testach jednostkowych i integracyjnych
- pytest - do testów jednostkowych i integracyjnych kodu napisanego we Flasku
- QUnit - do testów jednostkowych kodu napisanego w JavaScriptcie
- Selenium - do testów akceptacyjnych

## 📦 Struktura katalogów z testami
Wszystkie testy, oprócz testów jednostkowych napisanych w JavaScriptcie, znajdują się w folderze 'tests', w którym zosatły podzielone na poszczególne foldery do testów jednostkowych ('unit'), integracyjnych ('integration') i akceptacyjnych ('acceptance').

tests\
├── unit\             # Testy jednostkowe
├── integration\      # Testy integracyjne
└── acceptance\       # Testy akceptacyjne

Testy jednostkowe pogody napisane w JavaScriptcie znajdują się w sekcji 'script' pliku html - 'Modules\Weather\Templates\home_js_test.html'.
Testy jednostkowe kalendarza znajdująsię w pliku - Modules\News\tests\script_calendar.test.js.

## 🚀 Uruchamianie testów
Testy można uruchomić (z wyłączeniem testów w JavaScriptcie) za jednym razem za pomocą komendy:
```bash
pytest .\test
```
Przy uruchamianiu poszczególnych rodzai testów należy dopisać dodatkowo nazwę folderu, w którym znajdują się testy - przykład:
```bash
pytest .\test\unit
```
Testy jednostkowe kodu pogody napisanego w JavaScriptcie uruchamia się za pomocą przejścia na odpowiedni endpoint - weather/weather_test. Po włączeniu serwera, można je włączyć w przeglądarce lub przy pomocy komendy start i url strony (np. http://127.0.0.1:8000/weather/weather_test):
```bash
start http://127.0.0.1:8000/weather/weather_test
```
Wynik testów jednostkowych kodu napisanego w JavaScriptcie jest pokazywany w konsoli i zapisywany w pliku w folderze 'unit' w katalogu 'tests'.

W celu uruchomienia testów jednostkowych kalendarza znajdujących się w pliku Modules\News\tests\script_calendar.test.js należy wykonać następujące kroki:
- odkomentuj kod znajdujący się na końcu pliku Modules\News\static\script_calendar.js
- Wpisz do konsoli następujące komendy:
```bash
cd Modules\News
```
```bash
npm install --save-dev jest-environment-jsdom
```
```bash
npx jest script_calendar.test.js
```
Wyniki testów będą wyświetlone w konsoli.

## 📋 Podział testów

### Testy jednostkowe
Testy jednostkowe sprawdzają działanie pojedynczych elementów aplikacji.
Łącznie testów jednostkowych jest 21 rozdzielonych na 4 pliki.

Plik 'test_home_unit.py':
- *test_registration_form_valid*:
  - sprawdza poprawność działania walidatorów w formularzu do rejestracji (prawidłowe dane)
- *test_registration_form_invalid*:
  - sprawdza poprawność działania walidatorów w formularzu do rejestracji (nieprawidłowe dane)
- *test_registration_form_invalid_username_length*:
  - sprawdza poprawność działania walidatorów w formularzu do rejestracji (nieprawidłowe dane)
- *test_login_form_valid*:
  - sprawdza poprawność działania walidatorów w formularzu do logowania (prawidłowe dane)
- *test_login_form_invalid*:
  - sprawdza poprawność działania walidatorów w formularzu do rejestracji (nieprawidłowe dane)
- *test_database_connection*: 
  - sprawdza połączenie z bazą danych

Plik 'script_calendar.test.js':
- *createCalendar*:
  - sprawdza poprawne generowanie kalendarza dla wybranego miesiąca i roku
  - sprawdza, czy dzisiejsza data w kalendarzu jest odpowiednio oznaczona
- *changeMonth*:
  - weryfikuje działanie funkcji zmiany miesiąca na kolejny
  - weryfikuje działanie funkcji zmiany miesiąca na poprzedni
- *updateMonthYear*:
  - sprawdza, czy komponent poprawnie aktualizuje nazwę miesiąca i rok
- *Integracja komponentów*:
  - sprawdza, czy zmiana miesiąca automatycznie odświeża widok kalendarza z poprawnymi danymi

Plik 'home_js_test.html':
- *replacePolishChars function*:
  - sprawdcza, czy funkcja zamienia polskie znaki
- *capitalizeFirstLetter function*:
  - sprawdza, czy pierwsza litera wyrazu jest napisana dużą literą
- *updateWeatherWidget function (mocked)*:
  - weryfikuje działanie funkcji aktualizującej pogodę
- *showSelectContainer function*:
  - weryfikuje działanie funkcji pokazującej kontener
- *hideSelectContainer function*:
  - weryfikuje działanie funkcji chowającej kontener

Plik 'test_news_unit.py':
- *test_webscraper*:
  - Sprawdzenie poprawności działania webscrapera
- *test_webscraper_all_articles*:
  - Sprawdzenie poprawności działania webscrapera przy załadowaniu wszystkich wiadomości
- *test_webscraper_success_mocking*:
  - Sprawdzenie poprawności działania webscrapera, poprawności parsowania wyników scrapingu z wykorzystaniem mockingu
- *test_webscraper_no_articles_mocking*:
  - Sprawdzenie poprawności działania webscrapera przy zerowej ilości artykułów do pobrania z wykorzystaniem mockingu
- *test_webscraper_invalid_page_mocking*:
  - Sprawdzenie poprawności działania webscrapera przy niepoprawnym działaniu serwisu 'krknews.pl' (kodzie 404) z wykorzystaniem mockingu
- *test_webscraper_all_articles_mocking*:
  - Sprawdzenie poprawności działania webscrapera przy załadowaniu wszystkich wiadomości z wykorzystaniem mockingu

### Testy integracyjne
Testy integracyjne sprawdzają poprawną współpracę między różnymi elementami aplikacji.
Łącznie testów integracyjnych jest 12 rodzielonych na 2 pliki.

Plik 'test_home_integration.py':
- *test_invalid_username_with_special_characters*:
  - sprawdza reakcję aplikacji na próbę rejestracji nazwy użytkownika z niewłaściwymi znakami
- *test_add_user_to_database*:
  - sprawdza czy dodawanie użytkownika do bazy działa poprawnie
- *test_response_200*:
  - sprawdza odpowiedź serwera dla poprawnej ścieżki
- *test_response_404*:
  - sprawdza odpowiedź serwera dla niepoprawnej ścieżki
- *test_redirect*:
  - sprawdza działanie przekierowanie rejestracja → logowanie → strona główna i wylogowanie → logowanie
- *test_user_registration*:
  - sprawdza proces rejestracji użytkownika i zapis użytkownika do bazy danych
- *test_xss_protection*:
  - sprawdza zabezpieczenie strony przeciwko atakom XSS
- *test_ddos_protection*:
  - sprawdza zabezpieczenie strony przeciwko atakom DDoS
 
Plik 'test_news_integration.py':
- *test_news_route*:
  - sprawdza dostęp do strony "News" po logowaniu
- *test_search_route*
  - sprawdza, czy działa wyszukiwanie
- *test_news_page_no_articles*
  - sprawdza czy wyświetla się strona z komunikatem "Brak wiadomości do wyświetlenia na tej stronie.", przy niezaładowaniu artykułów (błędzie API)
- *test_news_page_connection_error*
  - sprawdza czy wyświetla się strona z komunikatem "Nie udało się połączyć z serwisem krknews.pl.", przy błędzie połączenia z API

### Testy akceptacyjne
Testy akceptacyjne symulują rzeczywiste działania użytkownika na stronie.
Dla testów akceptacyjnych został opracowany plan testowania w pliku 'Acceptance_TP.xlsx' (docs/Acceptance_TP.xlsx).

Testy akceptacyjne dzielą się na 5 plików:
- test_home_accepptance.py - sprawdza działanie rejestracji, logowania, ładowania strony głównej wraz z elementami zawierające 'podglądy' innych stron i navbara, czyli kliknięcie wszystkich możliwych przycisków i poprawność ładowania stron
- test_economy_acceptance.py - sprawdza, czy zalogowany użytkonik może dokonać konwersji walut i złota, czy wyniki konwersji są poprawne oraz czy wykresy są tworzone poprawnie
- test_weather_acceptance - sprawdza działanie serwisu pogodowego, czyli dodawanie i usuwanie miast, odświeżanie danych i poprawność wyświtlanych wyników
- test_selenium_calendar.py - sprawdza, czy kalendarz ładuje się poprawnie po załadowaniu strony, czy nawigacja między miesiącami działa poprawnie, czy jest możliwość wyboru daty w kalendarzu i czy wyświetlają się informacje o wybranym dniu
- test_news_acceptance.py - sprawdza czy poprawnie ładuję się strona "News", czy artykuły są załadowane, czy artykuły posiadają tytuły, czy działa wyszukiwanie artykułów po słowie-klucz oraz czy działają przyciski