import ErrorMessageProvider from "../ErrorMessageProvider";

export async function GetEvents(url : string) {
    const headers = {
        Authorization: `Basic ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    };

    return await fetch(url, {
        method: 'GET',
        headers,
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then((error) => { throw new Error(error.message); });
    }).catch((error) => {
        alert(ErrorMessageProvider(error.message));
    });
}
