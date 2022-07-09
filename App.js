import 'react-native-gesture-handler';
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Navigation } from './src/components'
import { AuthProvider } from './src/context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
     <StatusBar backgroundColor="#073899"/>
      <Navigation />
    </AuthProvider>
  )
}

export default App

const styles = StyleSheet.create({})