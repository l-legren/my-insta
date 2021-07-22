import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Button } from "react-native";

import firebase from "firebase";
import "firebase/firestore";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions";

const CommentsScreen = (props) => {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [text, setText] = useState("");

    useEffect(() => {

        console.log("PROPS COMMENTS", props)

        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {
                const user = props.users.find(x => x.uid === comments[i].creator)
                if (!user) {
                    fetchUsersData(comments[i].creator, false)
                }
            }
        }

        // console.log("This is postId", props.route.params.postId);
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
                    let comments = snapshot.docs.map((el) => {
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

    const onCommentSend = () => {
        firebase
            .firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .doc(postId)
            .collection("comments")
            .add({
                creator: firebase.auth().currentUser.uid,
                text,
            });
    };

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
            <Text>This is comments...delete....</Text>
            <View>
                <TextInput
                    placeholder="Comment..."
                    onChangeText={(commentText) => setText(commentText)}
                />
                <Button title="Send" onPress={() => onCommentSend()} />
            </View>
        </View>
    );
};

const mapStateToProps = (store) => ({
    users: store.usersState.users,
});

const mapDispatchProps = (dispatch) =>
    bindActionCreators(
        { fetchUsersData},
        dispatch
    );

export default connect(mapStateToProps, mapDispatchProps)(CommentsScreen);