/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { TouchableHighlight, Dimensions, FlatList, Platform, StyleSheet, Text, View, Button, Alert} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#e8eaed',
    flex: 1.8,
  },
  container: {
    minHeight: Dimensions.get('window').height /3, 
    backgroundColor: '#ffffff',
    flex:0.5,
    margin: 5,
  },
  touchable: {
    minHeight: Dimensions.get('window').height /3, 
    flex:0.5,
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
    margin: 10,
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
  addButton: {
    flex: 0.1,
    textAlign: 'center',
  },
});

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

var db = openDatabase({ name: 'BookDatabase.db' });
var self;

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
    };
  }

  componentDidMount() {
    self = this;
    console.log("component did mount")
    console.log(self)

    db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_books'",
        [],
        function(tx, res) {
          console.log('item:', res.rows.length);
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS table_books', []);
            txn.executeSql(
              'CREATE TABLE IF NOT EXISTS table_books(book_id INTEGER PRIMARY KEY AUTOINCREMENT, book_title VARCHAR(20), book_author VARCHAR(20), date_started VARCHAR(20), date_ended VARCHAR(20), read_category INT(10))',
              []
            );
            tx.executeSql(
              'INSERT INTO table_books (book_title, book_author, date_started, date_ended, read_category) VALUES (?,?,?,?,?)',
              ["The Collected Tales of Nikolai Gogol", "Nikolai Gogol", "May 15, 2019", "N/A", "1"],
              (tx, results) => {
                console.log('Results', results.rowsAffected);
              }
            );
          }
        }
      );
      
    });

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM table_books ORDER BY book_id ASC', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          FlatListItems: temp,
        });
      });
    });
  }

  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 1, width: '100%', backgroundColor: '#ffffff' }} />
    );
  };
  _onPressButton(id)  {
    Alert.alert('You pressed book with id: ' + id)
  }
  _onPressAddButton() {
    db.transaction(function(tx) {
      tx.executeSql( //insert new item
        'INSERT INTO table_books (book_title, book_author, date_started, date_ended, read_category) VALUES (?,?,?,?,?)',
        ["The Collected Tales of Gogol Bordello", "Gogol Bordello", "May 15, 2019", "N/A", "1"],
        function(tx, result) {
          console.log('Results', result.rowsAffected);
          console.log("this actually works too...")
          tx.executeSql(//reload items
            'SELECT * FROM table_books ORDER BY book_id ASC', 
            [], 
            function(tx, results) {
              var temp = [];
              for (let i = 0; i < results.rows.length; ++i) {
                temp.push(results.rows.item(i));
              }
              self.setState({
                FlatListItems: temp,
              });
            });
        }
      );
    });
  }

  render() {
    self = this;
    return (
      <View style={styles.main}>
        <FlatList
          numColumns={2}
          contentContainerStyle={styles.flatlistContainer}
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            
            <View key={item.book_id} style={styles.container}>
            <TouchableHighlight  style={styles.touchable} onPress={() => this._onPressButton(item.book_id)} activeOpacity={0.75} underlayColor={"#c6fffd"}>
            <View>
              <Text style={styles.bookTitle}>{item.book_title}</Text>
              <Text style={styles.author}>by {item.book_author}</Text>
              <Text style={styles.dates}>Started: {item.date_started};  Finished: {item.date_ended}
              </Text>
              </View>
              </TouchableHighlight>
            </View>
            )}
        />
        <Button
                style={styles.addButton}
                title="new"
                onPress={this._onPressAddButton}
              /> 
      </View>
    );
  }
}