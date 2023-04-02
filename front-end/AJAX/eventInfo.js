const requestUrl = 'http://127.0.0.1:5000/api/v1/event/' + sessionStorage.getItem("event_id")
const getUsersUrl = `http://127.0.0.1:5000/api/v1/${sessionStorage.getItem("event_id")}/users`

async function getInfo (url){
    const headers = {
        "Authorization": "Basic " + sessionStorage.getItem("token"),
        "Content-Type": "application/json"
    }

    return await fetch(url, {
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


getInfo(requestUrl).then(data => {
    console.log(data)
    document.getElementById("tab-name").innerText = data.title
    document.getElementById("event-name").innerText = data.title
    const eventContainer = document.getElementById("event-info-container");
    eventContainer.innerHTML = `
           <div class="event-owner">
                      Owner: <img class="profile-pic" src="./Images/mikey.png" alt="My Profile Picture"> ${data.username}</div>
                   <div class="event-date">Date 📅: ${data.date}</div>
                   <div class="event-date">Time 🕰️: ${data.startTime} - ${data.endTime}</div>
                  <div class="event-description">Description: ${data.content}</div>
              </div> 
`;
})

getInfo(getUsersUrl).then(data => {
    console.log(data)
    let usersHTML = ""
    const users = document.getElementById("users");
    data.forEach((user) => {
        usersHTML += `<li class="attached-user"><img class="profile-pic" src="https://picsum.photos/200" alt="List Picture"> ${user.username}</li>`
    })
    if(usersHTML === ""){
        usersHTML = `<li class="attached-user">There aren't any users 😕</li>`
    }
    users.innerHTML = `
        <ul>
            ${usersHTML}
        </ul>
    `
})