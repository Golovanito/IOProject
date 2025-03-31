from app import db


class WeatherCities(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    selected_cities = db.Column(db.String(150), nullable=False)

    def get_selected_cities_data(self):
        s: str = self.selected_cities
        s = s[:-1]
        s_split = s.split(",")
        data = {}
        # Add information from database
        for i in range(len(s_split)):
            data[i+1] = s_split[i]
        return data
