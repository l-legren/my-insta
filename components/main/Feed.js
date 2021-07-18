import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class FeedScreen extends Component {

    componentDidMount() {
        console.log("FROM FEED",this.props)
    }

    render() {
        return (
            <View>
                <Text> Feedoooo </Text>
            </View>
        )
    }
}
