const requestUrl = 'http://127.0.0.1:5000/api/v1/user/login'

async function login (url, body){
    const headers = {
        "Content-Type": "application/json"
    }

    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers,
    }).then(response => {
        if (response.ok){
            window.location.href = "./ProfilePage.html"
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

function onClick(){
    const body = {
        "username": document.getElementById("username").value,
        "password": document.getElementById("password").value
    }
    console.log(body)
    login(requestUrl, body).then(data => sessionStorage.setItem("token", data.basic))
    sessionStorage.setItem("username", body.username)
}