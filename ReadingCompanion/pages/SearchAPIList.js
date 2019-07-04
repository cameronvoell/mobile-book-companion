import React from 'react';
import { Keyboard, FlatList, Alert, TextInput, Image, StyleSheet, Text, View, Button } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage';

const styles = StyleSheet.create({
    main: {
        backgroundColor: '#e8eaed',
        flex: 1.8,
    },
    searchInput: {
        fontSize: 17,
        color: '#000000',
        margin: 10,
    },
    searchButton: {
        margin: 10,
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
    container: {
        backgroundColor: '#ffffff',
        margin: 5,
    },
});

var self;
var db = openDatabase({ name: 'BookDatabase.db' });
const placeholderImage = "https://donrheem.com/wp-content/uploads/2016/11/Book-Placeholder.png"


export default class SearchAPIList extends React.Component {

    static navigationOptions = {
        title: 'Search Results',
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
        self = this;
        this.state = {
            searchString: '...title, author, etc',
            FlatListItems: {}
        }
    }

    onSearchPress() {
        self.fetchBooksFromApiAsync(self.state.searchString)
        Keyboard.dismiss()
    }

    addItem(item) {
        db.transaction(function (txn) {
            let now = new Date()
            txn.executeSql(
                'INSERT INTO table_books (book_title, book_author, book_image_url, date_started_millis, date_ended_millis, read_category) VALUES (?,?,?,?,?,?)',
                [item.volumeInfo.title, item.volumeInfo.authors, item.volumeInfo.imageLinks.smallThumbnail, now.getTime(), now.getTime(), "1"],
                (tx, results) => {
                    console.log('Results', results.rowsAffected);
                }
            );
        });
        Alert.alert("Add " + item.volumeInfo.title)
    }

    fetchBooksFromApiAsync(searchString) {
        fetch('https://www.googleapis.com/books/v1/volumes?q=' + searchString)
          .then((response) => response.json())
          .then((responseJson) => {
            self.setState({FlatListItems: responseJson.items})
          })
            .catch((error) => {
                console.error(error);
            });
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    render() {
        return (
            <View>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder={this.state.searchString}
                            selectTextOnFocus={true}
                            defaultValue={this.state.searchString}
                            onChangeText={searchString => this.setState({ searchString })}
                        />
                    </View>
                    <View style={{ flex: 1, margin: 10 }}>
                        <Button
                            style={styles.searchButton}
                            title={"search"}
                            onPress={this.onSearchPress}
                        />
                    </View>
                </View>
                <FlatList
                    ItemSeparatorComponent={this.renderSeparator}
                    data={this.state.FlatListItems}
                    keyExtractor={(item, id) => id.toString()}
                    renderItem={({ item }) => {
                        image = placeholderImage;
                        if (item && item.volumeInfo && item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.smallThumbnail) {
                            image = item.volumeInfo.imageLinks.smallThumbnail
                        }
                        return (
                            <View key={item.id} style={styles.container}>
                                    <View>
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ flex: 30 }}>
                                                <Image source={{ uri: image }}
                                                    style={{ width: 65, height: 100 }} />
                                            </View>
                                            <View style={{ flex: 60 }}>
                                                <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
                                                <Text style={styles.author}>by {item.volumeInfo.authors}</Text>
                                            </View>
                                            <View style={{ flex: 10 }}>
                                            <Button
                                            title={"+"}
                                            onPress={() => this.addItem(item)}
                                            />        
                                            </View>                                        
                                        </View>
                                        

                                    </View>
                            </View>
                        )
                    }
                    }
                />
            </View>
        );
    }

}