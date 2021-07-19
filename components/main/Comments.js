import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Button } from "react-native";

import firebase from "firebase";
import "firebase/firestore";

const CommentsScreen = (props) => {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {
        console.log("This is postId", props.route.params.postId);
        if (props.route.params.postId !== postId) {
            firebase
                .firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .doc(props.route.params.postId)
                .collection("comments")
                .get()
                .then((snapshot) => {
                    let comments = snapshot.doc.map((el) => {
                        const data = el.data();
                        const id = el.id;

                        return {
                            ...data,
                            id,
                        };
                    });
                    setComments(comments);
                });
            setPostId(props.route.params.postId);
        }
    }, [props.route.params.postId]);

    return (
        <View>
            <FlatList
                data={comments}
                horizontal={false}
                numColumns={1}
                renderItem={({ item }) => {
                    <View>
                        <Text>{item.text}</Text>
                    </View>;
                }}
            />
            <Text>This is comments</Text>
        </View>
    );
};

export default CommentsScreen;
