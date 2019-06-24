import React from 'react';
import { TextInput, Dimensions, Image, StyleSheet, Text, View, Button } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import DatePicker from 'react-native-datepicker'

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#e8eaed',
        flex: 1.8,
    },
    container: {
        minHeight: Dimensions.get('window').height / 3,
        backgroundColor: '#ffffff',
        flex: 0.5,
        margin: 5,
    },
    touchable: {
        minHeight: Dimensions.get('window').height / 3,
        flex: 0.5,
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

var db = openDatabase({ name: 'BookDatabase.db' });

export default class App extends React.Component {

    static navigationOptions = {
        title: 'Edit Book',
        //Sets Header text of Status Bar
        headerStyle: {
          backgroundColor: '#92e8e5',
          //Sets Header color
        },
        headerTintColor: '#fff',
        //Sets Header text color
        headerTitleStyle: {
          fontWeight: 'bold',
          //Sets Header text style
        },
      };

    constructor(props) {
        super(props);
        date = new Date(parseInt(this.props.navigation.getParam('date_started'))); 
        displayMonth = date.getMonth() + 1 //JS month is 0-11
        this.state = {
            book_id: this.props.navigation.getParam('book_id'),
            book_title: this.props.navigation.getParam('book_title'),
            book_author: this.props.navigation.getParam('book_author'),
            book_image_url: this.props.navigation.getParam('book_image_url'),
            date_started: this.props.navigation.getParam('date_started'),
            display_date_started: date.getFullYear() + "-" + displayMonth + "-" + date.getDate(),
            date_ended: this.props.navigation.getParam('date_ended'),
        }
    }

    render() {
              
        return (<View>
            <Image source={{ uri: this.state.book_image_url }}
                style={{ width: 65, height: 100 }} />
            <TextInput
                style={styles.bookTitle}
                onChangeText={book_title => this.setState({ book_title })}
                defaultValue={this.state.book_title}
            />
            <TextInput
                style={styles.author}
                onChangeText={(book_author) => this.setState({ book_author })}
                defaultValue={this.state.book_author}
            />
            <DatePicker
                style={{ width: 200 }}
                date={this.state.display_date_started}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="1970-01-01"
                maxDate="2170-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                    dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0
                    },
                    dateInput: {
                        marginLeft: 36
                    }
                }}
                onDateChange={(display_date_started) => {this.setState({display_date_started: display_date_started})}}
            />
            <TextInput
                style={styles.dates}
                onChangeText={(date_ended) => this.setState({ date_ended })}
                defaultValue={this.state.date_ended}
            />
            <Button
                style={styles.addButton}
                title="save new"
                onPress={() => this.updateBook()}
            />
            <Text>
                Delete id: {this.state.book_id}?
            </Text>
            <Button
                style={styles.addButton}
                title="delete"
                onPress={() => this.onPressDeleteButton()}
            />
        </View>
        );
    }

    onPressDeleteButton() {
        db.transaction(tx => {
            tx.executeSql(
                'DELETE FROM  table_books where book_id=?',
                [this.state.book_id],
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
        this.props.navigation.goBack();
    }

    updateBook() {
        year = parseInt(this.state.display_date_started.substring(0, 4)) 
        month = parseInt(this.state.display_date_started.substring(5, 7)) - 1 //js month is 0-11
        day = parseInt(this.state.display_date_started.substring(8, 10))
        date = new Date(year, month, day, 12, 0, 0, 0)
        console.log("date parsed from date picker: " + year + "-" + month + "-" + day);
        console.log("getTime from date picker Javascript date object: " + date.getTime())
        test = new Date(date.getTime());
        console.log(test.toString());
        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE table_books set book_title=?, book_author=?, book_image_url=?, date_started=?, date_ended=?, read_category=? where book_id=?',
                [this.state.book_title, this.state.book_author, this.state.book_image_url, date.getTime(), this.state.date_ended, this.state.read_category, this.state.book_id],
                (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert('Success');
                    } else {
                        alert('Updation Failed');
                    }
                }
            );
        });
        this.props.navigation.goBack();
    }

}