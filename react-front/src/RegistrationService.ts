export default async function Registration(url: string, body: object) {
    const headers = {
        'Content-Type': 'application/json',
    };

    // eslint-disable-next-line no-return-await
    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then((error) => { throw new Error(error.message); });
    }).catch((error) => {
        console.error(error);
        alert(error.message);
    });
}
