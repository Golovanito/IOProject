from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
import time


class TestKalendarzaNaStronieGlownej(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("https://ioprojekt.onrender.com")
        self.driver.maximize_window()
        print(f"\nRozpoczynanie testu: {self._testMethodName}")

    def tearDown(self):
        # Zamknięcie przeglądarki po każdym teście
        self.driver.quit()
        print(f"Zakończono test: {self._testMethodName}")

    def test_kalendarz_ladowanie(self):
        try:
            driver = self.driver
            kalendarz = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "calendar"))
            )
            self.assertIsNotNone(
                kalendarz, "Kalendarz nie został załadowany na stronie"
            )

            # Sprawdzenie, czy wyświetlana jest nazwa miesiąca i rok
            miesiac_rok = driver.find_element(By.ID, "month-year")
            self.assertIsNotNone(
                miesiac_rok.text, "Nie wyświetlono nazwy miesiąca i roku"
            )
            print(f"✅ Test {self._testMethodName} zakończony pomyślnie")
        except Exception as e:
            print(f"❌ Test {self._testMethodName} nie powiódł się: {e}")
            raise

    def test_kalendarz_nawigacja(self):
        try:
            driver = self.driver
            # Znalezienie przycisków nawigacyjnych
            przycisk_nastepny = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.ID, "next-month"))
            )
            przycisk_poprzedni = driver.find_element(By.ID, "prev-month")

            # Pobranie początkowego miesiąca i roku
            poczatkowy_miesiac_rok = driver.find_element(
                By.ID, "month-year"
            ).text

            # Przejście do następnego miesiąca
            przycisk_nastepny.click()
            time.sleep(1)  # Czekanie na aktualizację kalendarza
            nowy_miesiac_rok = driver.find_element(By.ID, "month-year").text
            self.assertNotEqual(
                poczatkowy_miesiac_rok,
                nowy_miesiac_rok,
                "Nawigacja do następnego miesiąca nie powiodła się",
            )

            # Powrót do poprzedniego miesiąca
            przycisk_poprzedni.click()
            time.sleep(1)  # Czekanie na aktualizację kalendarza
            przywrocony_miesiac_rok = driver.find_element(
                By.ID, "month-year"
            ).text
            self.assertEqual(
                poczatkowy_miesiac_rok,
                przywrocony_miesiac_rok,
                "Nawigacja do poprzedniego miesiąca nie powiodła się",
            )
            print(f"✅ Test {self._testMethodName} zakończony pomyślnie")
        except Exception as e:
            print(f"❌ Test {self._testMethodName} nie powiódł się: {e}")
            raise

    def test_kalendarz_wybor_daty(self):
        try:
            driver = self.driver
            # Znalezienie pierwszego dostępnego dnia
            pierwszy_dzien = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CLASS_NAME, "day"))
            )
            # Przewiń stronę do elementu i kliknij za pomocą JavaScript
            driver.execute_script(
                "arguments[0].scrollIntoView(true);", pierwszy_dzien
            )
            driver.execute_script("arguments[0].click();", pierwszy_dzien)
            time.sleep(1)  # Czekanie na zaktualizowanie szczegółów

            # Sprawdzenie, czy wyświetlana jest wybrana data
            wybrana_data = driver.find_element(By.ID, "selected-date")
            self.assertIsNotNone(
                wybrana_data.text,
                "Wybrana data nie została wyświetlona poprawnie",
            )

            # Sprawdzenie, czy wyświetlane są imieniny i święta
            imieniny = driver.find_element(By.ID, "namedays")
            swieta = driver.find_element(By.ID, "holidays")
            self.assertIsNotNone(
                imieniny.text,
                "Imieniny nie zostały wyświetlone",
            )
            self.assertIsNotNone(
                swieta.text,
                "Święta nie zostały wyświetlone",
            )
            print(f"✅ Test {self._testMethodName} zakończony pomyślnie")
        except Exception as e:
            print(f"❌ Test {self._testMethodName} nie powiódł się: {e}")
            raise


if __name__ == "__main__":
    unittest.main()
