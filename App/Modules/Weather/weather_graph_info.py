from flask import jsonify
import requests


# funkcja zwraca informacje do wykresu - info o 5 miastach z city_data,
# kolejność alfabetyczna.
# informacje na 7 dni, zaczynając od dzisiejszego,
# czas pogody +- 3 godziny od obecnego (np. jak jest 10:00 to dane mogą być z 7:00)
#
# JAK UŻYWAĆ
# np. data = get_graph_info()
#  data['Kraków'][0][0], data['Kraków'][0][1]
#                 ^  ^                     ^
#                 |  |                     |
# dzień tygodnia -'  '- 0 dla temperatury  '- 1 dla ciśnienia
def get_graph_info():
    city_data: dict = {
        1: "Kraków",
        2: "Lublin",
        3: "Gdańsk",
        4: "Hel",
        5: "Chojnice"
    }
    data: dict = {}
    # Fetch graph info
    for i in range(1, 6):
        api_key = '77c3a88dfaefeb225ff57827b1b21db9'
        try:
            response = requests.get(f'https://api.openweathermap.org/data/2.5/forecast?q={city_data[i]}&appid={api_key}&units=metric')
            response = response.json()
            desired_indexes = [0, 7, 15, 23, 31, 39]
            data[city_data[i]] = [[response['list'][j]['main']['temp'], response['list'][j]['main']['pressure']] 
                    for j in desired_indexes if j < len(response['list'])]
            
        except Exception as err:
            return jsonify({'error': f'Other error occurred: {err}'})      
    return data
data=get_graph_info()
print(data['Kraków'][1][0], data['Kraków'][0][0])
