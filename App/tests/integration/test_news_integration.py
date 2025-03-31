import pytest
from run import app as flask_app


@pytest.fixture
def app():
    flask_app.config.update(
        TESTING=True,
        WTF_CSRF_ENABLED=False,  # Wyłącz CSRF dla testów
        SECRET_KEY="test_secret_key",  # Dodaj klucz sesji
    )
    return flask_app


@pytest.fixture
def client(app):
    # Fixture do tworzenia klienta testowego Flaska.
    with app.test_client() as client:
        yield client


@pytest.fixture
def logged_in_client(client):
    # Symulacja logowania
    response = client.post(
        '/home/register',
        data={'username': 'user', 'password': 'user'},
        follow_redirects=True)
    response1 = client.post(
        '/home/login',
        data={'username': 'user', 'password': 'user', 'remember': False},
        follow_redirects=True)
    assert response.status_code == 200, "Rejestracja powinna się powieść"
    assert response1.status_code == 200, "Logowanie powinno się powieść"
    yield client


def test_news_route(logged_in_client):
    # Test trasy `/news/<int:page>`.
    # Symulujemy żądanie GET na trasę `/1`
    response = logged_in_client.get("/news/1")
    assert response.status_code == 200, "Odpowiedź powinna mieć status 200"


def test_search_route(logged_in_client):
    # Test trasy `/search` z zapytaniem.
    response = logged_in_client.get("/news/search?q=kryminalne")
    assert response.status_code == 200, "Odpowiedź powinna mieć status 200"


def test_news_page_no_articles(logged_in_client, monkeypatch):
    def mock_webscraper(page_number):
        return []
    monkeypatch.setattr("Modules.News.news.webscraper", mock_webscraper)
    response = logged_in_client.get("/news/1")
    assert response.status_code == 200
    html_content = response.data.decode("utf-8")
    print(html_content)  # Debug: wyświetlenie pełnego HTML
    assert (
        "Brak wiadomości do wyświetlenia na tej stronie." in html_content), (
        "Komunikat o braku artykułów powinien być wyświetlony w "
        "wygenerowanym HTML.")


def test_news_page_connection_error(logged_in_client, monkeypatch):
    def mock_webscraper(page_number):
        return None
    monkeypatch.setattr("Modules.News.news.webscraper", mock_webscraper)
    response = logged_in_client.get("/news/1")
    assert response.status_code == 200
    assert ("Nie udało się połączyć z serwisem krknews.pl."
            in response.data.decode("utf-8")), (
            "Komunikat o błędzie połączenia powinien być wyświetlony")
