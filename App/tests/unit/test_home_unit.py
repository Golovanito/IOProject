import pytest
from run import db, app as flask_app
from Modules.Home.forms import RegistrationForm, LoginForm
from models import User

@pytest.fixture
def app():
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
    flask_app.config['TESTING'] = True
    flask_app.config['WTF_CSRF_ENABLED'] = False
    with flask_app.app_context():
        db.create_all()
        yield flask_app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

def test_registration_form_valid(app):
    with app.test_request_context():
        form = RegistrationForm(username='admin1', password='admin1')
        assert form.validate() == True

def test_registration_form_invalid(app):
    with app.test_request_context():
        form = RegistrationForm(username='', password='admin')
        assert form.validate() == False

def test_registration_form_invalid_username_length(app):
    with app.test_request_context():
        form = RegistrationForm(username='a', password='admin')  # Zbyt krótki username
        assert form.validate() == False
        form = RegistrationForm(username='a' * 151, password='admin')  # Zbyt długi username
        assert form.validate() == False

def test_login_form_valid(app):
    with app.test_request_context():
        form = LoginForm(username='miau', password='kotek', remember=False)
        assert form.validate() == True

def test_login_form_invalid(app):
    with app.test_request_context():
        form = LoginForm(username='hau', password='pies', remember=False)
        assert form.validate() == False

def test_database_connection(app):
    with app.app_context():
        assert db.session.query(User).count() == 0