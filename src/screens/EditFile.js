
import { Alert, Button, StyleSheet,  ScrollView, Text, Image, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState, useContext } from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
import { BASE_URL } from '../config';
import FilePicker from 'react-native-document-picker';
import { Header } from '../components';
import { AuthContext } from '../context/AuthContext';

const EditFile = ({route}) => {
  const { file_id, fileName, fileDescription, fileUpload } = route.params;
  const {infoUser} = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(fileName);
  const [description, setDescription] = useState(fileDescription);
  const [singleFile, setSingleFile] = useState([]);

   console.log(fileUpload); 

  const updateFile = async(name, description) =>{
    console.log("Identity ID:",file_id);
    
    // let fileToUpload = fileUpload;
    setIsLoading(true);
    let fileToUpload = null;
    console.log('Mes2Fichiers:',fileToUpload);
    console.log('SingleFile=>',singleFile[0]);
    console.log('FichierEdited',fileUpload);
    if (singleFile != null) {
      // If file selected then create FormData
      fileToUpload = singleFile[0];
    }
    const data = new FormData();
    data.append('nom', name);
    data.append('description', description);
    data.append('upload_file', fileToUpload);
    
    console.log('MonTest33:',fileToUpload);
    console.log('MaConsole=>',data);
    console.log('MyFileEdited',fileUpload);
      
        await fetch(`${BASE_URL}/files/edit/${file_id}`,{
          method:'POST',
          headers:{
            'Authorization': `${infoUser.token}`,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data;',
          },
          body:data,
        }).then((res) => res.json())
        .then(response =>{
          setIsLoading(false);
          console.log("MON_FICHIER=>",response);
          Alert.alert("Response:",response.message);
        }) 
        .catch((error)=>{
          console.log('Error: ', error);
          setIsLoading(false);
        });
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
  const url = `https://0401-154-72-169-165.eu.ngrok.io${fileUpload}`;
  console.log('URL=>',url);
  return (
    <View style={styles.container}>
       <Spinner visible={isLoading} />
       <Header title='Edit a file'/>
       <ScrollView style={styles.wrapper}>
        <View>
            <Image
                  style={styles.image}
                  source={{uri: url}}
                  resizeMode='contain'
            />
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
              ><Text style={styles.buttonTextStyle}>Change File</Text>
              </TouchableOpacity>

            <View style={styles.btnAdd}>
              <Button
              title="Update File"
              color={'teal'}
              onPress={()=>updateFile(name,description)}
              />
            </View>
        
          </View>
        </ScrollView>
    </View>
  )
};
export default EditFile;

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#073899',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      wrapper: {
        width: '95%',
      },
      input: {
        marginBottom: 12,
        borderBottomWidth: 1,
        borderColor: '#bbb',
        borderRadius: 5,
        paddingHorizontal: 70,
        right:65
        // textAlign:'left'
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
      alignItems: 'flex-start',
      borderRadius: 30,
      marginLeft: 35,
      marginRight: 35,
      marginTop: 15,
    },
    buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
      textAlign:'left'
      // alignItems:'flex-start',
      // justifyContent:'flex-start'
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
    image:{
      marginTop:10,
      alignSelf:'center',
      width: '90%',
      height:170,
      borderRadius:20,
      borderWidth:3,
      borderColor:'#8495EB'
    },
});