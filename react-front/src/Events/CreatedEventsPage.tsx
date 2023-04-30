import React, {useEffect, useState} from "react"
import styles from "../Styles/CreatedEventsPage.module.scss"
import {GetEvents} from "./EventsProvider";
import {IEvent} from "../models";
import Events from "./Events";
import Loading from "../Loading";



export default function EventsPage(){
    const[events, setEvents] = useState<IEvent[]>();
    const[attachedEvents, setAttachedEvents] = useState<IEvent[]>();
    const[filteredEvents, setFilteredEvents] = useState<IEvent[]>();
    const [titleFilter, setTitleFilter] = useState('');
    const [ownerFilter, setOwnerFilter] = useState('');
    const [showCreatedEvents, setShowCreatedEvents] = useState(true);
    const [showAttachedEvents, setShowAttachedEvents] = useState(true);
    const [isLoading, setIsLoading] = useState(true)
    const eventsUrl = `http://127.0.0.1:5000/api/v1/event/${sessionStorage.getItem('username')}`;
    useEffect(() => {
         GetEvents(eventsUrl + '/created').then((data) => {
              setIsLoading(true)
             const events : IEvent[] = data;
             setEvents(events)
             setFilteredEvents(events)
             setIsLoading(false)
         })
        GetEvents(eventsUrl + '/attached').then((data) => {
            setIsLoading(true)
             const events : IEvent[] = data;
             setAttachedEvents(events)
            setIsLoading(false)
         })
     },[])

    const handleTitleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTitleFilter(value);
        filterEvents(value, ownerFilter);
    };

     const handleOwnerFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setOwnerFilter(value);
        filterEvents(titleFilter, value);
    };

     const filterEvents = (title: string, owner: string) => {
    const filtered = events?.filter(
      (event) =>
        event.title.toLowerCase().includes(title.toLowerCase()) &&
        event.username.toLowerCase().includes(owner.toLowerCase()) // Case-insensitive owner filter
    );
    setFilteredEvents(filtered || []);
  };
    return (
        <div className={styles['body']}>
        <div className="container-fluid">
            <div className="row flex-grow-0">
                <div className="col-md-4 col-12 flex-column mx-auto">
                    <div className={`${styles["filter-container"]} flex-column`}>
                        <div className={styles["filters"]}>
                            <h3>Filters</h3>
                            <input type="text" placeholder="Search by title..." value={titleFilter}
                  onChange={handleTitleFilterChange}/>
                            <input type="text" placeholder="Search by owner..." value={ownerFilter}
                  onChange={handleOwnerFilterChange}/>
                            <div><input type="time"/><input type="time"/></div>
                            <div><input type="date"/><input type="date"/></div>
                            <div className={styles.check}>
                                <input
                                    type="checkbox"
                                    checked={showCreatedEvents}
                                    onChange={() => {
                                        if (showAttachedEvents) {
                                            setShowCreatedEvents(!showCreatedEvents);
                                        } else {
                                            setShowCreatedEvents(true);
                                        }
                                    }}
                                />
                                <div className={styles["check-properties"]}>My events</div>
                            </div>
<div className={styles.check}>
    <input
      type="checkbox"
      checked={showAttachedEvents}
      onChange={() => {
        if (showCreatedEvents) {
          setShowAttachedEvents(!showAttachedEvents);
        } else {
          setShowAttachedEvents(true);
        }
      }}
      disabled={!showCreatedEvents && !showAttachedEvents}
    />
    <div className={styles["check-properties"]}>Attached events</div>
</div>
                        </div>
                    </div>
                </div>
                <hr className={`${styles["hr-separator"]} ${styles["hr"]}`}/>
                    <div className={`col-md-8 col-12 mr-md-0 ${styles.main}`}>
 {isLoading ? (
  <Loading color="white" />
) : (
  <>
    {showCreatedEvents && (
      <>
        <h1 className={`justify-content-center ${styles["event-type"]}`}>
          My events
        </h1>
        {filteredEvents && <Events events={filteredEvents}></Events>}
      </>
    )}
    {showAttachedEvents && (
      <>
        <h1 className={`justify-content-center ${styles["event-type"]}`}>
          Attached events
        </h1>
        {attachedEvents && <Events events={attachedEvents}></Events>}
      </>
    )}
  </>
)}

</div>
            </div>
        </div>
        </div>
    )
}
