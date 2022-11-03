from datetime import datetime
from datetime import date
import re
from flask import Flask, request, Response, Blueprint
from psycopg2 import IntegrityError
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.models import Event, EventUser, User

engine = create_engine("postgresql://postgres:admin@localhost:5432/events-calendar")
Session = sessionmaker(bind=engine)
session = Session()

event_api = Blueprint('event_api', __name__)


@event_api.route("/api/v1/event", methods=['POST'])
def create_event():
    event_data = request.get_json()
    if event_data is None:
        return Response(status=402)
    if('title' in event_data and
    'content' in event_data and
    'date' in event_data and
    'startTime' in event_data and
    'endTime' in event_data and
    'user_id' in event_data):
        title = event_data['title']
        content = event_data['content']
        data = re.search('(\d*)-(\d*)-(\d*)', event_data['date'])
        year = data[1]
        day = data[2]
        month = data[3]
        date2 = date(int(year), int(day), int(month))
        startTime = event_data['startTime']
        endTime = event_data['endTime']
        user_id = event_data['user_id']

        event = Event(title=title, content=content, user_id=user_id, endTime=endTime, date=date2, startTime=startTime)
        session.add(event)
        try:
            session.commit()
        except IntegrityError:
            return Response(status=402)
        return Response(status=200)
    else:
        return Response(status=402)
