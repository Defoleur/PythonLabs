from datetime import date, time
from unittest import main, TestCase
from models.models import User, Role, Event


def wrong_password(user):
    user.password = "1111"


def wrong_email(user):
    user.email = "svatoslavsh0gmail.com"


def wrong_username(user):
    user.username = "lol"


def wrong_phone(user):
    user.phone = "9212041"


def wrong_time(event):
    event.endTime = time(17, 00, 00)


def wrong_date(event):
    event.date = date(2022, 11, 10)


class TestUser(TestCase):
    user = User(username="sviat", firstName="Sviatoslav", lastName="Shainoha", email="svatoslavsh0@gmail.com",
                phone="380987669293", password="rarLem1299", role=Role.admin)

    def test_user_insert(self):
        self.assertEqual(self.user.email, "svatoslavsh0@gmail.com")
        self.assertNotEqual(self.user.password, "rarLem1299")
        self.assertEqual(self.user.firstName, "Sviatoslav")
        self.assertEqual(self.user.lastName, "Shainoha")
        self.assertEqual(self.user.phone, "380987669293")

    def test_password(self):
        with self.assertRaises(ValueError) as cm:
            wrong_password(self.user)
        the_exception = cm.exception
        self.assertEqual(the_exception.args[0], "This is not password(8 characters long+, one letter and number")

    def test_username(self):
        with self.assertRaises(ValueError) as cm:
            wrong_username(self.user)
        the_exception = cm.exception
        self.assertEqual(the_exception.args[0], "Length of username should be less than 30 and more than 5 characters long")

    def test_email(self):
        with self.assertRaises(ValueError) as cm:
            wrong_email(self.user)
        the_exception = cm.exception
        self.assertEqual(the_exception.args[0], "This is not email")

    def test_phone(self):
        with self.assertRaises(ValueError) as cm:
            wrong_phone(self.user)
        the_exception = cm.exception
        self.assertEqual(the_exception.args[0], "This is not a phone number")


class TestEvent(TestCase):
    event = Event(title="Student's day", content="The best day of my life", date=date(2022, 12, 10),
                  startTime=time(18, 00, 00), endTime=time(19, 00, 00))

    def test_event_insert(self):
        self.assertEqual(self.event.title, "Student's day")
        self.assertEqual(self.event.content, "The best day of my life")
        self.assertEqual(self.event.date, date(2022, 12, 10))
        self.assertEqual(self.event.startTime, time(18, 00, 00))
        self.assertEqual(self.event.endTime, time(19, 00, 00))

    def test_time(self):
        with self.assertRaises(ValueError) as cm:
            wrong_time(self.event)
        the_exception = cm.exception
        self.assertEqual(the_exception.args[0], "The end time field must be greater-or-equal than the start time field")

    def test_date(self):
        with self.assertRaises(ValueError) as cm:
            wrong_date(self.event)
        the_exception = cm.exception
        self.assertEqual(the_exception.args[0], "Date of this day is earlier than today")


if __name__ == '__main__':
    main()
