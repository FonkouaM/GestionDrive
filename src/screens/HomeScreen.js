import React, {useContext, useState, useEffect} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text,
   Image, TouchableOpacity, View, SafeAreaView, RefreshControl} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { BASE_URL } from '../config';


const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const HomeScreen = ({navigation}) => {
  const {infoUser, isLoading, logout} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);
  const [visible, setVisible] = useState(false);
  let toggle = () => setVisible(!visible);

  const getFiles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/files/user`,{
        headers: {'Authorization': `${infoUser.token}`}
      });
      console.log('IDENTITY_USER:',`${infoUser.token}`);
      console.log('JSONdata=>',data);
      const json = await response.json();
      setData(json); 
      console.log('JSONdata1=>',json);
      // Alert.alert("NB:",json.message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getFiles();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(3000).then(() => setRefreshing(false)); 
    getFiles();
  }, []);

  async function deleteFile(file_id) {
    console.log('FileItemID:',file_id)
    setLoading(true);
    
    await fetch(`${BASE_URL}/file/del/${file_id}`, {
      method: 'DELETE',
      headers:{
        'Authorization': `${infoUser.token}`,
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data;',
      },
    }).then((res) => res.json())
    .then(response =>{
      setLoading(false);
      console.log(response);
      getFiles();
      Alert.alert("Okay!",response.message);
    })
    .catch((error)=>{
      console.log('Error: ', error);
      setLoading(false);
    });
  }

  const deleteConfirmDialog = (fileItem) => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to remove this file ?",
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            deleteFile(fileItem);
            console.log(fileItem)
          },
        },
      ]
      );
  };

  const logoutConfirmDialog = () => {
    return Alert.alert(
      "Are your sure?",
      "Are you sure you want to disconnect ?",
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {logout()},
        },
      ]
      );
  };

  const renderFilesUser = ({item})=>{
    
    const url = `https://0401-154-72-169-165.eu.ngrok.io${item.fileUpload}`;
    return(
      <View  key={item.file_id}  style={styles.item}>
       
        <View style={styles.descFile}>
            <View
            style={{
              width:90,
              height:100,
              marginLeft:-10
            }}
            >
            <Image
            style={styles.image}
            source={{uri: url}}
            resizeMode='contain'
            />
            </View>
            <View style={styles.desc}>
              <Text style={{fontSize:23,fontStyle:'italic', fontWeight:'bold',color:'#ff9f1c'}}>{item.fileName}</Text>
              <Text style={{fontSize:16, fontWeight:'500',fontStyle:'italic',color:'#fff'}}>{item.fileDescription}</Text>
              <Text style={{fontSize:12, color:'#90e0ef'}}>DateCreated: {item.file_dateCreated}</Text>
              <Text style={{fontSize:12, color:'#90e0ef'}}>DateUpdated: {item.file_dateUpdated}</Text>
            </View>
          </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
 
      <SafeAreaView>
         <TouchableOpacity style={styles.btnTop}  onPress={toggle}>
         <Image style={styles.iconMenu} source={require('../assets/icons/left.jpeg')}/>
      </TouchableOpacity> 
      <Menu
        style={styles.menuContent}
        visible={visible}
        anchor={<Text onPress={toggle}>Show menu</Text>}
        onRequestClose={toggle}>
          <MenuItem /*onPress={()=>navigation.navigate('ProfileUser')}*/>Profile</MenuItem>
          <MenuDivider />
          <MenuItem onPress={logoutConfirmDialog}>Logout !</MenuItem>
      </Menu>
    
        <View style={styles.listFiles}>
          <Text style={styles.welcome}>Welcome to Control Drive {infoUser.user?.userName} !!!</Text>
     
          {
            loading ? <ActivityIndicator/> : (
            
            <SwipeListView
                data={data.message}
                renderItem={renderFilesUser}
                renderHiddenItem={ ({item}, rowMap) => (
                  <View  style={styles.iconImag}>
                    <TouchableOpacity style={styles.iconEdit}
                      onPress={()=>navigation.navigate('EditFile',{file_id: item.file_id,fileName: item.fileName,
                      fileDescription: item.fileDescription, fileUpload:item.fileUpload},console.log('autreTest:',item.file_id))}
                    >
                      <Image style={styles.imgIcon} source={require('../assets/icons/edit.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconDel}
                        onPress={()=>deleteConfirmDialog( item.file_id,console.log('AutreTest1',item.file_id))}
                    > 
                      <Image style={styles.imgIcon} source={require('../assets/icons/delete.png')}/>
                    </TouchableOpacity>
                  </View>
                )}
                leftOpenValue={75}
                rightOpenValue={-75}
                refreshControl={
                  <RefreshControl
                    colors={["#9Bd35A", "#689F38"]}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
            />
            )
          }
        </View>
     
          <View style={styles.btnBottom}>
            <TouchableOpacity
            style={styles.btnAdd}
            onPress={()=>navigation.navigate("AddFile")}
            >
              <Text style={styles.textBtn}>+</Text>
            </TouchableOpacity>
          </View>
       
      </SafeAreaView>
    </View>
  )};
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#073899',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 20,
    fontWeight:'800',
    color: 'yellow',
    margin: 10
  },
  btnTop:{
    top:'23%',
    left:'75%',
    width:'25%',
    paddingBottom:15,
    paddingTop:10,
    alignSelf:'center',
    justifyContent:'center',
    position:'absolute',
  },
  iconMenu:{
    width:20,
    height:20,
    alignSelf:'center',
    borderRadius:10,
    backgroundColor:'green',
  },
  btnBottom:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    height:'75%',
    top:'53%',
    marginLeft:40
  },
  btnAdd:{
    position:'absolute',
    backgroundColor:'blue',
    borderRadius:30,
    width:45,
    height:45,
    left:'80%',
    bottom:'158%'
  },
  textBtn:{
    color:'#ffff',
    alignSelf:'center',
    justifyContent:'center',
    fontSize:30,
    fontWeight:'bold',
    position:'absolute',
  },
  btnText:{
    alignSelf:'center',
    color:'#ffff',
    justifyContent:'center',
    fontSize:15,
    fontWeight:'bold',
    position:'absolute'
  },
  btnLogout:{
    position:'absolute',
    justifyContent:'center',
    alignSelf:'center',
    backgroundColor: 'red',
    borderRadius:10,
    color:'#fff',
    paddingBottom:20,
    paddingTop:20,
    paddingLeft:30,
    paddingRight:30,
    right:'90%',
    bottom:'158%'
  },
  listFiles:{
    paddingVertical:'80%'
  },
  descFile:{
    flex:1,
    flexDirection: 'row',
    backgroundColor:'#073899',
    borderRadius:20,
    borderWidth:3,
    borderColor:'#d9ed92',
    marginTop:10,
    // paddingLeft:15,
    paddingRight:15,
    paddingBottom:10
  },
  image:{
    width:'100%',
    height:'100%',
    position:'absolute',
    top:10,
    borderRadius:20,
    borderWidth:1,
    borderColor:'#fff',
  },
  item:{
    flex:1,
    fontSize:15,
    fontWeight:'700',
    // backgroundColor:'#ff9f1e',
    shadowColor:'#000',
    shadowOffset:{
      width:0,
      height:15
    },
    shadowOpacity:.3,
    shadowRadius:20,
    padding:20
  },
  desc:{
    flex:1,
    paddingLeft:10
  },
  iconImag:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignSelf:'center',
    padding:20,
    borderRadius:20,
    marginTop:30
  },
  iconEdit:{
    backgroundColor:'blue',
    justifyContent:'center',
    width:50,
    height:50,
    marginRight:'30%',
    borderRadius:20
  },
  iconDel:{
    backgroundColor:'red',
    justifyContent:'center',
    width:50,
    height:50,
    marginLeft:'30%',
    borderRadius:50
  },
  imgIcon:{
    alignSelf:'center',
    width:30,
    height:30
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: 300,
    height: 300,
    backgroundColor: "red",
    marginBottom: 30,
  },
  text: {
    fontSize: 30,
  },
  headerText: {
    fontSize: 20,
    margin: 10,
    fontWeight: "bold"
  },
  menuContent: {
    backgroundColor:'#444',
    color: "#fff",
    fontWeight: "bold",
    padding: 2,
    fontSize: 20
  },
});