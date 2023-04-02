from flask import Flask, jsonify
from backend.api.Event_API import event_api
from backend.api.User_API import user_api
from backend.errors.auth_errors import *
from flask_cors import CORS


def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(event_api)
    app.register_blueprint(user_api)

    @app.route("/api/v1/hello-world-27")
    def hello_world():
        return "Hello, World! 27"

    @app.errorhandler(ValueError)
    def incorrect_value(e: ValueError):
        return jsonify({'message': str(e)}), 400

    @app.errorhandler(InvalidCredentials)
    def incorrect_value(e: ValueError):
        return jsonify({'message': str(e)}), 400

    @app.errorhandler(NotSufficientRights)
    def incorrect_value(e: ValueError):
        return jsonify({'message': str(e)}), 403

    @app.errorhandler(Exception)
    def invalid_credentials_handler(e):
        return jsonify({'message': str(e)}), 400
    return app






