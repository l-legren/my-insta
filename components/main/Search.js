import React, { useState } from "react";
import { View, TextInput, FlatList, Text } from "react-native";

import firebase from "firebase";

require("firebase/firestore");

export default function SearchScreen() {
    const [users, setUsers] = useState([]);

    const fetchUsers = (search) => {
        firebase
            .firestore()
            .collection("users")
            .where("name", ">=", search)
            .get()
            .then((snapshot) => {
                console.log("inside fetchUsers", snapshot.docs);
                let users = snapshot.docs.map((doc) => {
                    let data = doc.data();
                    let id = doc.id;

                    return { id, ...data };
                });
                setUsers(users);
            });
    };

    // console.log("users in Search", users);

    return (
        <View>
            <TextInput
                placeholder="Search User..."
                onChangeText={(search) => {
                    console.log("Changing...")
                    fetchUsers(search)
                }}
            />
            <FlatList
                data={users}
                numColumns={1}
                horizontal={false}
                renderItem={({ item }) => <Text>{item.name}</Text>}
            />
        </View>
    );
}
