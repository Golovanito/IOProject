from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest
import subprocess
import time

# Konfiguracja przeglądarki
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)

try:
    # Otwieranie strony
    driver.get("https://ioprojekt.onrender.com/economy/currency")  # Zmień URL na właściwy adres Twojej aplikacji
    time.sleep(2)
    # logowanie
    username_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "username"))
    )
    username_input.send_keys("okok")

    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys("okok")

    submit_button = driver.find_element(By.ID, "btn-log")
    submit_button.click()

    driver.get("https://ioprojekt.onrender.com/economy/currency")
    time.sleep(2)
  
    amount_input = driver.find_element(By.ID, "amountInput")
    amount_input.clear()
    amount_input.send_keys("100,00")
    time.sleep(2)

    convert_button = driver.find_element(By.ID, "convertButton")
    convert_button.click()
    time.sleep(2)

    alert = Alert(driver)  # Przechwycenie alertu
    alert.accept()
    time.sleep(2)

    # Wybierz waluty i wprowadź kwotę
    from_currency = driver.find_element(By.ID, "fromCurrency")
    from_currency.click()
    time.sleep(2)

    options = from_currency.find_elements(By.TAG_NAME, "option")
    for option in options:
        if 'USD - dolar amerykański' in option.text:
            option.click()
            break
    from_currency.click()
    time.sleep(2)

    to_currency = driver.find_element(By.ID, "toCurrency")
    to_currency.click()  # Rozwijamy menu waluty docelowej
    time.sleep(2)

    options = to_currency.find_elements(By.TAG_NAME, "option")
    for option in options:
        if 'EUR - euro' in option.text:
            option.click()  # Kliknij opcję EUR
            break
    to_currency.click()
    time.sleep(2)

    swap_button = driver.find_element(By.CLASS_NAME, "switch-button")
    swap_button.click()
    time.sleep(2)


    # Kliknij przycisk konwersji
    convert_button = driver.find_element(By.ID, "convertButton")
    convert_button.click()
    time.sleep(2)

    # Sprawdź, czy wynik konwersji się pojawił
    result = driver.find_element(By.ID, "conversionResult")
    if "Wynik przewalutowania" not in result.text:
        raise Exception("Wynik przewalutowania nie pojawił się na stronie")
    time.sleep(2)

    chart_button = driver.find_element(By.ID, "chartButton")
    chart_button.click()
    time.sleep(2)

    # Zmiana zakresu danych na 1M
    chart_buttons = driver.find_elements(By.CSS_SELECTOR, "#chartButtons button")
    for button in chart_buttons:
        if button.text.strip() == "1M":
            button.click()
            break
    time.sleep(2)

    # Zamknięcie wykresu
    chart_button.click()
    time.sleep(2)

    # Przejście na zakładkę złota
    gold_button = driver.find_element(By.ID, "GoldViewButton")
    gold_button.click()
    time.sleep(2)

    # Wyświetlenie wykresu złota
    chart_button = driver.find_element(By.ID, "chartButton")
    chart_button.click()
    time.sleep(2)

    # Zmiana zakresu danych na 1M
    chart_buttons = driver.find_elements(By.CSS_SELECTOR, "#chartButtons button")
    for button in chart_buttons:
        if button.text.strip() == "1R":
            button.click()
            break
    time.sleep(2)

    # Zamknięcie wykresu
    chart_button.click()
    time.sleep(2)

    # Wejdź w sekcję wyboru waluty
    add_currency_button = driver.find_element(By.ID, "addCurrencyBtn")
    add_currency_button.click()
    time.sleep(2)

    dropdown_button = driver.find_element(By.ID, "dropdownMenuButton1")
    dropdown_button.click()
    time.sleep(2)

    # Wybierz walutę USD
    usd_option = driver.find_element(By.XPATH, "//li[contains(text(), 'USD - dolar amerykański')]")
    usd_option.click()
    time.sleep(2)

    # Wybierz walutę EUR
    dropdown_button.click()
    time.sleep(2)
    eur_option = driver.find_element(By.XPATH, "//li[contains(text(), 'EUR - euro')]")
    eur_option.click()
    time.sleep(2)

    # Wybierz walutę GBP
    dropdown_button.click()
    time.sleep(2)
    gbp_option = driver.find_element(By.XPATH, "//li[contains(text(), 'GBP - funt szterling')]")
    gbp_option.click()
    time.sleep(2)

    edit_button = driver.find_element(By.ID, "editButton")
    edit_button.click()
    time.sleep(2)

    currency_list = driver.find_elements(By.CSS_SELECTOR, ".currency-row")
    for row in currency_list:
        currency_name = row.find_element(By.CSS_SELECTOR, ".col-4.text-center").text
        if "EUR - euro" in currency_name or "GBP - funt szterling" in currency_name:
            remove_button = row.find_element(By.CSS_SELECTOR, ".btn-remove")
            remove_button.click()
            time.sleep(2)  # Poczekaj chwilę po usunięciu, aby zaktualizowała się lista

    edit_button.click()
    time.sleep(2)

except Exception as e:
    print(f"Test zakończony niepowodzeniem: {e}")

finally:
    driver.quit()