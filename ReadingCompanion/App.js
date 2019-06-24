import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import MyBooks from './pages/MyBooks';
import ViewEditBook from './pages/ViewEditBook';
const App = createStackNavigator({
  MyBooks: { screen: MyBooks },
  ViewEditBook: { screen: ViewEditBook },
},
  {
    initialRouteName: 'MyBooks',
  }
);
//For React Navigation Version 3+
export default createAppContainer(App);