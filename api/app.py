from flask import Flask
from Event_API import event_api
from User_API import user_api

app = Flask(__name__)
app.register_blueprint(event_api)
app.register_blueprint(user_api)


@app.route("/api/v1/hello-world-27")
def hello_world():
    return "Hello, World! 27"
