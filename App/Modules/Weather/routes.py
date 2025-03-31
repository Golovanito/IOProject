from flask import render_template, request, jsonify
from flask_login import login_required, current_user
from Modules.Weather import weather_bp
from Modules.Weather.weather_models import WeatherCities
from app import db


@weather_bp.route('/weather')
@login_required
def weather_home():
    data = get_cities_data()
    return render_template('weather.html', data=data)


@weather_bp.route('/get-selected-weather-cities', methods=['POST'])
@login_required
def call_python():
    # Get data from JavaScript fetch
    data = request.json
    data_to_db: str = ""
    for item in data.items():
        data_to_db += f"{item[1]},"

    weather: WeatherCities = WeatherCities.query.filter_by(username=current_user.username).first()

    # Update database
    if weather is not None:
        weather.selected_cities = data_to_db
    # Add to database
    else:
        db.session.add(WeatherCities(username=current_user.username, selected_cities=data_to_db))
    db.session.commit()
    return jsonify(data)


@weather_bp.route('/weather_preview')
def weather_preview():
    data: dict = {
            1: "Kraków",
            2: "Lublin",
            3: "Gdańsk",
            4: "Hel",
            5: "Chojnice"
        }
    return render_template("weather_preview.html", data=data)


def get_cities_data():
    # Default data
    default_data: dict = {
            1: "Kraków",
            2: "Lublin",
            3: "Gdańsk",
            4: "Hel",
            5: "Chojnice"
        }
    if current_user is not None and current_user.is_authenticated:
        weather: WeatherCities = WeatherCities.query.filter_by(username=current_user.username).first()
        # Get cities data from database
        if weather is not None:
            saved_data = weather.get_selected_cities_data()
            data: dict = {}
            # Update data with saved data
            for i in range(1, len(saved_data)+1):
                data[i] = saved_data[i]
            # If no saved data found, setting data to empty string is needed
            for i in range(len(saved_data)+1, 6):
                data[i] = ""
            if data[1] == '' and data[2] == '' and data[3] == '' and data[4] == '' and data[5] == '':
                return default_data
            return data
    return default_data
