import {IEvent} from "../models";
import {useState} from "react";

export async function getCreatedEvents(url : string) {
    const headers = {
        Authorization: `Basic ${sessionStorage.getItem('token')}`,
        'Content-Type': 'application/json',
    };

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
        alert(error.message);
    });
}
