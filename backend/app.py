from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)


@app.route('/')
def index():
    try:
        # Test database connection
        users = User.query.all()
        return f"Connected to the database! Found {len(users)} users."
    except Exception as e:
        return str(e)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
