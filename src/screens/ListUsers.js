import {Button, StyleSheet, Animated, Text, View, Image, ActivityIndicator, SafeAreaView, ScrollView, FlatList} from 'react-native'
import React, {useState, useEffect} from 'react'
import { BASE_URL } from '../config';
import { Header} from '../components';

const ListUsers = ({navigation}) => {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getUsers = async () => {
     try {
      const response = await fetch(`${BASE_URL}/users/list`);
      const json = await response.json();
      setData(json);
      console.log('JSONdata=>',json.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getUsers();
  }, []);

  const renderUser = ({item})=>{
    return(
      <View style={styles.item}>
        {/* <Image
        style={styles.image}
        source={{uri:item.picture}}
        resizeMode='contain'
      /> */}
      <View>
        {/* <Text>{`${item.user_firstName} ${item.user_name} ${item.user_phone}`}</Text> */}
        <Text>User_id: {item.user_id}</Text>
        <Text>Email: {item.user_email}</Text>
        <Text>FirstName: {item.user_firstName}</Text>
        <Text>LastName: {item.user_name}</Text>
        <Text>Phone: {item.user_phone}</Text>
        <Text>DateCreated: {item.user_dateCreated}</Text>
        <Text>DateUpdated: {item.user_dateUpdated}</Text>
      </View>
      <Button title='View all files of user'
        onPress={()=>navigation.navigate('FilesUser',{file_id: item.user_id})}
      />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Header title='All users'/>
      <ScrollView>
          {
            isLoading ? <ActivityIndicator/> : (
              <FlatList
                data={data.users}
                keyExtractor={item => `key-${item.users?.user_email}`}
                renderItem={renderUser}
                // contentContainerStyle={{
                //   padding:20
                // }}
              />
            )
          }
          {console.log('Test1=>',data.users)}
        </ScrollView>
      </SafeAreaView>
    </View>
  )}
export default ListUsers

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#102C44',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',    shadowColor:'#000',

  },
  item:{
    fontSize:30,
    // backgroundColor:'#fff',
    // shadowColor:'#000',
    shadowOffset:{
      width:0,
      height:10
    },
    shadowOpacity:.3,
    shadowRadius:20,
    padding:15
  }
});