import React, {SetStateAction, useEffect, useState} from "react"
import styles from "./Styles/CreatedEventsPage.module.scss"
import {getCreatedEvents} from "./EventsProvider";
import {IEvent} from "./models";
import Events from "./Events";
import {useDispatch} from "react-redux";

export default function EventsPage(){
    const[events, setEvents] = useState<IEvent[]>();
    const[filteredEvents, setFilteredEvents] = useState<IEvent[]>();
    const [titleFilter, setTitleFilter] = useState('');
    const [ownerFilter, setOwnerFilter] = useState('');
    const dispatch = useDispatch();
    const requestUrl = `http://127.0.0.1:5000/api/v1/event/${sessionStorage.getItem('username')}/created`;
     useEffect(() => {
         dispatch({ type: 'LOGIN' });
         getCreatedEvents(requestUrl).then((data) => {
             const events : IEvent[] = data;
             setEvents(events)
             setFilteredEvents(events)
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
                            <select>
                                <option value="1">All events</option>
                                <option value="2">My events</option>
                                <option value="3">Attached events</option>
                            </select>
                            {/*<button className={`$btn ${styles["btn-primary"]} ${styles["btn-search"]}`}>Search!</button>*/}
                        </div>
                    </div>
                </div>
                <hr className={`${styles["hr-separator"]} ${styles["hr"]}`}/>
                    <div className={`col-md-8 col-12 mr-md-0 ${styles.main}`}>
                        {filteredEvents && (<Events events={filteredEvents}></Events>)}
                    </div>
            </div>
        </div>
        </div>
    )
}
