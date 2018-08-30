import React, { Component } from 'react';
import axios from 'axios';
import SavedAside from './SavedAside';
import firebase from '../firebase';

const dbRef = firebase.database().ref('unsaved');

// urls/keys for Yandex API
const translateURL = "https://translate.yandex.net/api/v1.5/tr.json/translate";
const languagesURL = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs';
const detectURL = 'https://translate.yandex.net/api/v1.5/tr.json/detect';
const apiKey = "trnsl.1.1.20180828T150321Z.763350fbc08abff9.2cddae20856c6abb37452b3c5e6fc8c12805a059";


class Translate extends Component {
    constructor() {
        super();
        this.state = {
            langs: {},
            langToTranslate: "",
            originalText: "",
            translatedText: "",
            phrasesList: []
        }
    }

    componentDidMount() {
        console.log('component did mount called');
        axios.get(languagesURL, {
            params: {
                key: apiKey,
                ui: 'en'
            }
        }).then((res) => {
            console.log(res.data.langs);
            this.setState({
                langs: res.data.langs
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

        dbRef.on('value', (snapshot) => {
            if (snapshot.val()) {
                this.setPhrases(snapshot.val());
            } else {
                this.setState({
                    phrasesList: []
                })
            }
        });
    }

    translateText = () => {
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

    handleSave = (e) => {
        e.preventDefault();
        this.addPhraseToDatabase();
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
        dbRef.push({
            original: this.state.originalText,
            translated: this.state.translatedText
        })
    }

    deletePhrase = (phraseID) => {
        const phraseDbRef = firebase.database().ref(`/${phraseID}`);
        phraseDbRef.remove();
    }

    render() {
        return (
            <div className="main-container">
            <SavedAside phrasesList={this.state.phrasesList} deletePhrase={this.deletePhrase} unsaved={dbRef}/>
                <section className="translate-section">
                    <div className="translate-container">
                        <select name="langToTranslate" id="langToTranslate" onChange={this.handleChange}>
                            <option value=""> ⬇ language to translate    </option>
                            {/* dynamically populated from API*/}
                        </select>
                        <label htmlFor="langToTranslate" className="visually-hidden">Select the language to translate to</label>

                        <h2>Original</h2>
                        <form action="" className="translation-box">
                            <textarea type="text" name="originalText" id="originalText" placeholder="Text to translate..." maxLength='71' onChange={this.handleChange}/>
                            <label htmlFor="originalText" className="visually-hidden">Enter text to translate</label>

                            <input type="submit" value="Translate" className="translate-button button" onClick={this.handleSubmit} />

                        </form>
                    </div>

                    <div className="translate-container">
                        <h2>Translated</h2>
                        <form className="translation-box">
                            <textarea type="text" name="translatedText" id="translatedText" placeholder="Translated text..." value="" maxLength='71' onChange={this.handleChange}/>
                            <label htmlFor="translatedText" className="visually-hidden">Translated text appears here</label>

                            <input type="submit" value="Save" className="save-button button" onClick={this.handleSave}/>
                        </form>

                    </div>
                </section>
            </div>
        )
    }
}

export default Translate;