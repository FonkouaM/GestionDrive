import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProfileScreen = ({ navigation, route }) => {
  return (
    <View>
      <Text>This is {route.params.name}'s profile</Text>;
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})
