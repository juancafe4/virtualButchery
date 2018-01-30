/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  Button,
  View,
  Image
} from 'react-native';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase'
const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      uri: 'https://facebook.github.io/react-native/docs/assets/favicon.png'
    }
    console.log('firebase auth');

    // this.login = this.login.bind(this);
    firebase.database().ref('/meat').on('value', snapshot => {
      snapshot.forEach(data => {
        console.log(data.key);
        console.log(data.val());
      })
    }, err => {
      console.log(err);
    });
    // firebase.database().ref('/meat').push({price: 54, name: 'Cuadril'}, onCompleted =>{
    //   console.log(onCompleted);
    // })
    // 
    this.login = this.login.bind(this);
  }
  login() {
      console.log('Loggin in');
      return LoginManager
    .logInWithReadPermissions(['public_profile', 'email'])
    .then((result) => {
      if (!result.isCancelled) {
        console.log(`Login success with permissions: ${result.grantedPermissions.toString()}`)
        // get the access token
        return AccessToken.getCurrentAccessToken()
      }
    })
    .then(data => {
      if (data) {
        // create a new firebase credential with the token
        const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken)
        // login with credential
        return firebase.auth().signInWithCredential(credential)
      }
    })
    .then((currentUser) => {
      if (currentUser) {
        alert(currentUser.toJSON());
        const { photoURL } = currentUser.toJSON();
        console.log(photoURL);
        this.setState({uri: photoURL });
      }
    })
    .catch((error) => {
      console.log(`Login fail with error: ${error}`)
    })
  }
  render() {
    return (
      <View style={styles.container}>
          <Button onPress={this.login} title="Log in" />
        <Image
          style={{width: 150, height: 150}}
          source={{uri: this.state.uri}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
