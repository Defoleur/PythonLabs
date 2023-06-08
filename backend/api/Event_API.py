import json
from datetime import date
import re
from flask import request, Response, Blueprint, jsonify
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

from backend.api.Auth import auth
from backend.errors.auth_errors import NotSufficientRights
from backend.models.models import Event, EventUser, User, Role

engine = create_engine("postgresql://postgres:postgres@localhost:5432/events-calendar")
Session = sessionmaker(bind=engine)
session = Session()

event_api = Blueprint('event_api', __name__)


@event_api.route("/api/v1/event/<id>", methods=['GET'])
@auth.login_required()
def get_event_by_id(id):
    event = session.query(Event)
    current_event = event.get(int(id))
    current_user = session.query(User).get(current_event.user_id)
    if current_event is None:
        return jsonify({"message": 'Event not found'}), 404
    return Response(
        response=json.dumps(current_event.to_dict(current_user.username)),
        status=200,
        mimetype='application/json'
    )


@event_api.route("/api/v1/event", methods=['POST'])
@auth.login_required()
def create_event():
    try:
        event_data = request.get_json()
    except:
        return jsonify({"message": "No JSON data has been specified!"}),400
    title = content = date2 = startTime = endTime = user_id = None
    if ('title' in event_data and
            'date' in event_data):
        title = event_data['title']
        # id = event_data['id']
        date_pattern = re.compile('^(\d{4})-(\d{2})-(\d{2})$')
        time_pattern = re.compile('^(\d{2}):(\d{2})$')
        # time_pattern = re.compile('^(\d{2}):(\d{2}):(\d{2})$')
        if not date_pattern.match(event_data['date']):
            return jsonify({"message": 'Incorrect format of a date field!'}), 400
        data = re.search(date_pattern, event_data['date'])
        year = data[1]
        day = data[2]
        month = data[3]
        date2 = date(int(year), int(day), int(month))

        if 'content' in event_data:
            content = event_data['content']

        if 'startTime' in event_data:
            if not time_pattern.match(event_data['startTime']):
                return jsonify({"message": 'Incorrect format of a start time field!'}), 400
            else:
                startTime = event_data['startTime']

        if 'endTime' in event_data:
            if not time_pattern.match(event_data['endTime']):
                return jsonify({"message": 'Incorrect format of a end time field!'}), 400
            else:
                endTime = event_data['endTime']

        event = Event(title=title, content=content, user_id=auth.current_user().id, endTime=endTime, date=date2,
                      startTime=startTime)
        session.add(event)
        try:
            session.commit()
        except:
            return jsonify({"message": 'Event was not created!'}), 400
        return jsonify({"message": 'Event added successfully!'}), 200
    else:
        return jsonify({"message": 'Some required fields are missing!'}), 400


@event_api.route("/api/v1/event", methods=['PUT'])
@auth.login_required()
def update_event():
    try:
        event_data = request.get_json()
    except:
        return jsonify({"message": "No JSON data has been specified!"}), 400
    try:
        event_query = session.query(Event).filter(Event.id == event_data['id'])
        event = event_query.first()
        if event.user_id != auth.current_user().id and auth.current_user().role != Role.admin:
            raise NotSufficientRights("No access")
        event_data.pop("username")
        date_pattern = re.compile('^(\d{4})-(\d{2})-(\d{2})$')
        data = re.search(date_pattern, event_data['date'])
        year = data[1]
        day = data[2]
        month = data[3]
        date2 = date(int(year), int(day), int(month))
        current_event = Event(title=event_data["title"], content=event_data['content'], user_id=event_data['user_id'], endTime=event_data['endTime'], date=date2,
                      startTime=event_data['startTime'])
        event_query.update(event_data, synchronize_session="fetch")
        session.commit()
    except IntegrityError:
        return jsonify({"message": 'Integrity Error'}), 400
    return jsonify({"message": 'Event updated'}), 200


@event_api.route("/api/v1/event/<id>", methods=['DELETE'])
@auth.login_required()
def delete_by_id(id):
    event = session.query(Event)
    current_event = event.get(int(id))
    if current_event is None:
        return jsonify({"message": 'Event not found'}), 404
    if current_event.user_id != auth.current_user().id and auth.current_user().role != Role.admin:
        raise NotSufficientRights("No access")
    session.delete(current_event)
    try:
        session.commit()
        return jsonify({"message": 'Deleted successfully'}), 200
    except IntegrityError:
        return jsonify({"message": 'Delete failed'}), 400


