import React, {useContext, useState, useEffect} from 'react';
import {ActivityIndicator, Button, Alert, StyleSheet, Text,
   Image, TouchableOpacity, View, FlatList, SafeAreaView, RefreshControl} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import {AuthContext} from '../context/AuthContext';
import { BASE_URL } from '../config';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

const FilesUser = ({navigation}) => {
  const {infoUser, isLoading} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const getFiles = async () => {
    try {
      const response = await fetch(`${BASE_URL}/files/user`,{
        headers: {'Authorization': `${infoUser.token}`}
      });
      console.log('IDENTITY_USER:',`${infoUser.token}`);
      console.log('dataJSON=>',data);
      const json = await response.json();
      setData(json); 
      // Alert.alert("NB:",json.message);
      console.log('DataJSON=>',json);
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

  const renderUser = ({item})=>{
    
    const url = `https://ed9d-154-72-171-172.eu.ngrok.io${item.fileUpload}`;
    return(
      <View  key={item.file_id}  style={styles.item}>
        <View style={styles.descFile}>
          {/* <Image
          style={styles.image}
          source={{uri: url}}
          resizeMode='contain'
          /> */}
          <View style={styles.desc}>
            {/* <Text>{`${item.user_firstName} ${item.user_name} ${item.user_phone}`}</Text> */}
            {/* <Text>File_id: {item.file_id}</Text> */}
            <Text style={{fontSize:18,fontStyle:'italic', fontWeight:'bold',color:'#ff9f1c'}}>NameFile : {item.fileName}</Text>
            {/* <Text>Description: {item.fileDescription}</Text>
            <Text>DateCreated: {item.file_dateCreated}</Text>
            <Text>DateUpdated: {item.file_dateUpdated}</Text> */}
            {/* <Text>User_id: {item.user.userId}</Text> */}
            <Text style={{fontSize:16, fontWeight:'500',fontStyle:'italic',color:'#fff'}}>Email: {item.user.userEmail}</Text>
            <Text style={{fontSize:16, fontWeight:'500',fontStyle:'italic',color:'#fff'}}>FirstName: {item.user.userFirstName}</Text>
            <Text style={{fontSize:16, fontWeight:'500',fontStyle:'italic',color:'#fff'}}>LastName: {item.user.userName}</Text>
            <Text style={{fontSize:16, fontWeight:'500',fontStyle:'italic',color:'#fff'}}>Phone: {item.user.userPhone}</Text>
            <Text style={{fontSize:12, color:'#90e0ef'}}>DateCreated: {item.user.user_dateCreated}</Text>
            <Text style={{fontSize:12, color:'#90e0ef'}}>DateUpdated: {item.user.user_dateUpdated}</Text> 
          </View>
        </View>
      </View>
    )
  }


  return (
    <View style={styles.container}>
      <Spinner visible={isLoading} />
      <SafeAreaView>
       
        <View style={styles.listFiles}>
          <Text style={styles.welcome}>File name and user profile...</Text>
     
          {
            loading ? <ActivityIndicator/> : (
              <FlatList
                data={data.message}
                keyExtractor={item => `${item.file_id}`}
                renderItem={renderUser}
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
              {console.log('MyData',data.message)}
        </View>
      </SafeAreaView>
    </View>
  )};
export default FilesUser;

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#073899',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    marginTop: 10,
    fontSize: 20,
    fontWeight:'800',
    color: 'yellow',
    margin: 10
  },
  // btnTop:{
  //   top:'23%',
  //   left:'75%',
  //   width:'25%',
  //   paddingBottom:15,
  //   paddingTop:10,
  //   alignSelf:'center',
  //   justifyContent:'center',
  //   position:'absolute',
  // },
  // iconMenu:{
  //   width:20,
  //   height:20,
  //   alignSelf:'center',
  //   borderRadius:10,
  //   backgroundColor:'green',
  // },
  // btnBottom:{
  //   flexDirection:'row',
  //   alignItems:'center',
  //   justifyContent:'space-between',
  //   height:'75%',
  //   top:'53%',
  //   marginLeft:40
  // },
  // btnAdd:{
  //   position:'absolute',
  //   backgroundColor:'blue',
  //   borderRadius:30,
  //   width:45,
  //   height:45,
  //   left:'80%',
  //   bottom:'158%'
  // },
  // textBtn:{
  //   color:'#ffff',
  //   alignSelf:'center',
  //   justifyContent:'center',
  //   fontSize:30,
  //   fontWeight:'bold',
  //   position:'absolute',
  // },
  // btnText:{
  //   alignSelf:'center',
  //   color:'#ffff',
  //   justifyContent:'center',
  //   fontSize:15,
  //   fontWeight:'bold',
  //   position:'absolute'
  // },
  // btnLogout:{
  //   position:'absolute',
  //   justifyContent:'center',
  //   alignSelf:'center',
  //   backgroundColor: 'red',
  //   borderRadius:10,
  //   color:'#fff',
  //   paddingBottom:20,
  //   paddingTop:20,
  //   paddingLeft:30,
  //   paddingRight:30,
  //   right:'90%',
  //   bottom:'158%'
  // },
  // listFiles:{
  //   paddingVertical:'50%'
  // },
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
    backgroundColor:'#ff9f1e',
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
  // iconImag:{
  //   flexDirection:'row',
  //   justifyContent:'space-between',
  //   alignSelf:'center',
  //   padding:20,
  //   borderRadius:20,
  //   marginTop:30
  // },
  // iconEdit:{
  //   backgroundColor:'blue',
  //   justifyContent:'center',
  //   width:50,
  //   height:50,
  //   marginRight:'30%',
  //   borderRadius:20
  // },
  // iconDel:{
  //   backgroundColor:'red',
  //   justifyContent:'center',
  //   width:50,
  //   height:50,
  //   marginLeft:'30%',
  //   borderRadius:50
  // },
  // imgIcon:{
  //   alignSelf:'center',
  //   width:30,
  //   height:30
  // },
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
    color: "#fff",
    fontWeight: "bold",
    padding: 2,
    fontSize: 20
  },
});