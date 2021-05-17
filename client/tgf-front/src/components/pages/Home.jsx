import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import Cookies from 'universal-cookie';

const clientId = "814553468900-0b749akpqnfmc8hsfrilmvdis28baqr3.apps.googleusercontent.com";
const apiKey = "AIzaSyBhrI_Wf9WLWNztAZqEPwyvM0AeixRWm4E";

const responseGoogle = (response) => {
    console.log(response);

    const cookies = new Cookies();
    cookies.set('googleId', response.googleId, { domain: 'https://youtube.com' });
    cookies.set('accessToken', response.accessToken, { domain: 'https://youtube.com' });
    console.log(cookies.get('accessToken')); // Pacman
}

const errorGoogle = (response) => {
    console.log(response);
}
class Home extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.setState({
            props: props
        })
    }

    componentDidMount() {
        const token = "ya29.a0AfH6SMCWIrWI3Evbb7S5m7Nkk5p9i-WwRVcY8Fi9hVC6N0wyA6g7dcJ1bRGFTan1MfYfwOtfIp_80EZ8Ka-AqHscwDlyF4cCbDqaYlvo8L8a7PJ7Spl98GeSQKHzPhF3fs6aXIeuo2JMcK2PwYTDeLtME7Ix";
        axios.get(`https://www.googleapis.com/youtube/v3/channels?mine=true&part=snippet%2CcontentDetails%2Cstatistics&key=${apiKey}`, {
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: "application/json"
            }
        })
            .then(res => {
                console.log(res);
            })
    }


    render() {
        return (
            <div>
                <GoogleLogin
                    apiKey={apiKey}
                    clientId={clientId}
                    scope="https://www.googleapis.com/auth/youtube.readonly"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={errorGoogle}
                    cookiePolicy={'single_host_origin'}
                />

                {this.state}
            </div>
        );
    }
}

export default Home;