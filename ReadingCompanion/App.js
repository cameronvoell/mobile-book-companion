/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Image, TextInput, TouchableHighlight, Dimensions, FlatList, StyleSheet, Text, View, Button, Alert} from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import DialogManager, { ScaleAnimation, DialogContent } from 'react-native-dialog-component';

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
    fontSize: 17,
    color: '#000000',
  },
  author: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333333',
    margin: 10,
  },
  dates: {
    textAlign: 'left',
    color: '#333333',
    marginLeft: 10,
  },
  addButton: {
    flex: 0.1,
    textAlign: 'center',
  },
  sortFilter: {
    textAlign: 'center',
    margin: 10,
  },
});

const placeholderImage = "https://donrheem.com/wp-content/uploads/2016/11/Book-Placeholder.png"
var db = openDatabase({ name: 'BookDatabase.db' });
var self;

export default class App extends React.Component {

/*
 * Component Methods
 */
  constructor(props) {
    super(props);
    this.state = {
      FlatListItems: [],
      book_title: '',
      book_author: '',
      book_image_url: '',
      date_started: '',
      date_ended: '',
    };
  }

  componentDidMount() {
    self = this;
    self.initializeDatabase();
    self.refreshList();
  }

  ListViewItemSeparator = () => {
    return (
      <View style={{ height: 1, width: '100%', backgroundColor: '#ffffff' }} />
    );
  };

  render() {
    self = this;
    return (
      <View style={styles.main}>
      <View style={{flexDirection:"row"}}>
                    <View style={{flex:1, margin:10}}>
                    <Button
                style={styles.sortFilter}
                title="sort by"
                onPress={this.onPressAddButton}
              /> 
                    </View>
                    <View style={{flex:1, margin:10}}>
                    <Button
                style={styles.sortFilter}
                title="filter"
                onPress={this.onPressAddButton}
              /> 
                    </View>
            </View>
        <FlatList
          numColumns={2}
          contentContainerStyle={styles.flatlistContainer}
          data={this.state.FlatListItems}
          ItemSeparatorComponent={this.ListViewItemSeparator}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            
            <View key={item.book_id} style={styles.container}>
            <TouchableHighlight  style={styles.touchable} onPress={() => this.onPressButton(item)} activeOpacity={0.75} underlayColor={"#c6fffd"}>
            <View>
            <View style={{flexDirection:"row"}}>
                    <View style={{flex:35}}>
                    <Image source={{uri: item.book_image_url}}
                      style={{width: 65, height: 100}} />
                    </View>
                    <View style={{flex:65}}>
                    <Text style={styles.bookTitle}>{item.book_title}</Text>
                    </View>
            </View>
            
              
              <Text style={styles.author}>by {item.book_author}</Text>
              <Text style={styles.dates}>Started: {item.date_started}</Text>
              <Text style={styles.dates}>Finished: {item.date_ended}</Text>
              
              </View>
              </TouchableHighlight>
            </View>
            )}
        />
        <Button
                style={styles.addButton}
                title="new"
                onPress={this.onPressAddButton}
              /> 
      </View>
    );
  }

/*
 * Onclick Handler Methods
 */
onPressButton(item)  {
  self.setState({
    book_title: item.book_title,
    book_author: item.book_author,
    book_image_url: item.book_image_url,
    date_started: item.date_started,
    date_ended: item.date_ended,
  }, function afterStateUpdate () {
    self.showPopup(item);
  });
}

onPressDeleteButton(id) {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM  table_books where book_id=?',
      [id],
      (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          //Alert.alert('Success');
        } else {
          alert('Please insert a valid User Id');
        }
      }
    );
  });
  DialogManager.dismiss(() => {
    console.log('callback - dismiss');
  });
  self.refreshList();
}

onPressAddButton() {
  db.transaction(function(tx) {
    tx.executeSql( //insert new item
      'INSERT INTO table_books (book_title, book_author, book_image_url, date_started, date_ended, read_category) VALUES (?,?,?,?,?,?)',
      ["The Collected Tales of Nikolai Gogol", "Nikolai Gogol", placeholderImage, "May 15, 2019", "N/A", "1"],
      function(tx, result) {
        self.refreshList();
      }
    );
  });
}

/*
 * Database Methods
 */

 //Initialize Database
 initializeDatabase() {
  db.transaction(function(txn) {
    txn.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='table_books'",
      [],
      function(tx, res) {
        console.log('item:', res.rows.length);
        if (res.rows.length == 0) {
          txn.executeSql('DROP TABLE IF EXISTS table_books', []);
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS table_books(book_id INTEGER PRIMARY KEY AUTOINCREMENT, book_title TEXT, book_author TEXT, book_image_url TEXT, date_started TEXT, date_ended TEXT, read_category INT(10))',
            []
          );
          tx.executeSql(
            'INSERT INTO table_books (book_title, book_author, book_image_url, date_started, date_ended, read_category) VALUES (?,?,?,?,?,?)',
            ["The Collected Tales of Nikolai Gogol", "Nikolai Gogol", placeholderImage, "May 15, 2019", "N/A", "1"],
            (tx, results) => {
              console.log('Results', results.rowsAffected);
            }
          );
        }
      }
    );
  });
}

refreshList() {
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

  
  showPopup(item) {
    DialogManager.show({
      title: 'Edit',
      titleAlign: 'center',
      animationDuration: 200,
      ScaleAnimation: new ScaleAnimation(),
      children: (
        <DialogContent>
          <View>
            <Image source={{uri: item.book_image_url}}
                      style={{width: 65, height: 100}} />
            <TextInput
              style={styles.bookTitle}
              onChangeText={book_title => self.setState({ book_title })} 
              defaultValue = {self.state.book_title}
            />
            <TextInput
              style={styles.author}
              onChangeText={(book_author) => self.setState({ book_author })}
              defaultValue={self.state.book_author}
            />
            <TextInput
              style={styles.dates}
              onChangeText={(date_started) => self.setState({ date_started })}
              defaultValue={self.state.date_started}
            />
            <TextInput
              style={styles.dates}
              onChangeText={(date_ended) => self.setState({ date_ended })}
              defaultValue={self.state.date_ended}
            />
            <Button
                style={styles.addButton}
                title="save new"
                onPress={() => self.updateItem(item)}
              />
            <Text>
              Delete id: {item.book_id}?
            </Text>
            <Button
                style={styles.addButton}
                title="delete"
                onPress={() => self.onPressDeleteButton(item.book_id)}
              /> 
          </View>
        </DialogContent>
      ),
    }, () => {
      console.log('callback - show');
    });
  }

  updateItem(oldItem) {
    db.transaction((tx)=> {
      tx.executeSql(
        'UPDATE table_books set book_title=?, book_author=?, book_image_url=?, date_started=?, date_ended=?, read_category=? where book_id=?',
        [self.state.book_title, self.state.book_author, oldItem.book_image_url, self.state.date_started, self.state.date_ended, oldItem.read_category, oldItem.book_id],
        (tx, results) => {
          console.log('Results',results.rowsAffected);
          if(results.rowsAffected>0){
            Alert.alert( 'Success');
          }else{
            alert('Updation Failed');
          }
        }
      );
    });
    self.refreshList();
    DialogManager.dismiss(() => {
      console.log('callback - dismiss');
    });
  }
}