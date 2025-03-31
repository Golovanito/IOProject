from flask import Blueprint, render_template, request, jsonify
import requests

calendar_bp = Blueprint(
    'calendar',
    __name__,
    template_folder='Templates',
    static_folder='static',
)


def get_namedays(day, month):
    url = (
        f"https://nameday.abalin.net/api/V1/getdate?"
        f"day={day}&month={month}"
    )
    params = {
        "country": "pl",
        "timezone": "Europe/Warsaw",
    }
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    response = requests.get(url, headers=headers, params=params)
    data = response.json()

    if 'nameday' in data:
        return data['nameday']['pl']
    return None


def get_holidays(day, month):
    url = (
        f"https://pniedzwiedzinski.github.io/"
        f"kalendarz-swiat-nietypowych/{month}/{day}.json"
    )
    response = requests.get(url)
    holidays = response.json()
    if isinstance(holidays, list):
        holidays = ', '.join([holiday['name'] for holiday in holidays])
    return holidays


@calendar_bp.route('/calendar')
def index():
    return render_template('calendar.html')


@calendar_bp.route('/api/data', methods=['GET'])
def api_data():
    day = request.args.get('day', '1')
    month = request.args.get('month', '1')
    namedays = get_namedays(day, month)
    holidays = get_holidays(day, month)
    return jsonify({
        'namedays': namedays,
        'holidays': holidays,
    })
