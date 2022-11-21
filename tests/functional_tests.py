from flask import Flask
from flask_testing import LiveServerTestCase


class EventAPITest(LiveServerTestCase):
    def create_app(self):
        app = Flask(__name__)
        app.config['TESTING'] = True
        return app