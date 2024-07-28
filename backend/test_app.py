import pytest
from backend.app import app, db, User

@pytest.fixture
def client():
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client

def test_index(client):
    """Test the index route."""
    rv = client.get('/')
    assert b"Connected to the database!" in rv.data

def test_database(client):
    """Test database connection and User model."""
    with app.app_context():
        user = User(name="Test User")
        db.session.add(user)
        db.session.commit()
        
        users = User.query.all()
        assert len(users) == 1
        assert users[0].name == "Test User"



//Run test command
pytest backend/tests
