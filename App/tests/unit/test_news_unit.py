import pytest
from unittest.mock import patch, MagicMock
from Modules.News.news_scraper import webscraper, webscraper_all_articles


def test_webscraper():
    # Test funkcji webscraper dla strony 1.
    articles = webscraper(1)  # Pobieranie danych ze strony 1
    assert len(articles) > 0, "Lista artykułów nie powinna być pusta"

    # Sprawdzamy strukturę pierwszego artykułu
    first_article = articles[0]
    assert "titles" in first_article, "Brakuje klucza 'titles'"
    assert "links" in first_article, "Brakuje klucza 'links'"
    assert "date" in first_article, "Brakuje klucza 'date'"
    assert "description" in first_article, "Brakuje klucza 'description'"
    assert "photo" in first_article, "Brakuje klucza 'photo'"


def test_webscraper_all_articles():
    # Test funkcji webscraper_all_articles dla 2 stron.
    articles = webscraper_all_articles(2)  # Pobieranie danych z dwóch stron
    assert isinstance(articles, list), "Powinien zwrócić listę artykułów"
    assert len(articles) > 0, "Lista artykułów nie powinna być pusta"
    assert len(articles) > 10, (
        "Powinno być więcej artykułów niż na jednej stronie")

    # Sprawdzamy strukturę danych
    for article in articles:
        assert "titles" in article, "Brakuje klucza 'titles'"
        assert "links" in article, "Brakuje klucza 'links'"
        assert "date" in article, "Brakuje klucza 'date'"
        assert "description" in article, "Brakuje klucza 'description'"
        assert "photo" in article, "Brakuje klucza 'photo'"


# Mock HTML content for testing
MOCK_HTML = """
<div id="tdi_91">
    <div class="td-module-container">
        <h3 class="td-module-title">
            <a href="https://krknews.pl/example-article">
                Example Article Title
            </a>
        </h3>
        <span class="td-post-date">2024-01-01</span>
        <div class="td-excerpt">
            This is an example description of the article.
        </div>
        <span class="entry-thumb"
              data-img-url="https://krknews.pl/example-image.jpg">
        </span>
    </div>
</div>
"""


@pytest.fixture
def mock_requests_get():
    # Fixture to mock requests.get.
    with patch("requests.get") as mock_get:
        yield mock_get


def test_webscraper_success_mocking(mock_requests_get):
    # Test that the webscraper function correctly parses valid HTML
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.text = MOCK_HTML
    mock_requests_get.return_value = mock_response
    articles = webscraper(1)
    assert len(articles) == 1
    assert articles[0]["titles"] == "Example Article Title"
    assert articles[0]["links"] == "https://krknews.pl/example-article"
    assert articles[0]["date"] == "2024-01-01"
    assert articles[0]["description"] == (
        "This is an example description of the article.")
    assert articles[0]["photo"] == "https://krknews.pl/example-image.jpg"


def test_webscraper_no_articles_mocking(mock_requests_get):
    # Test that the webscraper function handles empty pages gracefully.
    mock_response = MagicMock()
    mock_response.status_code = 200
    # No articles in this mock HTML
    mock_response.text = '<div id="tdi_91"></div>'
    mock_requests_get.return_value = mock_response
    articles = webscraper(1)
    assert len(articles) == 0


def test_webscraper_invalid_page_mocking(mock_requests_get):
    # Test that the webscraper function handles a non-200 response.
    mock_response = MagicMock()
    mock_response.status_code = 404
    mock_requests_get.return_value = mock_response
    articles = webscraper(1)
    assert articles is None  # No articles should be returned


def test_webscraper_all_articles_mocking(mock_requests_get):
    # Test the webscraper_all_articles function for multiple pages.
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.text = MOCK_HTML
    mock_requests_get.return_value = mock_response
    all_articles = webscraper_all_articles(2)  # Mock scraping 2 pages
    assert len(all_articles) == 2
    for article in all_articles:
        assert article["titles"] == "Example Article Title"
        assert article["links"] == "https://krknews.pl/example-article"
        assert article["date"] == "2024-01-01"
        assert article["description"] == (
            "This is an example description of the article.")
        assert article["photo"] == "https://krknews.pl/example-image.jpg"
