import {StyleSheet, Text, View, Border, Image} from 'react-native';
import React, {Component, useState, useEffect} from 'react';
import Colors from '../const/color';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import {authentication} from '../../firebase/firebase-config';
import {signOut} from 'firebase/auth';

const AdminScreen = ({navigation, onPress}) => {
  // Function to logout user
  const logOut = () => {
    signOut(authentication).catch(e => alert(e.message));
    navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      <View style={styles.Rectangle} />
      <TouchableOpacity onPress={logOut}>
        <Ionicons name="log-out-outline" size={30} style={styles.logoutIcon} />
      </TouchableOpacity>
      <Text style={styles.logout}>Logout</Text>
      <Image
        style={styles.logo}
        source={require('../../assets/img/Logo.png')}
      />
      <Text style={styles.word}>Administrator</Text>
      <View style={{marginTop: 200}}>
        <TouchableOpacity
          style={styles.background}
          onPress={() => navigation.navigate('UpdateCC')}>
          <Ionicons name="car-sharp" size={40} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.label}>Update Company Contact</Text>
      </View>
      <View style={{marginTop: 50}}>
        <TouchableOpacity
          style={styles.background}
          onPress={() => navigation.navigate('ManageStock')}>
          <MaterialCommunityIcons name="tools" size={40} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.label}>Manage Stocks</Text>
      </View>

      <View style={{marginTop: 50}}>
        <TouchableOpacity
          style={styles.background}
          onPress={() => navigation.navigate('ManageCrew')}>
          <Octicons name="organization" size={40} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.label}>Manage Service Crew List</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  Rectangle: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: Colors.primary,
    width: '100%',
    height: '35%',
    zIndex: -1,
  },
  logo: {
    position: 'absolute',
    alignSelf: 'center',
    height: '30%',
    width: '70%',
  },
  logoutIcon: {
    top: '20%',
    right: '2%',
    alignSelf: 'flex-end',
  },
  logout: {
    top: '.5%',
    left: '88%',
  },
  word: {
    position: 'relative',
    alignSelf: 'center',
    top: '20%',
    fontSize: 20,
  },
  label: {
    position: 'relative',
    alignSelf: 'center',
    top: '20%',
    fontSize: 17,
  },
  background: {
    backgroundColor: '#D3D3D3',
    borderRadius: 100,
    position: 'relative',
    alignSelf: 'center',
    top: '30%',
    zIndex: -1,
    width: '30%',
  },

  icon: {
    alignSelf: 'center',
    top: '0%',
    zIndex: 1,
  },
});

export default AdminScreen;
