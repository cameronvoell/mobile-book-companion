/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Picker, Image, TouchableHighlight, Dimensions, FlatList, StyleSheet, Text, View, Button, Alert } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';
import DialogManager, { ScaleAnimation, DialogContent } from 'react-native-dialog-component';

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

const placeholderImage = "https://donrheem.com/wp-content/uploads/2016/11/Book-Placeholder.png"
var db = openDatabase({ name: 'BookDatabase.db' });
var self;


export default class App extends React.Component {

    static navigationOptions = {
        title: 'My Books',
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
            sort_by: 'book_id',
            sort_order: 'ASC',
        };
    }

    componentDidMount() {
        self = this;
        self.initializeDatabase();
        self.refreshList();
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.refreshList()
        });
    }

    componentWillUnmount() {
        // Remove the event listener
        this.focusListener.remove();
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
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, margin: 5, backgroundColor: "#479aff" }}>
                        <Picker
                            selectedValue={self.state.sort_by}
                            style={{ height: 50, width: 200 }}
                            onValueChange={(itemValue, itemIndex) =>
                                self.onSortByChanged(itemValue)
                            }>
                            <Picker.Item label="Title" value="book_title" />
                            <Picker.Item label="Author" value="book_author" />
                            <Picker.Item label="Date Started" value="date_started" />
                            <Picker.Item label="Date Finished" value="date_ended" />
                            <Picker.Item label="Order Added" value="book_id" />
                        </Picker>
                    </View>
                    <View style={{ flex: 1, margin: 5, backgroundColor: "#479aff" }}>
                        <Picker
                            selectedValue={self.state.sort_order}
                            style={{ height: 50, width: 200 }}
                            onValueChange={(itemValue, itemIndex) =>
                                self.onSortOrderChanged(itemValue)
                            }>
                            <Picker.Item label="Ascending" value="ASC" />
                            <Picker.Item label="Descending" value="DESC" />
                        </Picker>
                    </View>
                </View>
                <FlatList
                    numColumns={2}
                    contentContainerStyle={styles.flatlistContainer}
                    data={this.state.FlatListItems}
                    ItemSeparatorComponent={this.ListViewItemSeparator}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        startDate = new Date(parseInt(item.date_started));
                        displayStartMonth = startDate.getMonth() + 1;
                        endDate = new Date(parseInt(item.date_ended));
                        displayEndMonth = endDate.getMonth() + 1;
                        return (
                            <View key={item.book_id} style={styles.container}>
                                <TouchableHighlight style={styles.touchable} onPress={() => this.onSelectBook(item)} activeOpacity={0.75} underlayColor={"#c6fffd"}>
                                    <View>
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ flex: 35 }}>
                                                <Image source={{ uri: item.book_image_url }}
                                                    style={{ width: 65, height: 100 }} />
                                            </View>
                                            <View style={{ flex: 65 }}>
                                                <Text style={styles.bookTitle}>{item.book_title}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.author}>by {item.book_author}</Text>
                                        <Text style={styles.dates}>Started: {displayStartMonth + "/" + startDate.getDate() + "/" + startDate.getFullYear()}</Text>
                                        <Text style={styles.dates}>Finished: {displayEndMonth + "/" + endDate.getDate() + "/" + endDate.getFullYear()}</Text>

                                    </View>
                                </TouchableHighlight>
                            </View>
                        )
                    }
                    }
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
    onSortByChanged(value) {
        if (value != undefined) {
            self.setState({
                sort_by: value,
            }, function afterStateUpdate() {
                self.refreshList()
            })
        }
    }

    onSortOrderChanged(value) {
        if (value != undefined) {
            self.setState({
                sort_order: value,
            }, function afterStateUpdate() {
                self.refreshList()
            })
        }
    }

    onSelectBook(book) {
        let startDate = new Date(parseInt(book.date_started))
        let endDate = new Date(parseInt(book.date_ended))

        self.setState({
            book_id: book.book_id,
            book_title: book.book_title,
            book_author: book.book_author,
            book_image_url: book.book_image_url,
            date_started: book.date_started,
            display_date_started: startDate.getMonth() + "-" + startDate.getDate() + "-" + startDate.getFullYear(),
            date_ended: book.date_ended,
            display_date_ended: endDate.getMonth() + "-" + endDate.getDate() + "-" + endDate.getFullYear(),
        }, function afterStateUpdate() {
            self.showViewEditBook(book)
        });
    }

    onPressAddButton() {
        self.props.navigation.navigate('SearchAPIList')
    }

    /*
     * Database Methods
     */

    //Initialize Database
    initializeDatabase() {
        db.transaction(function (txn) {
            txn.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='table_books'",
                [],
                function (tx, res) {
                    console.log('item:', res.rows.length);
                    if (res.rows.length == 0) {
                        txn.executeSql('DROP TABLE IF EXISTS table_books', []);
                        txn.executeSql(
                            'CREATE TABLE IF NOT EXISTS table_books(book_id INTEGER PRIMARY KEY AUTOINCREMENT, book_title TEXT, book_author TEXT, book_image_url TEXT, date_started TEXT, date_ended TEXT, read_category INT(10))',
                            []
                        );
                        let now = new Date()
                        tx.executeSql(
                            'INSERT INTO table_books (book_title, book_author, book_image_url, date_started, date_ended, read_category) VALUES (?,?,?,?,?,?)',
                            ["Edit Title", "Edit Author", placeholderImage, now.getTime(), now.getTime(), "1"],
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
            tx.executeSql('SELECT * FROM table_books ORDER BY '+ self.state.sort_by + ' ' + self.state.sort_order, [], (tx, results) => {
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

    showViewEditBook(book) {
        self.props.navigation.navigate('ViewEditBook', {
            book_id: book.book_id,
            book_title: book.book_title,
            book_author: book.book_author,
            book_image_url: book.book_image_url,
            date_started: book.date_started,
            date_ended: book.date_ended,
        })
    }
}