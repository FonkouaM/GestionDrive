
import { Alert, Button, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useContext } from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
import { BASE_URL } from '../config';
import FilePicker from 'react-native-document-picker';
import { AuthContext } from '../context/AuthContext';
import { Header } from '../components';

const AddFile = () => {
  const {infoUser} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const [singleFile, setSingleFile] = useState([]);
 
  const uploadFile = async(name, description) => {
    console.log(infoUser);
    setIsLoading(true);
      if (singleFile != null) {
        // If file selected then create FormData
        const fileToUpload = singleFile[0];
        
        const data = new FormData();
        data.append('nom', name);
        data.append('description', description);
        data.append('upload_file', fileToUpload);
        console.log('resData=>',fileToUpload);
        
      await fetch(`${BASE_URL}/files/add`,{
        method:'POST',
        headers:{
          'Authorization': `${infoUser.token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data;',
        },
        body:data,
      }).then((res) => res.json())
      .then(resData =>{
        setIsLoading(false);
        console.log(resData);
        Alert.alert("Success!",resData.message);
      })
      .catch((error)=>{
        console.log('Error: ', error);
        setIsLoading(false);
      })
    
    }
  }

  const selectFile = async () => {

    // Opening Document Picker to select one file

    try {

      const res = await FilePicker.pick({

        // Provide which type of file you want user to pick
        // presentationStyle:'fullScreen',
        // allowMultiSelection: false,
        type: [FilePicker.types.allFiles],
        // There can me more options as well

        // DocumentPicker.types.allFiles

        // DocumentPicker.types.images

        // DocumentPicker.types.plainText

        // DocumentPicker.types.audio

        // DocumentPicker.types.pdf

      });

      // Printing the log realted to the file

      console.log('res : ' + JSON.stringify(res));

      // Setting the state to show single file attributes
      setSingleFile(res);

    } catch (err) {

      setSingleFile(null);

      // Handling any exception (If any)

      if (DocumentPicker.isCancel(err)) {

        // If user canceled the document selection

        alert('Canceled');

      } else {

        // For Unknown Error

        alert('Unknown Error: ' + JSON.stringify(err));

        throw err;

      }

    }

  };

  return (
    <View style={styles.container}>
       {/* <Spinner visible={isLoading} /> */}
       <Header title='Add a new file'/>
       <ScrollView style={styles.wrapper}>
        <View style={styles.wrapper}>
            <TextInput
            style={styles.input}
            value={name}
            placeholder="Enter name"
            onChangeText={text => setName(text)}
            />
            <TextInput
            style={styles.input}
            value={description}
            placeholder="Enter description"
            placeholderTextColor="grey"
            numberOfLines={10}
            multiline={true}
            underlineColorAndroid="transparent"
            onChangeText={text => setDescription(text)}
            />

            {/*Showing the data of selected Single file*/}
              {singleFile.length > 0 
              ? singleFile.map((ls, index)=>{
                return (
                  <View key={index}>
                    <Text style={styles.textStyle}>File Name: {ls.name}</Text>
                    <Text style={styles.textStyle}>Type: {ls.type}</Text>
                    <Text style={styles.textStyle}>File Size: {ls.size}</Text>
                    <Text style={styles.textStyle}>URI: {ls.uri}</Text>
                  </View>
                    );
              }) : null}
              <TouchableOpacity
              style={styles.input}
              activeOpacity={0.5}
              onPress={()=>selectFile()}
              ><Text style={styles.buttonTextStyle}>Select File</Text>
              </TouchableOpacity>

            <View style={styles.btnAdd}>
              <Button
              color={'teal'}
              title="Upload File"
              onPress={()=>uploadFile(name,description)}
              />
            </View>
          </View>
       </ScrollView>
    </View>
  )
};
export default AddFile;

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#073899',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      wrapper: {
        width: '90%',
      },
      input: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        paddingHorizontal: 14,
      },
    btnInput:{
        marginBottom:15,
        paddingVertical:10
    },
    btnAdd:{
        marginTop:15,
        paddingVertical:30
    },
    buttonStyle: {
      backgroundColor: '#307ecc',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#307ecc',
      height: 40,
      alignItems: 'center',
      borderRadius: 30,
      marginLeft: 35,
      marginRight: 35,
      marginTop: 15,
    },
    buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
    },
    textStyle: {
      backgroundColor: '#8495EB',
      fontSize: 10,
      fontWeight:'bold',
      marginTop: 15,
      marginLeft: 30,
      marginRight: 30,
      textAlign: 'center',
      bottom:10
    },
});