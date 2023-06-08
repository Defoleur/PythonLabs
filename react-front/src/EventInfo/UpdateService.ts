import ErrorMessageProvider from "../ErrorMessageProvider";

export default async function UpdateEvent(url : string, body: object) {
    const headers = {
        Authorization: `Basic ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    };

    // eslint-disable-next-line no-return-await
    try {
    const response = await fetch(url, {
      method: 'PUT',
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
