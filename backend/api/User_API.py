import base64
import json

import bcrypt
from flask import request, Response, jsonify
from flask import Blueprint
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.errors.auth_errors import NotSufficientRights
from backend.api.Auth import auth

from backend.models.models import User, Role

user_api = Blueprint('user_api', __name__)

engine = create_engine("postgresql://postgres:postgres@localhost:5432/events-calendar")
Session = sessionmaker(bind=engine)
session = Session()


@user_api.route("/api/v1/user", methods=['POST'])
def add_user():
    try:
        user_data = request.get_json()
    except:
        return jsonify({"message": "No JSON data has been specified!"}), 400
    user_data['role'] = 'user'
    try:
        user = User(**user_data)
        session.add(user)
        session.commit()
    except:
        return jsonify({"message": "User was not created"}), 400
    return jsonify({"message": "User successfully created!"}), 200


@user_api.route("/api/v1/user/login", methods=['POST'])
def user_login():
    try:
        data = request.get_json()
    except:
        return jsonify({"message": "Invalid request body, specify password and username, please!"}), 400
    if 'password' in data and 'username' in data:
        with Session.begin() as session:
            user = session.query(User).filter_by(username=data['username']).first()

            if user is None or not bcrypt.checkpw(data['password'].encode("utf-8"), user.password.encode("utf-8")):
                return jsonify({"message": "Invalid password or username specified"}), 404
            token = base64.encodebytes(f"{data['username']}:{data['password']}".encode('utf-8'))
            return jsonify({'basic': token.decode("utf-8").replace("\n", "")}), 200
    return jsonify({"message": "Invalid request body, specify password and username, please!"}), 400


@user_api.route("/api/v1/user/<username>", methods=['GET'])
@auth.login_required()
def get_user(username):
    user = session.query(User).filter_by(username=username).first()
    if user is None:
        return jsonify({"message": "User not found"}), 404
    return Response(
        response=json.dumps(user.to_dict()),
        status=200,
        mimetype='application/json'
    )


@user_api.route("/api/v1/user", methods=['PUT'])
@auth.login_required(role=['user', 'admin'])
def update_user():
    try:
        data = request.get_json()
    except:
        return jsonify({"message": "No JSON data has been specified!"}), 400
    if 'role' in data and auth.current_user().role != Role.admin:
        raise NotSufficientRights("Not enough rights to update role")
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
        return jsonify({"message": "User was updated!"}), 200
    return jsonify({"message": "Invalid request"}), 400


@user_api.route("/api/v1/user/<username>", methods=['DELETE'])
@auth.login_required(role='admin')
def delete_user(username):
    user = session.query(User).filter_by(username=username).first()
    if user is None:
        return jsonify({"message": "User not found"}), 404
    session.delete(user)
    session.commit()
    return jsonify({"message": "Deleted successfully"}), 200


