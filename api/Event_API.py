import json
from datetime import datetime
from datetime import date
import re
import string
from flask import Flask, request, Response, Blueprint
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from api.Encoder import AlchemyEncoder
from models.models import Event, EventUser, User

engine = create_engine("postgresql://postgres:admin@localhost:5432/events-calendar")
Session = sessionmaker(bind=engine)
session = Session()

event_api = Blueprint('event_api', __name__)


@event_api.route("/api/v1/event", methods=['POST'])
def create_event():
    event_data = request.get_json()
    title = content = date2 = startTime = endTime = user_id = None
    if event_data is None:
        return Response(status=402)
    if ('title' in event_data and
            'date' in event_data and
            'user_id' in event_data):
        title = event_data['title']
        date_pattern = re.compile('^(\d{4})-(\d{2})-(\d{2})$')
        time_pattern = re.compile('^(\d{2}):(\d{2}):(\d{2})$')
        if not date_pattern.match(event_data['date']):
            return Response('Incorrect format of a date field!', status=402)
        data = re.search(date_pattern, event_data['date'])
        year = data[1]
        day = data[2]
        month = data[3]
        date2 = date(int(year), int(day), int(month))
        user_id = event_data['user_id']

        if 'content' in event_data:
            content = event_data['content']

        if 'startTime' in event_data:
            if not time_pattern.match(event_data['startTime']):
                return Response('Incorrect format of a start time field!', 402)
            else:
                startTime = event_data['startTime']

        if 'endTime' in event_data:
            if not time_pattern.match(event_data['endTime']):
                return Response('Incorrect format of a end time field!', 402)
            else:
                endTime = event_data['endTime']

        event = Event(title=title, content=content, user_id=user_id, endTime=endTime, date=date2, startTime=startTime)
        session.add(event)
        try:
            session.commit()
        except IntegrityError:
            return Response(status=402)
        return Response('Event added successfully!', status=200)
    else:
        return Response('Some required fields are missing!', status=402)


@event_api.route("/api/v1/event/user", methods=['POST'])
def add_user_to_event():
    user_data = request.get_json()
    if user_data is None:
        return Response(status=402)

    event_usr = session.query(EventUser)
    current_event = event_usr.filter_by(event_id=int(user_data['event_id']), user_id=int(user_data['user_id'])).first()
    if current_event is not None:
        return Response('User is already registered', 402)

    try:
        event_user = EventUser(event_id=user_data['event_id'], user_id=user_data['user_id'])
        session.add(event_user)
        session.commit()
    except IntegrityError:
        return Response('Integrity Error', status=402)
    return Response('User successfully added to event!', status=200)


@event_api.route("/api/v1/event/<id>", methods=['GET'])
def get_event_by_id(id):
    event = session.query(Event)
    current_event = event.get(int(id))
    if current_event is None:
        return Response('Event not found', 404)
    return Response(
        response=json.dumps(current_event.to_dict(), cls=AlchemyEncoder),
        status=200,
        mimetype='application/json'
    )


@event_api.route("/api/v1/event/<id>", methods=['DELETE'])
def delete_by_id(id):
    event = session.query(Event)
    current_event = event.get(int(id))
    if current_event is None:
        return Response('Event not found', 404)
    session.delete(current_event)
    try:
        session.commit()
        return Response('Deleted successfully', 200)
    except:
        return Response('Delete failed', 402)


@event_api.route("/api/v1/event/<event_id>/<user_id>", methods=['DELETE'])
def delete_user_from_event(event_id, user_id):
    event = session.query(EventUser)
    current_event = event.filter_by(event_id=int(event_id), user_id=int(user_id)).first()
    if current_event is None:
        return Response('Event or user not found', 404)
    session.delete(current_event)
    try:
        session.commit()
        return Response('Deleted successfully', 200)
    except:
        return Response('Delete failed', 402)
