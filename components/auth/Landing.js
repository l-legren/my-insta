import React from 'react'
import { StyleSheet, Button, Text, View } from 'react-native'

export default function LandingScreen({navigation}) {
    return (
        <View style={{flex: 1, justifyContent: 'center'}}>
            <Button title='Register' onPress={() => navigation.navigate("Register")}></Button>
            <Button title='Login' onPress={() => navigation.navigate("Login")}></Button>
        </View>
    )
}

const styles = StyleSheet.create({})
