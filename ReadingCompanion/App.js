/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Dimensions, FlatList, Platform, StyleSheet, Text, View, Button, Alert} from 'react-native';

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#e8eaed',
  },
  container: {
    minHeight: Dimensions.get('window').height /3, 
    backgroundColor: '#ffffff',
    flex:0.5,
    margin: 5,
  },
  flatlistContainer: {
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 40,
},
  bookTitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000000',
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

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends React.Component {

  state = {
    FlatListItems: [{}],
  };

  componentDidMount() {
    var temp = [];
    var item = {
      bookTitle: "The Collected Tales of Nikolai Gogol", 
      author: "Nikolai Gogol", 
      date_started: "May 15, 2019",
      date_ended: "N/A"
    };
    var item2 = {
      bookTitle: "The Collected Tales of Gogol Bordello", 
      author: "Gogol Bordello", 
      date_started: "May 15, 2019",
      date_ended: "N/A"
    };
    temp.push(item);
    temp.push(item2);
    temp.push(item);
    temp.push(item2);
    temp.push(item);
    temp.push(item2);

    this.setState({
      FlatListItems: temp
    });
  }
  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 1, width: '100%', backgroundColor: '#ffffff' }} />
    );
  };
  _onPressButton()  {
    Alert.alert('You pressed the edit button!')
  }
  render() {
    return (
      <View style={styles.main}>
        <FlatList
          numColumns={2}
          contentContainerStyle={styles.flatlistContainer}
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View key={item.bookTitle} style={styles.container}>
              <Text style={styles.bookTitle}>{item.bookTitle}</Text>
              <Text style={styles.author}>by {item.author}</Text>
              <Text style={styles.dates}>Started: {item.date_started};  Finished: {item.date_ended}
              </Text>
              <Button
                style={styles.button}
                title="Edit"
                onPress={this._onPressButton}
              /> 
            </View>
            )}
        />
      </View>
    );
  }
}