import ErrorMessageProvider from "../ErrorMessageProvider";

export default async function DeleteUser(url : string) {
    const headers = {
        Authorization: `Basic ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    };

    // eslint-disable-next-line no-return-await
    return await fetch(url, {
        method: 'DELETE',
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
