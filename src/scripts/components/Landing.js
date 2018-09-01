import React, { Component } from "react";
import logo from "../../assets/logo.svg";
import firebase from "../firebase";

import Translate from './Translate';


class Landing extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            userID: "guest"
        }
    }

    handleLogin = (e) => {
        e.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase.auth().signInWithPopup(provider).then((res) => {

            const token = res.credential.accessToken;
            const user = res.user;

            console.log("this user id", res.user.uid);
            this.setState({
                loggedIn: true,
                userID: res.user.uid
            })

        }).catch(function (error) {
            console.log(error);
        }).then(() => {
            const land = document.querySelector(".landing");
            const translate = document.querySelector(".main-container");
            land.style.display = "none";
            translate.style.display = "flex";
        });
    }

    handleClick = (e) => {
        e.preventDefault();

        const land = document.querySelector(".landing");
        const translate = document.querySelector(".main-container");
        land.style.display = "none";
        translate.style.display = "flex";
    }

    render() {
        return (
        <div className="App">
            <header className="landing">
                <div className="logo-words">
                    <img src={logo} alt="globe inside of a speech" className="logo" />
                    <h1 className="phrasebook">Phrasebook</h1>
                </div>

                <hr className="white-break" />

                <div className="landing-buttons">
                    <a href="#" className="button" onClick={this.handleClick}>
                        Guest
                    </a>
                    <a href="#" className="button" onClick={this.handleLogin}>
                        Login
                    </a>
                </div>
            </header>
            <Translate  userID={this.state.userID}/>
        </div>

        );
    }
}

export default Landing;
