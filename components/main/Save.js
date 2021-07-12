import React, { useState } from "react";
import { View, Text, Image, TextInput, Button } from "react-native";

import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function SaveScreen(props) {
    const [caption, setCaption] = useState("");

    const uploadImage = async () => {
        const uri = props.route.params.image;

        const respond = await fetch(uri);
        const blob = await respond.blob();

        const task = firebase
            .storage()
            .ref()
            .child(
                `post/${
                    firebase.auth().currentUser.uid
                }/${Math.random().toString(36)}`
            )
            .put(blob);
    };

    return (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: props.route.params.image }} />
            <TextInput
                placeholder="Write a Caption..."
                onChangetext={(caption) => setCaption(caption)}
            />
            <Button title="Save" onPress={() => uploadImage()} />
        </View>
    );
}
