import ErrorMessageProvider from "../ErrorMessageProvider";

export async function getUsers(url: string) {
    const headers = {
        Authorization: `Basic ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    };

    return fetch(url, {
        method: 'GET',
        headers,
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then((error) => { throw new Error(error.message); });
    });
}
