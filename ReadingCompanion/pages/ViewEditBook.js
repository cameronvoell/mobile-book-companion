import React from 'react';
import { Alert, TextInput, Dimensions, Image, StyleSheet, Text, View, Button } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import DatePicker from 'react-native-datepicker'
import { MillisToDisplayDate, DisplayDateToMillis } from '../util/DateUtil';

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
    editBookTitle: {
        fontSize: 17,
        color: '#000000',
        margin: 10,
    },
    author: {
        fontSize: 16,
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
        this.state = {
            book_id: this.props.navigation.getParam('book_id'),
            book_title: this.props.navigation.getParam('book_title'),
            book_author: this.props.navigation.getParam('book_author'),
            book_image_url: this.props.navigation.getParam('book_image_url'),
            date_started_millis: this.props.navigation.getParam('date_started_millis'),
            date_ended_millis: this.props.navigation.getParam('date_ended_millis'),
            date_started_display: MillisToDisplayDate(this.props.navigation.getParam('date_started_millis')),
            date_ended_display: MillisToDisplayDate(this.props.navigation.getParam('date_ended_millis')),
        }
    }

    render() {

        return (<View>
            <Image source={{ uri: this.state.book_image_url }}
                style={{ width: 65, height: 100 }} />
            <TextInput
                style={styles.editBookTitle}
                onChangeText={book_title => this.setState({ book_title })}
                defaultValue={this.state.book_title}
                selectTextOnFocus={true}
            />
            <TextInput
                style={styles.author}
                onChangeText={(book_author) => this.setState({ book_author })}
                defaultValue={this.state.book_author}
                selectTextOnFocus={true}
            />
            <DatePicker
                style={{ width: 200 }}
                date={this.state.date_started_display}
                mode="date"
                placeholder="select date"
                format="MM-DD-YYYY"
                minDate="01-01-1970"
                maxDate="01-01-2170"
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
                onDateChange={(date_started_display) => { this.setState({ date_started_display: date_started_display }) }}
            />
            <DatePicker
                style={{ width: 200 }}
                date={this.state.date_ended_display}
                mode="date"
                placeholder="select date"
                format="MM-DD-YYYY"
                minDate="01-01-1970"
                maxDate="01-01-2170"
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
                onDateChange={(date_ended_display) => { this.setState({ date_ended_display: date_ended_display }) }}
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
        startDateMillis = DisplayDateToMillis(this.state.date_started_display)
        endDateMillis = DisplayDateToMillis(this.state.date_ended_display)

        console.log("start date: " + startDateMillis)
        console.log("end date: " + endDateMillis)

        db.transaction((tx) => {
            tx.executeSql(
                'UPDATE table_books set book_title=?, book_author=?, book_image_url=?, date_started_millis=?, date_ended_millis=?, read_category=? where book_id=?',
                [this.state.book_title, this.state.book_author, this.state.book_image_url, startDateMillis, endDateMillis, this.state.read_category, this.state.book_id],
                (tx, results) => {
                    console.log('Results', results.rowsAffected);
                    if (results.rowsAffected > 0) {
                        Alert.alert('Updated');
                        console.log("success");
                    } else {
                        alert('Updation Failed');
                        console.log("failure");
                    }
                }
            );
        });
        this.props.navigation.goBack();
    }
}