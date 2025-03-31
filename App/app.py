from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config
from Modules.News.calendar_routes import calendar_bp
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(get_remote_address, app=None, default_limits=["20 per minute"])

db = SQLAlchemy()
login = LoginManager()
login.login_view = 'home.login'

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    login.init_app(app)
    limiter.init_app(app)

    from Modules.Home import bp as home_bp
    app.register_blueprint(home_bp, url_prefix='/home')

    from Modules.Economy import eco_bp
    app.register_blueprint(eco_bp, url_prefix='/economy')

    from Modules.Weather import weather_bp
    app.register_blueprint(weather_bp, url_prefix='/weather')

    from Modules.News import news_bp
    app.register_blueprint(news_bp, url_prefix='/news')
    app.register_blueprint(calendar_bp, url_prefix='/news')

    @app.route('/')
    def index():
        return redirect(url_for('home.index'))
    
    return app
