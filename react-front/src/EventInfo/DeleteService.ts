import ErrorMessageProvider from "../ErrorMessageProvider";

export default async function DeleteInfo(url : string) {
    const headers = {
        Authorization: `Basic ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    };
    return await fetch(url, {
            method: 'DELETE',
            headers,
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then((error) => { throw new Error(error.message); });
    })
}
