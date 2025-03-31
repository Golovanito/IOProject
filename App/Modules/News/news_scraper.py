from bs4 import BeautifulSoup
import requests


def webscraper(page_number):
    url = f'https://krknews.pl/category/kryminalne/page/{page_number}'
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36"
        ),
    }
    try:
        page = requests.get(url, headers=headers, timeout=10)
        if page.status_code != 200:
            print(f"Błąd pobierania strony {page_number}: {page.status_code}")
            return None
        soup = BeautifulSoup(page.text, 'html.parser')
        news_window = soup.find('div', id='tdi_91')
        headers = news_window.find_all('div', class_='td-module-container')
        article_list = []
        for article in headers:
            date = article.find('span', class_='td-post-date').text.strip()
            description = article.find('div', class_='td-excerpt').text.strip()
            title = article.find('h3', class_='td-module-title').text.strip()
            link = article.find('a')['href']
            photo = article.find('span', class_='entry-thumb')['data-img-url']
            article_list.append({
                'titles': title,
                'links': link,
                'date': date,
                'description': description,
                'photo': photo
            })
        return article_list
    except requests.exceptions.RequestException as e:
        print(f"Błąd połączenia z API: {e}")
        return None


def webscraper_all_articles(max_pages):
    all_articles = []
    for page_number in range(1, max_pages + 1):
        print(f"Pobieranie artykułów ze strony {page_number}...")
        articles = webscraper(page_number)
        all_articles.extend(articles)
    return all_articles
