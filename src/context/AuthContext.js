import React, {createContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [infoUser, setInfoUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [splashLoading, setSplashLoading] = useState(false);

  const register = async(email, nom, prenom, telephone, password) => {

    setIsLoading(true);
  await fetch(`${BASE_URL}/register`,{
        method:'POST',
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'email':email, 'nom':nom, 'prenom':prenom, 'telephone':parseInt(telephone), 'password':password})
      }).then(res => res.json())
      .then(resData =>{
        alert(resData.message);
        console.log(resData);
      })
      .catch(error=>{
        console.log(`register error ${error}`);
        alert('Error'+error);
        setIsLoading(false);
      });
    // axios
    //   .post(`${BASE_URL}/register`, {
    //     email,
    //     nom,
    //     prenom,
    //     telephone:parseInt(telephone),
    //     password,
    //   })
    //   .then(res => {
    //     let infoUser = res.data;
    //     setInfoUser(infoUser);
    //     AsyncStorage.setItem('infoUser', JSON.stringify(infoUser));
    //     setIsLoading(false);
    //     console.log(infoUser);
    //     alert(infoUser.message);
    //     setInfoUser({});
    //   })
    //   .catch(e => {
    //     console.log(`register error ${e}`);
    //     setIsLoading(false);
    //     alert('error');
    //   });
  };

  const login = async(email, password) => {
    setIsLoading(true);
    // await fetch(`${BASE_URL}/login`,{
    //   method:'POST',
    //   headers:{
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({'email':email, 'password':password})
    // }).then(res => res.json())
    // .then(resData =>{
    //   alert('You are connected!');
    //   console.log(resData);
    //   // navigate("Home")
    //   setIsLoading(false);
    // })
    // .catch((error)=>{
    //   console.log('Error: ', error);
    //   alert('Error'+error);
    //   setIsLoading(false);
    // });
    axios
    .post(`${BASE_URL}/login`, {
      email,
      password,
    })
    .then(res=>{
      let infoUser = res.data;
      console.log(infoUser);
      setInfoUser(infoUser);
      AsyncStorage.setItem('infoUser', JSON.stringify(infoUser));
      setIsLoading(false);
      })
      .catch(e=>{
        console.warn(`login error ${e}`);
        setIsLoading(false);
        alert(e);
      });
  };

  const logout = () => {
    setIsLoading(true);

    axios
      .post(
        `${BASE_URL}/logout`,
        {},
        {
          headers: {Authorization: `${infoUser.token}`},
        },
      )
      .then((res) => {
        console.log(res.data);
        AsyncStorage.removeItem('infoUser');
        setInfoUser({});
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(`logout error ${e}`);
        setIsLoading(false);
      });
  };

  const isLoggedIn = async () => {
    try {
      setSplashLoading(true);

      let infoUser = await AsyncStorage.getItem('infoUser');
      infoUser = JSON.parse(infoUser);

      if (infoUser) {
        setInfoUser(infoUser);
      }

      setSplashLoading(false);
    } catch (e) {
      setSplashLoading(false);
      console.log(`is logged in error ${e}`);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        infoUser,
        splashLoading,
        register,
        login,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};