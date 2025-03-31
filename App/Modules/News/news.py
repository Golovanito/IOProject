from flask import render_template, request
from flask_login import login_required
from Modules.News.news_scraper import webscraper, webscraper_all_articles
from Modules.News import news_bp


@news_bp.route('/<int:page>')
@login_required
def news(page):
    article_list = webscraper(page)
    if article_list is None:
        return render_template(
            'error.html',
            message="Nie udało się połączyć z serwisem krknews.pl.")
    if not article_list:
        return render_template(
            'error.html',
            message="Brak wiadomości do wyświetlenia na tej stronie.")
    return render_template('news.html', articles=article_list, page=page)


@news_bp.route('/search')
@login_required
def search():
    query = request.args.get('q')
    article_list = webscraper_all_articles(5)
    results = [
        article for article in article_list
        if query.lower() in article['titles'].lower()]
    return render_template(
        'search_results.html',
        articles=results, query=query)
