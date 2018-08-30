import React, { Component } from 'react';
import firebase from '../firebase';

const dbRef = firebase.database().ref();

const SavedAside = (props) =>  {

    return(
        <aside className="saved-aside">
            <h2>Phrasebook</h2>
            {props.phrasesList.map((phrase) => {
                return (
                    <div className="phrase" key={phrase.key}>
                        <p className="original-phrase">{phrase.original}</p>
                        <p className="translated-phrase">{phrase.translated}</p>
                        <button onClick={() => props.deletePhrase(phrase.key)} id={phrase.key}>Delete Phrase</button>
                    </div>
                )
            })}
        </aside>
    )
}

export default SavedAside;