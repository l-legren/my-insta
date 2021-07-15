import React, { Component } from "react";
import { Text, View } from "react-native";

// Redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser, fetchUserPosts } from "../redux/actions";

import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";

//Icons
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Local Components
import FeedScreen from "./main/Feed";
import ProfileScreen from "./main/Profile";
import SearchScreen from "./main/Search";

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return null;
};

export class MainScreen extends Component {
    componentDidMount() {
        this.props.fetchUser();
        this.props.fetchUserPosts();
    }

    componentDidUpdate() {
        this.props.fetchUserPosts();
    }

    render() {
        const { currentUser } = this.props;

        console.log("Props of Main", this.props);

        if (currentUser === undefined) {
            return <View />;
        }
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                <Tab.Screen
                    name="Feed"
                    component={FeedScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return (
                                <MaterialCommunityIcons
                                    name="home"
                                    color={color}
                                    size={26}
                                />
                            );
                        },
                    }}
                />
                <Tab.Screen
                    name="AddContainer"
                    component={EmptyScreen}
                    listeners={({ navigation }) => ({
                        tabPress: (event) => {
                            event.preventDefault();
                            navigation.navigate("Add");
                        },
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return (
                                <MaterialCommunityIcons
                                    name="plus-box"
                                    color={color}
                                    size={26}
                                />
                            );
                        },
                    }}
                />
                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return (
                                <MaterialCommunityIcons
                                    name="account-circle"
                                    color={color}
                                    size={26}
                                />
                            );
                        },
                    }}
                />
                <Tab.Screen
                    name="Search"
                    component={SearchScreen}
                    listeners={({ navigation }) => ({
                        tabPress: (event) => {
                            event.preventDefault();
                            navigation.navigate("Search");
                        },
                    })}
                    options={{
                        tabBarIcon: ({ color, size }) => {
                            return (
                                <MaterialCommunityIcons
                                    name="magnify"
                                    color={color}
                                    size={26}
                                />
                            );
                        },
                    }}
                />
            </Tab.Navigator>
        );
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
});
const mapDispatchProps = (dispatch) =>
    bindActionCreators({ fetchUser, fetchUserPosts }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(MainScreen);
