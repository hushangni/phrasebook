import React, { Component } from 'react';
import firebase from '../firebase';
import swal from 'sweetalert';


class SavedAside extends Component {
    constructor(props) {
        super(props);
        this.state = {
            savedBooks: [],
            currentPhrasesToSave: [],
            currentBookTitle: '',
            bookRef: '',
            userExists: false
        }
    }

    handleSave = (e) => {
        e.preventDefault();
        this.setState( {
            currentPhrasesToSave: this.props.phrasesList
        }, () => {

            if (this.state.currentBookTitle.replace(/\s/g, '') === '') {
                swal("Hold on!", "Please enter a title for your book 📖 ", "info");
            } else if (this.props.phrasesList.length == 0) {
                swal("Hold on!", "Please translate and save some phrases for your book 💬 ", "info");
            } else {
                this.addBookToDatabase();
            }
        })

    }

    addBookToDatabase = () => {
        if (this.state.currentBookTitle) {
            const bookRef = firebase.database().ref(`/${this.props.userID}/bookList/${this.state.currentBookTitle}`);

            // console.log(bookRef);

            bookRef.push({
                bookName: this.state.currentBookTitle,
                phrases: this.state.currentPhrasesToSave
            });

            firebase.database().ref(`${this.props.userID}/unsaved`).remove();
            document.getElementById('bookTitle').value = '';
        }
    }

    handleChange = (e) => {
        e.preventDefault();
        const bookTitle = e.target.value;
        this.setState({
            currentBookTitle: bookTitle
        });
    }


    render() {
        return(
            <aside className="saved-aside" onChange={this.handleChange}>
                <h2 className="phrasebook-title">Phrasebook</h2>
                <form action="">
                    <input type="text" name="bookTitle" id="bookTitle" placeholder="Book Title" onChange={this.handleChange} maxLength='22' required/>
                    {this.props.phrasesList.map((phrase) => {
                        return (
                            <div className="phrase" key={phrase.key}>
                                <p className="original-phrase">{phrase.original}</p>
                                <p className="translated-phrase">{phrase.translated}</p>
                                <button onClick={() => this.props.deletePhrase(phrase.key)} id={phrase.key} className="button delete-button">Delete</button>
                            </div>
                        )
                    })}

                    <input className="button save-phrase-book-button" onClick={this.handleSave} type="submit" value="Save Book"/>
                </form>
            </aside>
        )
    }
}

export default SavedAside;