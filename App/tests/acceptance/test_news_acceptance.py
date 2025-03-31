import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time


options = Options()
options.add_experimental_option('detach', True)
options.add_argument("--start-maximized")


@pytest.fixture
def browser():
    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=options)
    yield driver
    driver.quit()


def test_news_page(browser):
    # Przejdź na stronę z artykułami
    browser.get("https://ioprojekt.onrender.com/news/1")
    time.sleep(2)
    browser.find_element(By.LINK_TEXT, "Rejestracja").click()
    assert "Register" in browser.title
    print("Strona rejestracji załadowana pomyślnie.")
    browser.find_element(By.NAME, "username").send_keys("testuser")
    browser.find_element(By.NAME, "password").send_keys("password123")
    browser.find_element(By.ID, "btn-log").click()
    browser.find_element(By.LINK_TEXT, "Logowanie").click()
    assert "Login" in browser.title
    print("Strona logowania załadowana pomyślnie.")
    browser.find_element(By.NAME, "username").send_keys("testuser")
    browser.find_element(By.NAME, "password").send_keys("password123")
    browser.find_element(By.ID, "btn-log").click()
    browser.get("https://ioprojekt.onrender.com/news/1")
    time.sleep(3)
    assert "News" in browser.title, "Tytuł strony nie zawiera 'News'"
    articles = browser.find_elements(By.CLASS_NAME, "article-item")
    assert len(articles) > 0, "Nie znaleziono artykułów na stronie"
    first_article_title = (
        articles[0].find_element(By.CLASS_NAME, "card-title").text)
    assert len(first_article_title) > 0, "Pierwszy artykuł nie ma tytułu"
    browser.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
    time.sleep(1)
    browser.find_element(By.ID, "show-more").click()
    browser.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
    time.sleep(1)
    browser.find_element(By.ID, "next-page").click()
    browser.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
    time.sleep(1)
    browser.find_element(By.ID, "next-page").click()
    browser.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
    time.sleep(1)
    browser.find_element(By.ID, "next-page").click()
    browser.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
    time.sleep(1)
    browser.find_element(By.ID, "next-page").click()
    browser.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
    time.sleep(1)
    browser.find_element(By.ID, "previous-page").click()
    browser.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
    time.sleep(1)
    browser.find_element(By.ID, "previous-page").click()
    browser.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
    time.sleep(1)
    browser.find_element(By.ID, "previous-page").click()
    browser.find_element(By.TAG_NAME, 'body').send_keys(Keys.END)
    time.sleep(1)
    browser.find_element(By.ID, "previous-page").click()


def test_news_search_functionality(browser):
    # Wyszukaj artykuły
    browser.get("https://ioprojekt.onrender.com/news/1")
    time.sleep(2)
    browser.find_element(By.LINK_TEXT, "Rejestracja").click()
    assert "Register" in browser.title
    print("Strona rejestracji załadowana pomyślnie.")
    browser.find_element(By.NAME, "username").send_keys("testuser")
    browser.find_element(By.NAME, "password").send_keys("password123")
    browser.find_element(By.ID, "btn-log").click()
    browser.find_element(By.LINK_TEXT, "Logowanie").click()
    assert "Login" in browser.title
    print("Strona logowania załadowana pomyślnie.")
    browser.find_element(By.NAME, "username").send_keys("testuser")
    browser.find_element(By.NAME, "password").send_keys("password123")
    browser.find_element(By.ID, "btn-log").click()
    browser.get("https://ioprojekt.onrender.com/news/1")
    browser.find_element(By.NAME, "q").send_keys("krakow")
    browser.find_element(By.ID, "button-addon2").click()
    time.sleep(3)
    results = browser.find_elements(By.CLASS_NAME, "article-item")
    assert len(results) > 0, "Nie znaleziono wyników wyszukiwania"
    for result in results:
        assert "krakow" in (
            result.find_element(By.CLASS_NAME, "card-title").text.lower()), (
            "Wynik wyszukiwania nie zawiera szukanego słowa kluczowego")
