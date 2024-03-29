// Thir party imports
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import firebase from "firebase";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import RootReducer from "./redux/reducers";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

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

// Screens
import LandingScreen from "./components/auth/Landing";
import RegisterScreen from "./components/auth/Register";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import AddScreen from "./components/main/Add";
import SaveScreen from "./components/main/Save";
import CommentsScreen from "./components/main/Comments";

if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

const store = createStore(
    RootReducer,
    composeWithDevTools(applyMiddleware(thunk))
);

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
        };
    }

    componentDidMount() {

        console.log(API_KEY_FIREBASE)

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
                        <Stack.Screen
                            name="Login"
                            options={{ headerShown: true }}
                            component={LoginScreen}
                        ></Stack.Screen>
                    </Stack.Navigator>
                </NavigationContainer>
            );
        }

        return (
            <Provider store={store}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Main">
                        <Stack.Screen
                            name="Main"
                            component={MainScreen}
                            // options={{ headerShown: false }}
                        ></Stack.Screen>
                        <Stack.Screen
                            name="Add"
                            component={AddScreen}
                            navigation={this.props.navigation}
                        ></Stack.Screen>
                        <Stack.Screen
                            name="Save"
                            component={SaveScreen}
                            navigation={this.props.navigation}
                        ></Stack.Screen>
                        <Stack.Screen
                            name="Comments"
                            component={CommentsScreen}
                            navigation={this.props.navigation}
                        ></Stack.Screen>
                    </Stack.Navigator>
                </NavigationContainer>
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
