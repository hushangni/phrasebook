import React, { Component } from 'react';
import axios from 'axios';
import firebase from '../firebase';



import SavedAside from './SavedAside';
import YourBooks from './YourBooks';


// urls/keys for Yandex API
const translateURL = "https://translate.yandex.net/api/v1.5/tr.json/translate";
const languagesURL = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs';
const detectURL = 'https://translate.yandex.net/api/v1.5/tr.json/detect';
const apiKey = "trnsl.1.1.20180828T150321Z.763350fbc08abff9.2cddae20856c6abb37452b3c5e6fc8c12805a059";


class Translate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            langs: {},
            langToTranslate: "",
            originalText: "",
            translatedText: "",
            phrasesList: [],
            userID: props.userID,
            userExists: false
        }
    }

    componentDidMount = () => {
        console.log(this.props.userID, "this props user translate")
        axios.get(languagesURL, {
            params: {
                key: apiKey,
                ui: 'en'
            }
        }).then((res) => {
            console.log(res.data.langs);
            this.setState({
                langs: res.data.langs,
                userID: this.props.userID
            });

            // populate the select for the form
            const select = document.getElementById('langToTranslate');

            for (let key in res.data.langs) {
                if (res.data.langs.hasOwnProperty(key)) {
                    const opt = document.createElement('option');
                    opt.value = key;
                    opt.innerHTML = res.data.langs[key];
                    select.appendChild(opt);
                }
            }

        });
        console.log('props',this.props);

        if(this.props.userID === 'guest') {
            const dbRef = firebase.database().ref(`guest/unsaved`);
            console.log(dbRef, "db ref");

            dbRef.on('value', (snapshot) => {
                let data = snapshot.val();
                if (data === null) {
                    data = {};
                }
                this.setState({
                    userID: 'guest'
                }, () => {
                    this.setPhrases(data);
                })

            });
        }

        firebase.auth().onAuthStateChanged((user) => {
            if(user !== null) {
                const dbRef = firebase.database().ref(`${user.uid}/unsaved`);
                document.querySelector('.signout-button').text = "sign out";
                console.log(dbRef, "db ref");

                dbRef.on('value', (snapshot) => {
                    let data = snapshot.val();
                    if(data === null) {
                        data = {};
                    }
                    this.setState({
                        userID: user.uid
                    },() => {
                        this.setPhrases(data);
                    })

                });
            }
            else {
                document.querySelector('.signout-button').text = "back";
                this.setState({
                    phrasesList: [],
                    userID: 'guest'
                })
            }
        });

        if (performance.navigation.type == 1) {

            firebase.auth().signOut().then(function () {
                const land = document.querySelector(".landing");
                const translate = document.querySelector(".main-container");
                land.style.display = "flex";
                translate.style.visibility = "hidden";
                translate.style.opacity = 0;
            })

            document.querySelector(".your-book-list").innerHTML = "";
        }
    }


    translateText = () => {
        console.log(this.state.userID, "translate userID");
        axios.get(translateURL, {
            params: {
                key: apiKey,
                text: this.state.originalText,
                lang: this.state.langToTranslate
            }
        }).then((res) => {
            const translated = res.data.text[0];
            this.setState({
                translatedText: translated,
            });

            document.getElementById('translatedText').value = this.state.translatedText;
        });



    }

    handleChange = (e) => {
        e. preventDefault();

        this.setState({
            [e.target.id]: e.target.value
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({
            textToTranslate: document.getElementById('originalText').value
        });

        this.translateText();
    }

    forceUpdate = () => {
        this.forceUpdate();
    }

    handleSave = (e) => {
        e.preventDefault();
        this.addPhraseToDatabase();
        document.getElementById('originalText').value = '';
    }

    setPhrases = (phraseObject) => {
        const phrasesArray = Object.entries(phraseObject)
                            .map((item) => {
                                return ( {
                                    key: item[0],
                                    original: item[1].original,
                                    translated: item[1].translated
                                })
                            });
        this.setState({
            phrasesList: phrasesArray
        })
    }

    addPhraseToDatabase = () => {
        console.log("adding to book");
        const dbRef = firebase.database().ref(`${this.state.userID}/unsaved`);
        dbRef.push({
            original: this.state.originalText,
            translated: this.state.translatedText
        })
    }

    deletePhrase = (phraseID) => {
        const phraseDbRef = firebase.database().ref(`${this.state.userID}/unsaved/${phraseID}`);
        phraseDbRef.remove();
    }

    handleSignOut = (e) => {
        e.preventDefault();
        firebase.auth().signOut().then(function() {
            const land = document.querySelector(".landing");
            const translate = document.querySelector(".main-container");
            land.style.display = "flex";
            translate.style.visibility = "hidden";
            translate.style.opacity = 0;
        })
        window.location.reload();
        document.querySelector(".your-book-list").innerHTML = "";
    }

    handleToggle = (e) => {
        e.preventDefault();
        document.querySelector('.hamburger-toggle').classList.toggle("x-toggle");
        document.querySelector('.saved-aside').classList.toggle("res-menu");
    }

    render() {
        return (
            <div className="main-container">
                <div className="hamburger-toggle" onClick={this.handleToggle}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <SavedAside phrasesList={this.state.phrasesList} deletePhrase={this.deletePhrase} userID={this.state.userID}/>
                <section className="translate-section">
                    <a href="#" className="button signout-button" onClick={this.handleSignOut}>Sign out</a>
                    <i className="fas fa-backspace signout-symbol" onClick={this.handleSignOut}></i>
                    <div className="translate-container">
                        <select name="langToTranslate" id="langToTranslate" onChange={this.handleChange}>
                            <option value=""> ⬇ to language    </option>
                            {/* dynamically populated from API*/}
                        </select>
                        <label htmlFor="langToTranslate" className="visually-hidden">Select the language to translate to</label>

                        <h2 className="original-header">Original</h2>
                        <form action="" className="translation-box">
                            <textarea type="text" name="originalText" id="originalText" placeholder="Text to translate..." maxLength='71' onChange={this.handleChange}/>
                            <label htmlFor="originalText" className="visually-hidden">Enter text to translate</label>

                            <input type="submit" value="Translate" className="translate-button button" onClick={this.handleSubmit} />
                            <i className="fas fa-sync-alt translate-symbol" onClick={this.handleSubmit} ></i>

                        </form>
                    </div>

                    <div className="translate-container">
                        <h2 className="translated-header">Translated</h2>
                        <form className="translation-box">
                            <textarea type="text" name="translatedText" id="translatedText" placeholder="Translated text..." value="" maxLength='71' onChange={this.handleChange}/>
                            <label htmlFor="translatedText" className="visually-hidden">Translated text appears here</label>

                            <input type="submit" value="Save" className="save-button button" onClick={this.handleSave}/>
                            <i className="fas fa-save save-symbol" onClick={this.handleSave}></i>
                        </form>

                    </div>
                </section>
                <div className="your-books-container">
                <YourBooks userID={this.state.userID} onChange={this.forceUpdate}/>
                </div>
            </div>
        )
    }
}

export default Translate;