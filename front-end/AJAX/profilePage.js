const requestUrl = 'http://127.0.0.1:5000/api/v1/user/' + sessionStorage.getItem("username")

function getProfile (url){
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
getProfile(requestUrl).then(data => {
    document.getElementById("username-profile").innerText = data.username
    document.getElementById("email").innerText = data.email
    document.getElementById("phone").innerText = data.phone
    document.getElementById("name").innerText = data.firstName + " " + data.lastName
})

function seeEvents() {
     window.location.href = "./CreatedEventsPage.html"
}