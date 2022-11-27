import base64
import json

import bcrypt
from flask import Flask, request, Response, jsonify
from flask import Blueprint
from sqlalchemy import create_engine
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker
from errors.auth_errors import NotSufficientRights, InvalidCredentials
from api.Auth import auth

from models.models import User, Role

user_api = Blueprint('user_api', __name__)

engine = create_engine("postgresql://postgres:admin@localhost:5432/events-calendar")
Session = sessionmaker(bind=engine)
session = Session()


@user_api.route("/api/v1/user", methods=['POST'])
def add_user():
    try:
        user_data = request.get_json()
    except:
        return Response("No JSON data has been specified!", status=400)
    try:
        user = User(**user_data)
        session.add(user)
        session.commit()
    except:
        return Response('User was not created', status=400)
    return Response('User successfully created!', status=200)


@user_api.route("/api/v1/user/login", methods=['GET'])
def user_login():
    try:
        data = request.get_json()
    except:
        return Response("Invalid request body, specify password and username, please!", status=400)
    if 'password' in data and 'username' in data:
        with Session.begin() as session:
            user = session.query(User).filter_by(username=data['username']).first()
            if not bcrypt.checkpw(data['password'].encode("utf-8"), user.password.encode("utf-8")):
                return Response("Invalid password or username specified", status=404)

            token = base64.encodebytes(f"{data['username']}:{data['password']}".encode('utf-8'))
            return jsonify({'basic': token.decode("utf-8").replace("\n", "")}), 200
    return Response("Invalid request body, specify password and username, please!", status=400)


@user_api.route("/api/v1/user/<username>", methods=['GET'])
@auth.login_required(role='admin')
def get_user(username):
    user = session.query(User).filter_by(username=username).first()
    if user is None:
        return Response('User not found', 404)
    return Response(
        response=json.dumps(user.to_dict()),
        status=200,
        mimetype='application/json'
    )


@user_api.route("/api/v1/user/<username>", methods=['PUT'])
@auth.login_required(role=['user', 'admin'])
def update_user(username):
    try:
        data = request.get_json()
    except:
        return Response("No JSON data has been specified!", status=400)
    with Session.begin() as session:
        if auth.current_user().role != Role.admin and \
                'username' in data and \
                auth.current_user().username != data['username']:
            raise NotSufficientRights("Not enough rights to update user")
        user = User(**data)  # check if it validates
        if 'password' in data:
            data['password'] = user.password
        session.query(User).filter(User.username == user.username).update(data,
                                                                          synchronize_session="fetch")
        return Response("Success my man!", status=200)
    return Response("Invalid request", status=400)


@user_api.route("/api/v1/user/<username>", methods=['DELETE'])
@auth.login_required(role='admin')
def delete_user(username):
    user = session.query(User).filter_by(username=username).first()
    if user is None:
        return Response('User not found', 404)
    session.delete(user)
    session.commit()
    return Response('Deleted successfully', 200)


