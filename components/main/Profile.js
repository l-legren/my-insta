import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    useWindowDimensions,
} from "react-native";
import firebase from "firebase";
import "firebase/firestore";
import { connect } from "react-redux";

function ProfileScreen(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);

    const imageWidth = Math.floor(useWindowDimensions().width / 3);

    useEffect(() => {
        const { currentUser, posts } = props;

        console.log(currentUser);

        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
            setUserPosts(posts);
        } else {
            firebase
                .firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then(snapshot => {
                    if (snapshot.exists) {
                        setUser(snapshot.data())
                    } else {
                        console.log("Snapshot doesnt exist")
                    }
                })

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
                    // console.log("This is the snapshot", posts);
                    setUserPosts(thirdUserPosts);
                });
        }
    }, [props.route.params.uid]);

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
            </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    data={userPosts}
                    horizontal={false}
                    renderItem={({ item }) => (
                        <View style={styles.containerImage}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    );
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
});

export default connect(mapStateToProps, null)(ProfileScreen);
