import React from 'react';
import { FlatList, Dimensions, Alert, TextInput, Image, StyleSheet, Text, View, Button } from 'react-native';

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
        minHeight: Dimensions.get('window').height / 8,
        backgroundColor: '#ffffff',
        flex: 0.5,
        margin: 5,
    },
});

var self;

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
                    data={this.state.FlatListItems}
                    keyExtractor={(item, id) => id.toString()}
                    renderItem={({ item }) => {
                        return (
                            <View key={item.id} style={styles.container}>
                                    <View>
                                        <View style={{ flexDirection: "row" }}>
                                            <View style={{ flex: 35 }}>
                                                <Image source={{ uri: item.volumeInfo.imageLinks.smallThumbnail }}
                                                    style={{ width: 65, height: 100 }} />
                                            </View>
                                            <View style={{ flex: 65 }}>
                                                <Text style={styles.bookTitle}>{item.volumeInfo.title}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.author}>by {item.volumeInfo.authors}</Text>

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