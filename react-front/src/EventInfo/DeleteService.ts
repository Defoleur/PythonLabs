export default async function DeleteInfo(url : string) {
    const headers = {
        Authorization: `Basic ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    };
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers,
        });
        if (response.ok) {
            return response.json();
        } else {
            const error = await response.json();
                throw new Error(error.message);
            }
        } catch (error : any) {
    console.error(error);
    alert(error.message);
    throw error;
  }
}
