export default async function CreateEvent(url: string, body: object) {
    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${sessionStorage.getItem('token')}`
    };

     try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers,
    });

    if (response.ok) {
      return response.json();
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  } catch (error : any) {
    //alert(error.message);
    throw error;
  }

}
