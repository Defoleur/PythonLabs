from flask_testing import TestCase
from app import create_app


class UserAPITest(TestCase):
    def create_app(self):
        app = create_app()
        return app

    def test_hello(self):
        response = self.client.get("/api/v1/hello-world-27")
        self.assert200(response)

    def test_create_delete_user(self):
        post_response = self.client.post("/api/v1/user", json={"firstName": "Vitalik",
                                                                      "lastName": "Cena",
                                                                      "username": "vitaliipik",
                                                                      "email": "john@email.com",
                                                                      "password": "lolkek129L",
                                                                      "phone": "380634473833",
                                                                      "role": "user"
                                                                    })
        wrong_delete_response= self.client.delete("/api/v1/user/vitaliipi1", auth=("admin", "lolkek129L"))
        delete_response = self.client.delete("/api/v1/user/vitaliipik", auth=("admin", "lolkek129L"))
        wrong_post_response = self.client.post("/api/v1/user", json={"firstName": "Vitalik",
                                                                     "lastName1": "Cena",
                                                                     "usern1": "vitaliipik",
                                                                     "email": "john@email.com",
                                                                     "password": "lolkek129L",
                                                                     "phone": "380634473833",
                                                                     "role": "admin"
                                                                  })

        self.assert400(wrong_post_response)
        self.assert404(wrong_delete_response)
        self.assert200(post_response)
        self.assert200(delete_response)

    def test_login(self):
        login = self.client.get("/api/v1/user/login", json={"username": "admin", "password": "lolkek129L"})
        self.assert200(login)

    def test_wrong_login(self):
        login_with_wrong_password = self.client.get("/api/v1/user/login", json={"username": "admin", "password": "admin"})
        login_with_wrong_body = self.client.get("/api/v1/user/login", json={"username1": "admin", "password": "lolkek129L"})
        login_with_wrong_username = self.client.get("/api/v1/user/login", json={"username": "admin1", "password": "lolkek129L"})
        login_with_invalid_body = self.client.get("/api/v1/user/login")
        self.assert404(login_with_wrong_password)
        self.assert400(login_with_wrong_username)
        self.assert400(login_with_wrong_body)
        self.assert400(login_with_invalid_body)

    def test_get_user(self):
        get = self.client.get("/api/v1/user/admin", auth=("admin", "lolkek129L"))
        get_with_wrong_username = self.client.get("/api/v1/user/admin1", auth=("admin", "lolkek129L"))
        self.assert200(get)
        self.assert404(get_with_wrong_username)

    def test_update_user(self):
        update = self.client.put("/api/v1/user", auth=("admin", "lolkek129L"), json={"firstName": "admin1"})
        wrong_update = self.client.put("/api/v1/user", auth=("admin", "lolkek129L"))
        self.assert200(update)
        self.assert400(wrong_update)


class EventAPITest(TestCase):
    def create_app(self):
        app = create_app()
        return app

    def test_create_delete_event(self):
        post_response = self.client.post("/api/v1/event", json={"id": 10,
                                                                "title": "My Title!",
                                                                "content": "This is a description to my new event!",
                                                                "date": "2022-12-22",
                                                                "startTime": "14:00:00",
                                                                "endTime": "17:30:00"
                                                                }, auth=("admin", "lolkek129L"))
        not_json_post_response = self.client.post("/api/v1/event",  auth=("admin", "lolkek129L"))
        not_correct_date_post_response = self.client.post("/api/v1/event", json={"id": 10,
                                                                "title": "My Title!",
                                                                "content": "This is a description to my new event!",
                                                                "date": "202212-22",
                                                                "startTime": "14:00:00",
                                                                "endTime": "17:30:00"
                                                                }, auth=("admin", "lolkek129L"))
        not_correct_time_post_response = self.client.post("/api/v1/event", json={"id": 10,
                                                                                 "title": "My Title!",
                                                                                 "content": "This is a description to my new event!",
                                                                                 "date": "2022-12-22",
                                                                                 "startTime": "1400:00",
                                                                                 "endTime": "17:30:00"
                                                                                 }, auth=("admin", "lolkek129L"))
        not_found_delete_response = self.client.delete("/api/v1/event/100", auth=("admin", "lolkek129L"))
        not_rights_delete_response = self.client.delete("/api/v1/event/10", auth=("defaultUser", "lolkek129L"))
        delete_response = self.client.delete("/api/v1/event/10", auth=("admin", "lolkek129L"))
        without_date_post_response = self.client.post("/api/v1/event", json={"id": 11,

                                                                "content": "This is a description to my new event!",
                                                                "date": "2022-12-22",
                                                                "startTime": "14:00:00",
                                                                "endTime": "17:30:00"
                                                                }, auth=("admin", "lolkek129L"))
        self.assert200(post_response)
        self.assert200(delete_response)
        self.assert400(not_json_post_response)
        self.assert400(without_date_post_response)
        self.assert400(not_correct_date_post_response)
        self.assert400(not_correct_time_post_response)
        self.assert400(not_rights_delete_response)
        self.assert404(not_found_delete_response)

    def test_get_event(self):
        get = self.client.get("/api/v1/event/1")
        get_with_wrong_id = self.client.get("/api/v1/event/100")
        self.assert200(get)
        self.assert404(get_with_wrong_id)

    def test_update_event(self):
        update = self.client.put("/api/v1/event", auth=("admin", "lolkek129L"), json={"id": 1, "title": "Student's day"})
        wrong_update = self.client.put("/api/v1/event", auth=("admin", "lolkek129L"))
        not_enough_rights_update = self.client.put("/api/v1/event", auth=("defaultUser", "lolkek129L"), json={"id": 1, "title": "Student's day"})
        self.assert200(update)
        self.assert400(wrong_update)
        self.assert400(not_enough_rights_update)

    def test_get_created_events(self):
        not_enough_rights_get = self.client.get("/api/v1/4/created", auth=("defaultUser", "lolkek129L"))
        get = self.client.get("/api/v1/4/created", auth=("admin", "lolkek129L"))
        get_with_wrong_id = self.client.get("/api/v1/100/created", auth=("admin", "lolkek129L"))
        self.assert200(get)
        self.assert400(not_enough_rights_get)
        self.assert404(get_with_wrong_id)

    def test_get_attached_events(self):
        not_enough_rights_get = self.client.get("/api/v1/4/attached", auth=("defaultUser", "lolkek129L"))
        get = self.client.get("/api/v1/43/attached", auth=("admin", "lolkek129L"))
        get_with_wrong_id = self.client.get("/api/v1/100/attached", auth=("admin", "lolkek129L"))
        self.assert200(get)
        self.assert400(not_enough_rights_get)
        self.assert404(get_with_wrong_id)

    def test_add_user_to_event(self):
        post_response = self.client.post("/api/v1/event/user", json={"event_id": 12,
                                                                    "user_id": 43
                                                                }, auth=("admin", "lolkek129L"))
        delete_response = self.client.delete("/api/v1/event/12/43", auth=("admin", "lolkek129L"))
        not_found_delete_response = self.client.delete("/api/v1/event/100/43", auth=("admin", "lolkek129L"))
        self.assert404(not_found_delete_response)
        self.assert200(post_response)
        self.assert200(delete_response)

