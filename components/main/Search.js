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
                let users = snapshot.docs.map((user) => {
                    let data = user.data();
                    let id = user.id;

                    return { id, ...data };
                });
                // console.log(snapshot);
                setUsers(users);
            });
    };

    return (
        <View>
            <TextInput onTextChange={(input) => fetchUsers(input)} />
            <FlatList
                data={users}
                numColumns={1}
                horizontal={false}
                renderItem={({ item }) => (
                    <View>
                        <Text>{item.name}</Text>
                    </View>
                )}
            />
        </View>
    );
}
