from sqlalchemy import Column, Integer, String, Date, Time, ForeignKey, Enum
from sqlalchemy.orm import relationship, declarative_base
import enum

Base = declarative_base()


class Role(enum.Enum):
    user = 1
    admin = 2


class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    password = Column(String)
    firstName = Column(String)
    lastName = Column(String)
    phone = Column(String)
    email = Column(String)
    role = Column(Enum(Role))


class Event(Base):
    __tablename__ = "event"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    content = Column(String)
    date = Date()
    startTime = Time()
    endTime = Time()
    user_id = Column(Integer, ForeignKey("user.id"))

    user = relationship("User")


class EventUser(Base):
    __tablename__ = "event_user"
    event_id = Column("event", Integer, ForeignKey("event.id"), primary_key=True)
    user_id = Column("user", Integer, ForeignKey("user.id"), primary_key=True)

    event = relationship("Event")
    user = relationship("User")


