import json

import bcrypt
from flask import Flask, request, Response
from flask import Blueprint
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker

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

                return Response(json.dumps(user.to_dict()), status=200)
    except IntegrityError:
        return Response("Invalid username or password specified", status=400)

    return Response("Invalid request body, specify password and username, please!", status=400)


@user_api.route("/api/v1/user/<username>", methods=['GET'])
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
def update_user(username):
    user_data = request.get_json()
    if user_data is None:
        return Response(status=402)
    user = session.query(User).filter_by(username=username).first()
    if user is None:
        return Response('User not found', status=402)
    try:
        user.update(user_data)
        session.commit()
    except IntegrityError:
        return Response('Integrity Error', status=402)
    return Response('User updated', status=200)


@user_api.route("/api/v1/user/<username>", methods=['DELETE'])
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
