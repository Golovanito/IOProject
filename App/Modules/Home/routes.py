from flask import render_template, flash, redirect, url_for
from flask_login import current_user, login_user, logout_user, login_required
from Modules.Weather.weather_graph_info import get_graph_info
from Modules.Home import bp
from Modules.Economy import eco_bp, routes
from Modules.Weather import weather_bp, routes, test_routes
from Modules.News import news_bp
from Modules.News.news_scraper import webscraper, webscraper_all_articles
from Modules.News.calendar_routes import calendar_bp
from Modules.Home.forms import LoginForm, RegistrationForm
from Modules.Weather.routes import get_cities_data
from app import db
from models import User


@bp.route('/')
def index():
    data: dict = {
            1: "Kraków",
            2: "Lublin",
            3: "Gdańsk",
            4: "Hel",
            5: "Chojnice"
        }
    info1 = render_template("weather_preview.html", data=data)
    info2 = render_template('economy_preview.html')
    article_list = webscraper(1)
    info3 = render_template('news_preview.html', articles=article_list)
    calendar = render_template('calendar.html')
    weather_data = get_graph_info()
    return render_template('home.html', info1=info1, info2=info2,
                           info3=info3, calendar=calendar,
                           weather_data=weather_data)


@bp.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('home.index'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and user.check_password(form.password.data):
            login_user(user, remember=form.remember.data)
            return redirect(url_for('home.index'))
        flash('Invalid username or password')
    return render_template('login.html', form=form)


@bp.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('home.index'))
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(username=form.username.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Congratulations, you are now a registered user!')
        return redirect(url_for('home.login'))
    return render_template('register.html', title='Register', form=form)


@bp.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home.login'))


@bp.route('/info')
def info():
    return render_template('info.html')


@news_bp.route('/news')
def news_home():
    return redirect(url_for('news.news', page=1))


@news_bp.route('/calendar')
def calendar():
    return render_template('calendar.html')
