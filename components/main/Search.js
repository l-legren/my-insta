import React, { useState } from "react";
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
} from "react-native";

import firebase from "firebase";

require("firebase/firestore");

export default function SearchScreen(props) {
    const [users, setUsers] = useState([]);

    const fetchUsers = (search) => {
        firebase
            .firestore()
            .collection("users")
            .where("name", ">=", search)
            .get()
            .then((snapshot) => {
                // console.log("inside fetchUsers", snapshot.docs);
                const users = snapshot.docs.map((doc) => {
                    const data = doc.data();
                    const id = doc.id;

                    return { id, ...data };
                });
                setUsers(users);
            });
    };

    console.log("users in Search", users);

    return (
        <View>
            <TextInput
                placeholder="Search User..."
                onChangeText={(search) => {
                    fetchUsers(search);
                }}
            />
            <FlatList
                data={users}
                numColumns={1}
                horizontal={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() =>
                            props.navigation.navigate("Profile", {
                                uid: item.id,
                            })
                        }
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
