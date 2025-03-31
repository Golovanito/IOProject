from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired, ValidationError, Regexp, Length
from models import User


class LoginForm(FlaskForm):
    username = StringField(
        'Nazwa użytkownika', validators=[
            DataRequired(), Length(
                min=4, max=150), Regexp(
                r'^[A-Za-z0-9@!#$&]+$',
                message="Nazwa zawiera nieprawidłowe znaki.")])
    password = PasswordField(
        'Hasło', validators=[
            DataRequired(), Length(
                min=4, max=150), Regexp(
                r'^[A-Za-z0-9@!#$&]+$',
                message="Hasło zawiera nieprawidłowe znaki.")])
    remember = BooleanField('Zapamiętaj mnie')
    submit = SubmitField('Loguj')


class RegistrationForm(FlaskForm):
    username = StringField(
        'Nazwa użytkownika', validators=[
            DataRequired(), Length(
                min=4, max=150), Regexp(
                r'^[A-Za-z0-9@!#$&]+$',
                message="Nazwa zawiera nieprawidłowe znaki.")])
    password = PasswordField(
        'Hasło', validators=[
            DataRequired(), Length(
                min=4, max=150), Regexp(
                r'^[A-Za-z0-9@!#$&]+$',
                message="Hasło zawiera nieprawidłowe znaki.")])
    submit = SubmitField('Rejestruj')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Nazwa jest już zajęta.')
