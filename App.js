import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import firebase from "firebase";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import RootReducer from "./redux/reducers";
import thunk from "redux-thunk";

import { API_KEY_FIREBASE, MEASUREMENT_ID, APP_ID, SENDER_ID } from "@env";

const firebaseConfig = {
    apiKey: API_KEY_FIREBASE,
    authDomain: "my-insta-demo.firebaseapp.com",
    projectId: "my-insta-demo",
    storageBucket: "my-insta-demo.appspot.com",
    messagingSenderId: SENDER_ID,
    appId: APP_ID,
    measurementId: MEASUREMENT_ID,
};

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import MainScreen from "./components/Main";

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

const store = createStore(RootReducer, applyMiddleware(thunk));

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (!user) {
                this.setState({
                    loggedIn: false,
                    loaded: true,
                });
            } else {
                this.setState({
                    loggedIn: true,
                    loaded: true,
                });
            }
        });
    }

    render() {
        const { loggedIn, loaded } = this.state;
        if (!loaded) {
            return (
                <View>
                    <Text>Loading</Text>
                </View>
            );
        }
        if (!loggedIn) {
            return (
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Landing">
                        <Stack.Screen
                            name="Landing"
                            options={{ headerShown: false }}
                            component={LandingScreen}
                        ></Stack.Screen>
                        <Stack.Screen
                            name="Register"
                            options={{ headerShown: true }}
                            component={RegisterScreen}
                        ></Stack.Screen>
                    </Stack.Navigator>
                </NavigationContainer>
            );
        }

        return (
            <Provider store={store}>
                <MainScreen />
            </Provider>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
