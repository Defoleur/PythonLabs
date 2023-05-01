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
    const[filteredAttachedEvents, setFilteredAttachedEvents] = useState<IEvent[]>();
    const [titleFilter, setTitleFilter] = useState('');
    const [ownerFilter, setOwnerFilter] = useState('');
    const [showCreatedEvents, setShowCreatedEvents] = useState(true);
    const [showAttachedEvents, setShowAttachedEvents] = useState(true);
    const [isLoading, setIsLoading] = useState(true)
    const [startTimeFilter, setStartTimeFilter] = useState('');
    const [endTimeFilter, setEndTimeFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

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
            setFilteredAttachedEvents(events)
            setIsLoading(false)
         })
     },[])

    // const handleTitleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value;
    //     setTitleFilter(value);
    //     filterEvents(value, ownerFilter);
    // };
    //
    //  const handleOwnerFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const value = e.target.value;
    //     setOwnerFilter(value);
    //     filterEvents(titleFilter, value);
    // };

     const filterEvents = () => {
     const filtered = events?.filter(
    (event) =>
      event.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
      event.username.toLowerCase().includes(ownerFilter.toLowerCase()) && // Case-insensitive owner filter
      (!startTimeFilter || event.startTime >= startTimeFilter) && // Time filter
      (!endTimeFilter || event.endTime <= endTimeFilter) && // Time filter
      (!startDateFilter || event.date >= startDateFilter) && // Date filter
      (!endDateFilter || event.date <= endDateFilter) // Date filter
  );
    setFilteredEvents(filtered || []);
    const filteredAttached = attachedEvents?.filter(
    (event) =>
      event.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
      event.username.toLowerCase().includes(ownerFilter.toLowerCase()) && // Case-insensitive owner filter
      (!startTimeFilter || event.startTime >= startTimeFilter) && // Time filter
      (!endTimeFilter || event.endTime <= endTimeFilter) && // Time filter
      (!startDateFilter || event.date >= startDateFilter) && // Date filter
      (!endDateFilter || event.date <= endDateFilter) // Date filter
  );
    setFilteredAttachedEvents(filteredAttached || []);
  };
    const resetFilters = () => {
        setOwnerFilter("")
        setTitleFilter("")
        setStartTimeFilter("")
        setEndTimeFilter("")
        setStartDateFilter("")
        setEndDateFilter("")
    }
    return (
        <div className={styles['body']}>
        <div className="container-fluid">
            <div className="row flex-grow-0">
                <div className="col-md-4 col-12 flex-column mx-auto">
                    <div className={`${styles["filter-container"]} flex-column`}>
                        <div className={styles["filters"]}>
                            <h3>Filters</h3>
                            <input type="text" placeholder="Search by title..." value={titleFilter}
                  onChange={(e) => setTitleFilter(e.target.value)}/>
                            <input type="text" placeholder="Search by owner..." value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}/>
                            <div>
                                <input type="time" placeholder="Start time" value={startTimeFilter} onChange={(e) => setStartTimeFilter(e.target.value)} />
                                <input type="time" placeholder="End time" value={endTimeFilter} onChange={(e) => setEndTimeFilter(e.target.value)} />
                            </div>
                            <div>
                                <input type="date" placeholder="Start date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
                                <input type="date" placeholder="End date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
                            </div>
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
                             {/*<button className={`btn btn-primary ${styles["btn-primary"]} btn-sm ${styles["btn-search"]}`} onClick={resetFilters}>Reset filters!</button>*/}
                            <button className={`btn btn-primary ${styles["btn-primary"]} btn-sm ${styles["btn-search"]}`} onClick={filterEvents}>Search!</button>
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
      {showCreatedEvents === showAttachedEvents && <hr className={styles["hr"]}/> }
    {showAttachedEvents && (
      <>
        <h1 className={`justify-content-center ${styles["event-type"]}`}>
          Attached events
        </h1>
        {filteredAttachedEvents && <Events events={filteredAttachedEvents}></Events>}
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
