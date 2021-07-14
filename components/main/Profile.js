import React, { Component } from "react";
import { StyleSheet, Text, View, Image, FlatList } from "react-native";

import { connect } from "react-redux";

function ProfileScreen(props) {
    const { currentUser, posts } = props;

    const DATA = posts;

    console.log("Props in Profile", props);

    const Item = ({ downloadURL }) => null;

    return (
        <View style={styles.container}>
            <View style={styles.containerInfo}>
                <Text>{currentUser.name}</Text>
                <Text>{currentUser.email}</Text>
            </View>
            <View style={styles.containerGallery}>
                <FlatList numColumns={3} data={DATA} renderItem={() => <Item />} />
                {/* <Image source={downloadURL} /> */}
            </View>
        </View>
        // <View>
        // </View>
    );
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "40px",
    },
    containerInfo: {
        margin: "20px"
    },
    containerGallery: {
        flex: 1,
    }
});

export default connect(mapStateToProps, null)(ProfileScreen);
