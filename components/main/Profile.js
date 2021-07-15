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
import { connect } from "react-redux";

function ProfileScreen(props) {
    const [userPosts, setUserPosts] = useState([])
    const [user, setUser] = useState(null)

    
    useEffect(() => {
        const { currentUser, posts } = props;
        
        console.log(props.route.params.uid, firebase.auth().currentUser.uid);
        
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
            setUserPosts(posts)
        } else {
            setUser(null);
        }
    }, [])

    if (user === null) {
        return <View />
    }

    const imageWidth = Math.floor(useWindowDimensions().width / 3);

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
                    data={posts}
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
