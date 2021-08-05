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

function ProfileScreen(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false);

    const imageWidth = Math.floor(useWindowDimensions().width / 3);

    useEffect(() => {
        const { currentUser, posts } = props;

        // console.log("Props in profile", props)

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
            setUserPosts(posts);
        } else {
            firebase
                .firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                    } else {
                        console.log("Snapshot doesnt exist");
                    }
                });

            firebase
                .firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let thirdUserPosts = snapshot.docs.map((doc) => {
                        const data = doc.data();
                        const id = doc.id;

                        return {
                            id,
                            ...data,
                        };
                    });
                    console.log("third user posts", thirdUserPosts);
                    setUserPosts(thirdUserPosts);
                });
        }

        if (props.following.includes(props.route.params.uid)) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }
    }, [props.route.params.uid, props.following]);

    const onFollow = () => {
        firebase
            .firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({});
    };

    const onUnfollow = () => {
        firebase
            .firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete();
    };

    const onLogOut = () => {
        firebase.auth().signOut();
    };

    if (user === null) {
        return <View />;
    }

    console.log("Props in Profile", props);

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
            flex: 1 / 3,
        },
        image: {
            width: imageWidth,
            height: imageWidth,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
                {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View>
                        {following ? (
                            <Button
                                type="button"
                                title="Following"
                                onPress={() => onUnfollow()}
                            />
                        ) : (
                            <Button
                                type="button"
                                title="Follow"
                                onPress={() => onFollow()}
                            />
                        )}
                    </View>
                ) : (
                    <Button
                        type="button"
                        title="Log Out"
                        onPress={() => onLogOut()}
                    />
                )}
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    data={userPosts}
                    horizontal={false}
                    renderItem={({ item }) => {
                        console.log("ITEM PROFILE", item)
                        return (
                        <View style={styles.containerImage}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                        </View>
                    )}}
                />
            </View>
        </View>
    );
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following,
});

export default connect(mapStateToProps, null)(ProfileScreen);
