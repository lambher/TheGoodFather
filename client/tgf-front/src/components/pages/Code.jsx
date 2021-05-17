import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import qs from 'querystring';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const client_id = "814553468900-0b749akpqnfmc8hsfrilmvdis28baqr3.apps.googleusercontent.com";
const client_secret = "WzKL7fUuQ4fYYMYo3OKo8h5Z";
const redirect_uri = "http://localhost:3000/code"

function fetchToken(code) {
    axios.post('https://oauth2.googleapis.com/token', qs.stringify({
        code: code,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }).then(response => {
        console.log(response);
    });
}

export default function Code(props) {

    const query = useQuery();

    useEffect(() => fetchToken(query.get("code")), []);


    console.log(query.get("code"));
    console.log(props.location.search);

    return (
        <div>
            <p>code : {query.get("code")}</p>
            <p>state : {query.get("state")}</p>
            <p>scope : {query.get("scope")}</p>
            <p>access_token : {query.get("access_token")}</p>
            <p>param : {props.location.search}</p>

        </div>
    );
}