import {StyleSheet, Text, View, Border, Image} from 'react-native';
import React, {Component, useState, useEffect} from 'react';
import Colors from '../../const/color';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

const TrackScreen = ({navigation, onPress}) => {
  return (
    <View style={styles.container}>
      <View style={styles.Rectangle} />
      <Text style={styles.word}>Track</Text>
      <View style={styles.Icontainer}>
        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('CarAppointmentStatus')}>
            <MaterialCommunityIcons name="tools" size={40} color="black" />
            <Text style={styles.title}> Car Appointment Status</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('ServiceRecord')}>
            <Ionicons name="car-sharp" size={40} color="black" />
            <Text style={styles.title}> Car Service Record</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('BillHistory')}>
            <Octicons name="history" size={35} color="black" />
            <Text style={styles.title}> Bill History</Text>
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
    height: '15%',
    zIndex: -1,
  },
  word: {
    top: '5%',
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  Icontainer: {
    top: '5%',
  },
  grid: {
    flexDirection: 'column',
    alignSelf: 'center',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: '10%',
    borderTopColor: '#ddd',
    paddingVertical: 20,
  },
  item: {
    width: 350,
    height: 70,
    marginVertical: 30,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    paddingLeft: 20,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default TrackScreen;
