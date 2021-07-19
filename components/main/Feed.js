import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    useWindowDimensions,
    Button,
} from "react-native";
import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

function FeedScreen(props) {
    const [posts, setPosts] = useState([]);

    const imageWidth = Math.floor(useWindowDimensions().width);

    useEffect(() => {
        let posts = [];

        if (props.usersLoaded === props.following.length) {
            for (let i = 0; i < props.following.length; i++) {
                const user = props.users.find(
                    (user) => user.uid === props.following[i]
                );
                if (user !== undefined) {
                    // console.log("USER?", user);
                    posts = [...posts, ...user.posts];
                }
            }
        }

        posts.sort((x, y) => {
            return x.creation - y.creation;
        });
        // console.log("Posts of friends", posts);
        setPosts(posts);
    }, [props.usersLoaded]);

    console.log("Props in FEED", props);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        containerInfo: {
            margin: 20,
        },
        containerGallery: {
            flex: 1,
        },
        containerImage: {
            flex: 1,
        },
        image: {
            width: imageWidth,
            height: imageWidth,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={1}
                    data={posts}
                    horizontal={false}
                    renderItem={({ item }) => (
                        <View style={styles.containerImage}>
                            <Text style={styles.container}>
                                {item.user.name}
                            </Text>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                            <Text
                                onPress={() =>
                                    props.navigation.navigate("Comments", {
                                        postId: item.id,
                                        uid: item.user.uid
                                    })
                                }
                            >
                                View comments...
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    users: store.usersState.users,
    usersLoaded: store.usersState.usersLoaded,
});

export default connect(mapStateToProps, null)(FeedScreen);
