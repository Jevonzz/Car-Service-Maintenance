import {StyleSheet, Text, View, Border, Image, StatusBar} from 'react-native';
import React, {Component, useState, useEffect} from 'react';
import Colors from '../const/color';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

const UserScreen = ({navigation, onPress}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.Rectangle} />
      <Image
        style={styles.logo}
        source={require('../../assets/img/Logo.png')}
      />
      <Text style={styles.word}>Welcome To CarProX</Text>
      <View style={styles.Icontainer}>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ScheduleCarService')}>
            <MaterialCommunityIcons name="tools" size={40} color="black" />
            <Text style={styles.title}>Schedule Car Service</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('RegisterCarDetails')}>
            <Ionicons name="car-sharp" size={40} color="black" />
            <Text style={styles.title}>Register Car Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('RequestCPCarService')}>
            <MaterialCommunityIcons
              name="timer-outline"
              size={40}
              color="black"
            />
            <Text style={styles.title}>
              Request Cancel or Postpone Car Service
            </Text>
          </TouchableOpacity>
        </View>
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
    top: '28%',
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
  Iconcontainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '45%',
    borderTopColor: '#ddd',
    paddingVertical: 20,
  },
  item: {
    width: 150,
    height: 150,
    marginVertical: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserScreen;
