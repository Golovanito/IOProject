from flask import Blueprint

weather_bp = Blueprint('weather', __name__, template_folder='Templates', static_folder='Static')