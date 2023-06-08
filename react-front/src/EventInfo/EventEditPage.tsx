import React, {useEffect, useState} from "react";
import styles from "../Styles/EditEventPage.module.scss";
import {IEvent} from "../models";
import {Link, useNavigate, useParams} from "react-router-dom";
import ErrorMessageProvider from "../ErrorMessageProvider";
import {Alert} from "react-bootstrap";
import UpdateEvent from "./UpdateService";
import getInfo from "./InfoService";


export default function EventEditPage(){
    const { id } = useParams();
    const eventEditUrl = `http://127.0.0.1:5000/api/v1/event`
    const navigation = useNavigate();
    const [showAlert, setShowAlert] = useState(false);
    const [textAlert, setTextAlert] = useState("");
    const eventUrl = `http://127.0.0.1:5000/api/v1/event/${id}`;
    const [event, setEvent] = useState<IEvent>({
    id: 0,
    title: "",
    content: "",
    date: "",
    startTime: "",
    endTime: "",
    user_id: 0,
    username: "",
  });
    useEffect(() => {
        getInfo(eventUrl).then((data) => {
            const event : IEvent = data
            setEvent(event)
        })
    }, [])
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEvent((prevEvent : IEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

   const handleSubmit = () => {
  UpdateEvent(eventEditUrl, event).then(response => {
      if (response.message == "Event updated") {
        navigation(`/event/${id}`);
        alert("Event was successfully updated.");
      }
    }).catch(error => {
      setTextAlert(ErrorMessageProvider(error.message));
      setShowAlert(true);
    });
};

  return (
      <div className={styles.body}>
        <div className={styles["custom-container"]}>
            <div className={`${styles["event-name"]} text-center m-3`} id="event-name">Edit event!</div>
          <div className={styles["event-details"]}>
            <div className="row gx-5">
              <div className="col-md-6">
                <div className={styles["edit-div"]}>
                  <div className={styles["event-owner"]}>Event name: </div>
                  <input
                    type="text"
                    name="title"
                    value={event.title}
                    onChange={handleInputChange}
                    className={styles["edit-div-element"]}
                    aria-label="title"
                  />
                </div>
                <div className={styles["edit-div"]}>
                  <div className={styles["event-date"]}>Date 📅: </div>
                  <input
                    type="date"
                    name="date"
                    value={event.date}
                    onChange={handleInputChange}
                    className={styles["edit-div-element"]}
                    aria-label="date"
                  />
                </div>
                <div className={styles["edit-div"]}>
                  <div className={styles["event-date"]}>Time 🕰️:</div>
                  <input
                    type="time"
                    name="startTime"
                    value={event.startTime}
                    onChange={handleInputChange}
                    className={styles["edit-div-element"]}
                    aria-label="start-time"
                  />
                  <input
                    type="time"
                    name="endTime"
                    value={event.endTime}
                    onChange={handleInputChange}
                    className={styles["edit-div-element"]}
                     aria-label="end-time"
                  />
                </div>
              </div>
              <div className="col-md-6">
                  <div className={styles["event-description"]}>
                  Description:
                  <textarea
                    className={`profile-data text ${styles["edit-div-element"]} ${styles["bio-edit"]}`}
                    form="usrform"
                    name="content"
                    value={event.content}
                    onChange={handleInputChange}
                     aria-label="content"
                  ></textarea>
                </div>
                  {showAlert && (
              <Alert
                variant="danger"
                onClose={() => setShowAlert(false)}
                dismissible
              >
                <label className={styles['alert-label']} aria-label="error-label">{textAlert}</label>
              </Alert>
            )}
              </div>
                <div>
              <button className={styles["custom-button"]} onClick={handleSubmit}>
                Save!
              </button>
                 <Link to={`/event/${id}`}><button className={`${styles["custom-button"]}`}>Back!</button></Link>
            </div>
                </div>
          </div>
        </div>
      </div>
  );
}