@event_api.route("/api/v1/event/<username>/created", methods=['GET'])
@auth.login_required()
def created_events(username):
    current_user = session.query(User).filter_by(username=username).first()
    if current_user is None:
        return jsonify({"message":'User not found'}), 404
    if current_user.id != auth.current_user().id and auth.current_user().role != Role.admin:
        raise NotSufficientRights("No access")
    events = session.query(Event).filter_by(user_id=current_user.id)
    events_json = []
    if events is None:
        return jsonify({"message": "No events was found"}), 404
    for event in events:
        events_json.append(event.to_dict(current_user.username))
    return Response(
        response=json.dumps(events_json),
        status=200,
        mimetype='application/json'
    )


@event_api.route("/api/v1/event/<username>/attached", methods=['GET'])
@auth.login_required()
def attached_events(username):
    current_user = session.query(User).filter_by(username=username).first()
    if current_user is None:
        return jsonify({"message": 'User not found'}), 404
    if current_user.id != auth.current_user().id and auth.current_user().role != Role.admin:
        raise NotSufficientRights("No access")
    events = session.query(EventUser).filter_by(user_id=current_user.id)
    events_json = []
    if events is None:
        return jsonify({"message": "No events was found"}), 404
    for event in events:
        event_from_db = session.query(Event)
        current_event = event_from_db.get(int(event.event_id))
        current_user = session.query(User).get(current_event.user_id)
        events_json.append(event.event.to_dict(current_user.username))
    return Response(
        response=json.dumps(events_json),
        status=200,
        mimetype='application/json'
    )


@event_api.route("/api/v1/event/user", methods=['POST'])
@auth.login_required()
def add_user_to_event():
    user_data = request.get_json()
    if user_data is None:
        return jsonify({"message": "No JSON data has been specified!"}), 400
    event_usr = session.query(EventUser)
    current_event = event_usr.filter_by(event_id=int(user_data['event']),
                                        user_id=int(user_data['user'])).first()

    if current_event is not None:
        return jsonify({"message": 'User is already attached to this event!'}), 400

    try:
        event_user = EventUser(event_id=user_data['event'], user_id=user_data['user'])
        event = session.query(Event).filter(Event.id == user_data['event']).first()
        if event.user_id == event_user.user_id:
            return jsonify({"message": 'User is owner of this event!'}), 400
        if event.user_id != auth.current_user().id and auth.current_user().role != Role.admin:
            raise NotSufficientRights("No access")
        session.add(event_user)
        session.commit()
    except:
        return jsonify({"message": 'Integrity Error'}), 402
    return jsonify({"message": 'User successfully added to event!'}), 200


@event_api.route("/api/v1/event/<event_id>/<username>", methods=['DELETE'])
@auth.login_required()
def delete_user_from_event(event_id, username):
    user = session.query(User).filter_by(username=username).first()
    event = session.query(EventUser)
    current_event = event.filter_by(event_id=int(event_id), user_id=int(user.id)).first()
    if current_event is None:
        return jsonify({"message":'Event or user not found'}), 404
    if current_event.event.user_id != auth.current_user().id and \
            current_event.user_id != auth.current_user().id and \
            auth.current_user().role != Role.admin:
        raise NotSufficientRights("No access")
    session.delete(current_event)
    try:
        session.commit()
        return jsonify({"message": 'Deleted successfully'}), 200
    except:
        return jsonify({"message": 'Delete failed'}), 400


@event_api.route("/api/v1/<event_id>/users", methods=['GET'])
@auth.login_required()
def get_event_users(event_id):
    event_usr = session.query(EventUser)
    event_users = event_usr.filter_by(event_id=int(event_id))
    event_users_json = []
    for user_event in event_users:
        user_id = user_event.user_id
        current_user = session.query(User).get(int(user_id))
        event_users_json.append(current_user.to_dict())
            # {"user_id": user_id, "username": current_user.username})
    return Response(
        response=json.dumps(event_users_json),
        status=200,
        mimetype='application/json'
    )
