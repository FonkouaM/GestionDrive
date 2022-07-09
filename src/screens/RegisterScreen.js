import React, {useContext, useState} from 'react';
import {
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [nom, setNom] = useState(null);
  const [prenom, setPrenom] = useState(null);
  const [telephone, setTelephone] = useState(0);
  const [password, setPassword] = useState(null);

  const {isLoading, register} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Enter email"
          onChangeText={text => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          value={nom}
          placeholder="Enter name"
          onChangeText={text => setNom(text)}
        />
        <TextInput
          style={styles.input}
          value={prenom}
          placeholder="Enter firstName"
          onChangeText={text => setPrenom(text)}
        />
        <TextInput
          style={styles.input}
          value={telephone.toString()}
          placeholder="Enter phone"
          onChangeText={(text) => setTelephone(text)}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          value={password}
          placeholder="Enter password"
          onChangeText={text => setPassword(text)}
          secureTextEntry
        />

        <Button
          title="Register"
          color={'teal'}
          onPress={() => { register(email, nom, prenom, telephone, password); }}
        />

        <View style={{flexDirection: 'row', marginTop: 20}}>
          <Text>Already have an accoutn? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#073899',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '80%',
  },
  input: {
    marginBottom: 7,
    borderBottomWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 14,
  },
  link: {
    color: 'yellow',
  },
});

export default RegisterScreen;
