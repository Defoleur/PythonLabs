import React from "react";
import {IEvent} from "../models";
import styles from "../Styles/CreatedEventsPage.module.scss"
import Avatar from "../mikey.png"
import {Link} from "react-router-dom";
interface EventsProps{
    events: IEvent[]
}

export default function Events({events}: EventsProps){
  return (<>
      {events.length > 0 ?
      (<div className={styles["events-container"]}>
          {events.map((event) => (
                <div key={event.id} className={`${styles['event-container']}`}>
                    <div className={styles["event"]}>
                        <div className={styles["event-details"]}>
                            <div className={styles["event-name"]}>{event.title}</div>
                            <hr className={styles["hr"]}/>
                            <div className={styles["event-owner"]}>
                                <img className={styles["profile-pic"]} src={`https://picsum.photos/299`} alt="My Profile Picture" /> {event.username}
                            </div>
                            <div className={styles["event-date"]}>📅: {event.date}</div>
                            <div className={styles["event-date"]}>🕰️: {event.startTime} - {event.endTime}</div>
                            <div className={styles["event-description"]}>Description: {event.content}</div>
                            <Link to={`/event/${event.id}`}><button className={`${styles["btn-primary"]} btn-primary btn btn-sm`}>More info!</button></Link>
                        </div>
                    </div>
                </div>)
          )}
      </div>) : <h1 className={`justify-content-center ${styles["message"]}`}>
              There are not any events 😕
          </h1>}</>
  )
}
