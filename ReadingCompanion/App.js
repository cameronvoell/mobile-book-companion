/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  _onPressButton() {
    Alert.alert('You pressed the edit button!')
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.bookTitle}>The Collected Tales of Nikolai Gogol</Text>
        <Text style={styles.author}>by Nikolai Gogol</Text>
        <Text style={styles.dates}>Started: May 15, 2019; Finished: N/A</Text>
        <Button
          style={styles.button}
          title="Edit"
          onPress={this._onPressButton}
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
  bookTitle: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },
  author: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
  },
  dates: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 10,
  },
  button: {
    textAlign: 'center',
    width: 20,
  },
});
