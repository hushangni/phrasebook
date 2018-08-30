import React, { Component } from 'react';
import logo from '../../assets/logo.svg';

class Landing extends Component {

    handleClick(e) {
        e.preventDefault();

        const land = document.querySelector('.landing');
        const translate = document.querySelector('.translate-section');
        land.style.display = 'none';
        translate.style.display = 'flex';
    }

    render() {
        return (
            <header className="landing">
                <div className="logo-words">
                    <img src={logo} alt="globe inside of a speech" className="logo"/>
                    <h1 className="phrasebook">Phrasebook</h1>
                </div>

                <hr className="white-break"/>

                <div className="landing-buttons">
                    <a href="#" className="button" onClick={this.handleClick}>Guest</a>
                    <a href="#" className="button" onClick={this.handleClick}>Login</a>
                </div>

            </header>
        );
    }
}

export default Landing;