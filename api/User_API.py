import base64
import json

import bcrypt
from flask import Flask, request, Response, jsonify
from flask import Blueprint
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker

from api.Auth import auth
from api.Encoder import AlchemyEncoder
from models.models import User

user_api = Blueprint('user_api', __name__)

engine = create_engine("postgresql://postgres:admin@localhost:5432/events-calendar")
Session = sessionmaker(bind=engine)
session = Session()


@user_api.route("/api/v1/user", methods=['POST'])
def add_user():
    user_data = request.get_json()
    if user_data is None:
        return Response(status=402)
    try:
        user = User(**user_data)
        session.add(user)
        session.commit()
    except IntegrityError:
        return Response('Some problem', status=400)
    return Response('User successfully created!', status=200)


@user_api.route("/api/v1/user/login", methods=['GET'])
def user_login():
    data = request.get_json()
    if data is None:
        return Response("No JSON data has been specified!", status=400)
    try:
        if 'password' in data and 'username' in data:
            with Session.begin() as session:
                user = session.query(User).filter_by(username=data['username']).first()
                if not bcrypt.checkpw(data['password'].encode("utf-8"), user.password.encode("utf-8")):
                    return Response("Invalid password or username specified", status=404)

                token = base64.encodebytes(f"{data['username']}:{data['password']}".encode('utf-8'))
                return jsonify({'basic': token.decode("utf-8").replace("\n", "")}), 200
    except IntegrityError:
        return Response("Invalid username or password specified", status=400)

    return Response("Invalid request body, specify password and username, please!", status=400)


@user_api.route("/api/v1/user/<username>", methods=['GET'])
@auth.login_required(role='admin')
def get_user(username):
    user = session.query(User).filter_by(username=username).first()
    if user is None:
        return Response('User not found', 404)
    return Response(
        response=json.dumps(user.to_dict(), cls=AlchemyEncoder),
        status=200,
        mimetype='application/json'
    )


@user_api.route("/api/v1/user/<username>", methods=['PUT'])
@auth.login_required(role=['user', 'admin'])
def update_user(username):
    user_data = request.get_json()
    if user_data is None:
        return Response(status=402)
    user = session.query(User).filter_by(username=username).first()
    if user is None:
        return Response('User not found', status=402)
    if 'id' in user_data and auth.current_user().id == int(user_data['id']):
        try:
            user.update(user_data)
            session.commit()
        except IntegrityError:
            return Response('Integrity Error', status=402)
        return Response('User updated', status=200)
    return Response("Invalid request", status=400)


@user_api.route("/api/v1/user/<username>", methods=['DELETE'])
@auth.login_required(role='admin')
def delete_user(username):
    user = session.query(User).filter_by(username=username).first()
    if user is None:
        return Response('User not found', 404)
    try:
        session.delete(user)
        session.commit()
    except IntegrityError:
        return Response('Delete failed', 402)
    return Response('Deleted successfully', 200)


@user_api.route("/api/v1/user/logout", methods=['GET'])
def user_logout():
    return Response('Logout successful!', status=200)
