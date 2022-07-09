import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Header = ({title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignSelf:'center',
       marginBottom:30,
       marginTop:3,
       top:0
    },
    title:{
        textAlign:'center',
        marginTop:20,
        fontSize: 30,
        fontWeight:'bold',
        color: '#fff'
    }
})