from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

options = webdriver.EdgeOptions()
options.add_argument("--start-maximized")

driver = webdriver.Edge(options=options)

URL = "https://ioprojekt.onrender.com"

def test_home():
    driver.get(URL)

    assert "Home" in driver.title
    time.sleep(2)
    assert driver.find_element(By.ID, "openweathermap-widget-container1").is_displayed()
    assert driver.find_element(By.CLASS_NAME, "preview-div").is_displayed()
    assert driver.find_element(By.CLASS_NAME, "articles").is_displayed()
    print("Strona główna załadowana pomyślnie.")

    driver.find_element(By.LINK_TEXT, "Rejestracja").click()
    assert "Register" in driver.title
    print("Strona rejestracji załadowana pomyślnie.")

    driver.find_element(By.NAME, "username").send_keys("testuser")
    driver.find_element(By.NAME, "password").send_keys("password123")
    driver.find_element(By.ID, "btn-log").click()

    driver.find_element(By.LINK_TEXT, "Logowanie").click()
    assert "Login" in driver.title
    print("Strona logowania załadowana pomyślnie.")

    driver.find_element(By.NAME, "username").send_keys("testuser")
    driver.find_element(By.NAME, "password").send_keys("password123")
    driver.find_element(By.ID, "btn-log").click()

    assert "Home" in driver.title
    print("Logowanie zakończone sukcesem, użytkownik znajduje się na stronie głównej.")

    driver.find_element(By.LINK_TEXT, "O nas").click()
    assert "Info" in driver.title
    print("Strona 'O nas' załadowana pomyślnie.")

    info_content = driver.find_element(By.ID, "my")
    assert info_content.is_displayed()
    assert "O nas" in info_content.text
    print("Strona 'O nas' zawiera poprawne informacje.")

    driver.find_element(By.LINK_TEXT, "Pogoda").click()
    assert "Weather Service" in driver.title
    driver.find_element(By.LINK_TEXT, "Ekonomia").click()
    assert "Ekonomic Service" in driver.title
    driver.find_element(By.LINK_TEXT, "Wiadomości").click()
    assert "News Service" in driver.title
    driver.find_element(By.LINK_TEXT, "Wyloguj").click()
    assert "Login" in driver.title
    driver.find_element(By.LINK_TEXT, "SERWIS INFORMACYJNY").click()
    assert "Home" in driver.title
    print("Linki w navbarze działają poprawnie.")

    driver.find_element(By.LINK_TEXT, "Pogoda").click()
    assert "Login" in driver.title
    print("Login_required działa poprawnie.")

    print("Test przeszedł pomyślnie.")

if __name__ == "__main__":
    try:
        test_home()
    except AssertionError as e:
        print(f"Test zakończył się niepowodzeniem: {e}")
    finally:
        driver.quit()