import datetime
from datetime import date, time
import bcrypt as bcrypt
from flask import Response
from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, Enum
from sqlalchemy.orm import relationship, declarative_base, validates
import enum
import re

Base = declarative_base()


class Role(enum.Enum):
    user = 1
    admin = 2


def validate_name(name):
    length = len(name)
    if length <= 3 or length > 40:
        raise ValueError("Length of username should be less than 40 and more than 4 characters long")
    return name


def validate_date(date):
    if date <= datetime.date.today():
        raise ValueError("Date of this day is earlier than today")
    return date

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    firstName = Column(String)
    lastName = Column(String)
    phone = Column(String, unique=True)
    email = Column(String, unique=True)
    role = Column(Enum(Role))

    event_users = relationship("EventUser", cascade="all, delete")
    events = relationship("Event", cascade="all, delete")

    def to_dict(self) -> dict:
        return {
            'username': self.username,
             'first_name': self.firstName,
            'last_name': self.lastName,
            'password': self.password,
            'phone': self.phone,
            'email': self.email,
            'role': str(self.role)
        }

    @validates("username")
    def validate_username(self, key, username):
        length = len(username)
        if length <= 4 or length > 30:
            raise ValueError("Length of username should be less than 30 and more than 5 characters long")
        return username

    @validates("first_name")
    def validate_first_name(self, key, first_name):
        return validate_name(first_name)

    @validates("last_name")
    def validate_last_name(self, key, last_name):
        return validate_name(last_name)

    __email_r = re.compile("""(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[""" +
                           """\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")""" +
                           """@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|""" +
                           """2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:""" +
                           """(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])""")
    __password_r = re.compile("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")
    __phone_r = re.compile("^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$")

    @validates("email")
    def validate_email(self, key, email):
        if User.__email_r.match(email) is None:
            raise ValueError("This is not email")

        return email

    @validates("password")
    def validate_password(self, key, password: str):
        if User.__password_r.match(password) is None:
            raise ValueError("This is not password(8 characters long+, one letter and number")
        new_password = bytes(password, "utf-8")
        new_password = bcrypt.hashpw(new_password, bcrypt.gensalt(12))
        return new_password.decode("utf-8")

    @validates("phone")
    def validate_phone(self, key, phone):
        if User.__phone_r.match(phone) is None:
            raise ValueError("This is not a phone number")

        return phone


class Event(Base):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    content = Column(String)
    date = Column(Date)
    startTime = Column(Time)
    endTime = Column(Time)
    user_id = Column(Integer, ForeignKey("user.id"))

    user = relationship("User")
    event_users = relationship("EventUser", cascade="all, delete")

    def to_dict(self) -> dict:
        return {
            'title': self.title,
            'content': self.content,
            'date': str(self.date),
            'startTime': str(self.startTime),
            'endTime': str(self.endTime),
            'user_id': self.user_id
        }

    @validates('startTime', 'endTime')
    def time_validation(self, key, field):
        if key == 'startTime':
            return field
        elif key == 'endTime':
            if self.startTime > field:
                raise ValueError("The end time field must be greater-or-equal than the start time field")
        return field

    @validates('date')
    def date_validation(self, key, date):
        return validate_date(date)


class EventUser(Base):
    __tablename__ = "event_user"
    event_id = Column("event", Integer, ForeignKey("event.id"), primary_key=True)
    user_id = Column("user", Integer, ForeignKey("user.id"), primary_key=True)

    event = relationship("Event")
    user = relationship("User")

    def to_dict(self) -> dict:
        return {
            'event': self.event,
             'user': self.user
        }
