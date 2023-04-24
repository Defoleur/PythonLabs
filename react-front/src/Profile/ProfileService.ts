export async function getProfile(url: string) {
    const headers = {
        Authorization: `Basic ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    };

    return fetch(url, {
        method: 'GET',
        headers,
    }).then((response) => {
        if (response.ok) {
            console.log(response);
            return response.json();
        }
        return response.json().then((error) => { throw new Error(error.message); });
    }).catch((error) => {
        console.error(error);
        alert(error.message);
    });
}
