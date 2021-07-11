import React, { Component } from "react";
import { Text, View, Button, TextInput } from "react-native";

import firebase from "firebase";

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
        };

        this.onLogin = this.onLogin.bind(this);
    }

    onLogin() {
        const { email, password } = this.state;
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                console.log(result);
            })
            .catch((e) => {
                console.error(e);
            });
    }

    render() {
        return (
            <View>
                <TextInput
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />
                <Button onPress={() => this.onLogin()} title="Login" />
            </View>
        );
    }
}
