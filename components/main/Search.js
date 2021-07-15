import React, { useState } from 'react'
import { View, TextInput, FlatList, Text } from 'react-native'

import firebase from 'firebase'

require("firebase/firestore")

export default function SearchScreen() {
    const [users,setUsers] = useState([]) 
    return (
        <View>
            <Text></Text>
        </View>
    )
}
