import React from 'react';
import { TextInput, Image, StyleSheet, Text, View, Button } from 'react-native';

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
    }
});


export default class SearchAPIList extends React.Component {

    static navigationOptions = {
        title: 'Search Resultss',
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
            searchString: '...title, author, etc',
        }
    }

    onSearchPress() {

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
            </View>
        );
    }

}