import React, { Component } from 'react';
import firebase from '../firebase';

class YourBooks extends Component {
    constructor() {
        super();
        this.state = {
            userID: '',
            books: [],
            booksLeft: 0
        }
    }

    componentDidMount() {
        console.log("component did mount called in your books");

        firebase.auth().onAuthStateChanged((user) => {
            if(user !== null){
                console.log(`this fore update called`);
                this.setState({
                    books: [],
                    booksLeft: 0
                })
                const dbRef = firebase.database().ref(`/${user.uid}/bookList`);
                dbRef.on('value', (snapshot) => {
                    if (snapshot.val()) {
                        this.setBooks(snapshot.val());
                    }
                });
            }
            else {
                const dbRef = firebase.database().ref(`/guest/bookList`);
                dbRef.on('value', (snapshot) => {
                    if (snapshot.val()) {
                        this.setBooks(snapshot.val());
                    }
                });
            }
        });
    }

    setBooks = (booksObject) => {
        const booksArray = Object.entries(booksObject)
            .map((item) => {
                let phrases = '';
                for (let propName in item[1]) {
                    if (item[1].hasOwnProperty(propName)) {
                        phrases = item[1][propName].phrases;
                    }
                }
                return ({
                    bookName: item[0],
                    phrases: phrases
                })
            });
        console.log("this is books array length", booksArray.length);
        this.setState({
            books: booksArray,
            booksLeft: booksArray.length
        });

    }

    handleClick = (e) => {
        e.preventDefault();
    }

    deleteBook = (bookName) => {
        const phraseDbRef = firebase.database().ref(`/${this.props.userID}/bookList/${bookName}`);
        phraseDbRef.remove();
        if (this.state.booksLeft === 1) {
            this.setState({
                books: [],
                booksLeft: 0
            })
        }
    }

    render() {

        return (
            <aside className="your-books">
                <h2 className="phrasebook-title">Your Books</h2>
                <div className="your-book-list">
                {this.state.books.map((book) => {
                    return (
                        <div className="book-item" onClick={this.handleClick}>
                        <h3>{book.bookName}</h3>
                            <div className="phrase-list-modal">
                            {book.phrases.map((phrase) => {
                                return(
                                    <div className="phrase">
                                        <p className="original-text">{phrase.original}</p>
                                        <p className="translated-text">{phrase.translated}</p>
                                    </div>
                                )
                            })}
                            </div>
                        <div className="delete-book" onClick={() => this.deleteBook(book.bookName)}>x</div>
                        </div>
                    )
                })}
                </div>

            </aside>
        )
    }
}

export default YourBooks;