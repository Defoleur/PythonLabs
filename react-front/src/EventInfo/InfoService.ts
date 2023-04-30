export default async function getInfo(url : string) {
    const headers = {
        Authorization: `Basic ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    };

    // eslint-disable-next-line no-return-await
    return await fetch(url, {
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
        //alert(error.message);
    });
}
