from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import time

# Konfiguracja przeglądarki
options = webdriver.ChromeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Chrome(options=options)

try:
    # Otwieranie strony
    driver.get("https://ioprojekt.onrender.com/weather/weather")  # Zmień URL na właściwy adres Twojej aplikacji

    # logowanie
    username_input = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "username"))
    )
    username_input.send_keys("kkkk")

    password_input = driver.find_element(By.ID, "password")
    password_input.send_keys("kkkk")

    submit_button = driver.find_element(By.ID, "submit")
    submit_button.click()

    driver.get("https://ioprojekt.onrender.com/weather/weather")

    # załadowanie serwisu pogodowego
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "modal-button-1"))
    )
    time.sleep(3)
    # Kliknięcie w pierwszy widget
    modal_button_1 = driver.find_element(By.ID, "modal-button-1")
    modal_button_1.click()

    # wyświetlenie modala
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "weatherModal"))
    )

    # Zamknięcie modala
    close_button = driver.find_element(By.CLASS_NAME, "close")
    close_button.click()

    
    WebDriverWait(driver, 10).until(
        EC.invisibility_of_element((By.ID, "weatherModal"))
    )
    time.sleep(5)
    # Zmiana miasta w pierwszym polu citySelect1
    city_select_1 = driver.find_element(By.ID, "citySelect1")
    city_select_1.clear()
    city_select_1.send_keys("Gdańsk")  # Zmień na miasto z listy
    city_select_1.send_keys(Keys.RETURN)

    # Update Weather
    update_weather_button = driver.find_element(By.XPATH, "//button[normalize-space()='Odśwież']")
    update_weather_button.click()

    # aktualizacja pierwszego widgetu
    WebDriverWait(driver, 10).until(
        lambda d: "Gdańsk" in d.find_element(By.ID, "openweathermap-widget-container1").text
    )
    time.sleep(5)

    # Usuwanie wszystkich miasta oprócz pierwszego
    for button_id in ["inputButton2", "inputButton3", "inputButton4"]:
        delete_button = driver.find_element(By.ID, button_id)
        delete_button.click()
    time.sleep(2)
    #  przycisk dodaj miasto
    add_city_button = driver.find_element(By.XPATH, "//button[normalize-space()='Dodaj miasto']")
    add_city_button.click()
    time.sleep(2)
        # Wybierz miasto z listy i wprowadź do nowego pola
    new_city_select = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "citySelect2"))
    )
    new_city_select.send_keys("Warszawa")
    new_city_select.send_keys(Keys.RETURN)

    # Poczekaj na załadowanie widgetu
    new_widget = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "openweathermap-widget-container5"))
    )

    print("Test przeszedł pomyślnie.")

except Exception as e:
    print(f"Test zakończony niepowodzeniem: {e}")

finally:
    driver.quit()
