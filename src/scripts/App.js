import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';

// components
import Landing from './components/Landing';
import Translate from './components/Translate';

const dbRef = firebase.database();

// urls/keys for Yandex API
const translateURL = "https://translate.yandex.net/api/v1.5/tr.json/translate";
const languagesURL = 'https://translate.yandex.net/api/v1.5/tr.json/getLangs';
const detectURL = 'https://translate.yandex.net/api/v1.5/tr.json/detect';
const apiKey = "trnsl.1.1.20180828T150321Z.763350fbc08abff9.2cddae20856c6abb37452b3c5e6fc8c12805a059";


class App extends Component {
  // constructor() {
  //   super();
  //   this.state = {
  //     langs: {},
  //     langToTranslate: "",
  //     textToTranslate: ""
  //   }
  // }

  // componentDidMount() {
  //   console.log('component did mount called');
  //   axios.get(languagesURL, {
  //     params: {
  //       key: apiKey,
  //       ui: 'en'
  //     }
  //   }).then((res) => {
  //     console.log(res.data.langs);
  //     this.setState({
  //       langs: res.data.langs
  //     });
  //   });
  // }

  render() {
    return (
      <div className="App">
        <Landing />
        <Translate />


      </div>
    );
  }
}

export default App;
