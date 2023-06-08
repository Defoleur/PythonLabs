export async function Login (url: string, body: object) {
    const headers = {
        'Content-Type': 'application/json',
    };

    return await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers,
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then((error) => {
            throw new Error(error.message);
        });
    })
}
