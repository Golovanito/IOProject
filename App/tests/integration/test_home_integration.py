import pytest
from run import db, app as flask_app
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

def test_invalid_username_with_special_characters(client):
    response = client.post('/home/register', data={'username': 'user 123', 'password': 'password'}, follow_redirects=True)
    assert b'Register' in response.data
    response = client.post('/home/register', data={'username': 'user<123', 'password': 'password'}, follow_redirects=True)
    assert b'Register' in response.data

def test_add_user_to_database(app):
    with app.app_context():
        new_user = User(username='user', password_hash='password')
        db.session.add(new_user)
        db.session.commit()
        assert User.query.filter_by(username='user').first() is not None

def test_response_200(client):
    response = client.get('/home/')
    assert response.status_code == 200

def test_response_404(client):
    response = client.get('/none')
    assert response.status_code == 404

def test_redirect(client):
    response = client.post('/home/register', data = {'username': 'user', 'password': 'user'}, follow_redirects = True)
    assert b'Login' in response.data
    response1 = client.post('/home/login', data = {'username': 'user', 'password': 'user', 'remember': False}, follow_redirects = True)
    assert b'<title>Home</title>' in response1.data
    response2 = client.get('/home/logout', follow_redirects = True)
    assert b'Login' in response2.data

def test_user_registration(client, app):
    response = client.post('/home/register', data = {'username': 'user', 'password': 'password'}, follow_redirects=True)
    assert response.status_code == 200
    with app.app_context():
        user = User.query.filter_by(username='user').first()
        assert user is not None

def test_xss_protection(client):
    payload = '<script>alert("XSS")</script>'
    response = client.post('/home/register', data={'username': payload, 'password': 'password'}, follow_redirects=True)
    assert payload not in response.data.decode('utf-8')

def test_ddos_protection(client):
    for _ in range(20):
        response = client.get('/home/')
    
    assert response.status_code == 429
    assert b'Too Many Requests' in response.data