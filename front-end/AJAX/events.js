const requestUrl = 'http://127.0.0.1:5000/api/v1/event/' + sessionStorage.getItem("username") + "/created"

function getCreatedEvents (url){
    const headers = {
        "Authorization": "Basic " + sessionStorage.getItem("token"),
        "Content-Type": "application/json"
    }

    return fetch(url, {
        method: "GET",
        headers: headers,
    }).then(response => {
        if (response.ok){
            return response.json()
        }
        else {
            return response.json().then(error => { throw new Error(error.message); });
        }
    }).catch(error => {
        console.error(error);
        alert(error.message);
        });
}

console.log(requestUrl)
console.log(sessionStorage.getItem("token"))
getCreatedEvents(requestUrl).then(data =>{
    let eventsHTML = "";
    const eventsContainer = document.getElementById("events-container");
    document.getElementById("username").innerText = sessionStorage.getItem("username")
    let eventCounter = 0;
    data.forEach((event) => {
        console.log(event)
      eventsHTML += `
        <div class="col-lg-5 event-container">
          <div class="event">
            <div class="event-details">
              <div class="event-name">${event.title}</div>
              <hr>
              <div class="event-owner">
                <img class="profile-pic" src="./Images/mikey.png" alt="My Profile Picture"> ${event.username}
              </div>
              <div class="event-date">📅: ${event.date}</div>
              <div class="event-date">🕰️: ${event.startTime} - ${event.endTime}</div>
              <div class="event-description">Description: ${event.content}</div>
              <button class="btn btn-primary btn-sm" onclick="openEvent(${event.id})">More info!</button>
            </div>
          </div>
        </div>
      `;
        eventCounter++;

  if (eventCounter % 2 === 0) {
    eventsHTML += `</div><div class="row">`;
  }
    });

    if (eventCounter % 2 === 1) {
  eventsHTML += `</div>`;
}

eventsContainer.innerHTML = `
      <div class="row">
        ${eventsHTML}
      </div>
`;
})

function openEvent(id){
    sessionStorage.setItem("event_id", id)
    window.location.href = "./EventInfoPage.html"
}
