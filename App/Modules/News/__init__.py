from flask import Blueprint

news_bp = Blueprint(
    'news', __name__, template_folder='Templates',
    static_folder='static')

# Import na końcu, aby uniknąć problemów z zależnościami cyklicznymi
from Modules.News import news
