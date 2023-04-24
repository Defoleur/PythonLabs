import {Login} from "../Login/Login";

export default async function Registration(url: string, body: object) {
    const headers = {
        'Content-Type': 'application/json',
    };

    // eslint-disable-next-line no-return-await
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
    console.error(error);
    alert(error.message);
    throw error;
  }

}
