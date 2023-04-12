import {
  StyleSheet,
  Text,
  View,
  Border,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import React, {Component, useState, useEffect} from 'react';
import Colors from '../../const/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
} from 'firebase/firestore/lite';
import {authentication, firebaseDB} from '../../../firebase/firebase-config';
import {signOut} from 'firebase/auth';
import ImagePicker from 'react-native-image-crop-picker';

const ProfileScreen = ({navigation, onPress, route}) => {
  const [user, setUser] = useState('');
  const [cars, setCars] = useState([]);

  // Function to logout user
  const logOut = () => {
    signOut(authentication).catch(e => alert(e.message));
    navigation.navigate('Auth');
  };

  //fetch User Data
  const fetchUserData = async () => {
    try {
      const userRef = doc(firebaseDB, 'users', authentication.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        setUser(userDoc.data());
      }
    } catch (error) {
      console.log('Error getting user data: ', error);
    }
  };

  //Fetch car data
  const fetchCarsData = async () => {
    try {
      const carsRef = collection(
        firebaseDB,
        'users',
        authentication.currentUser.uid,
        'cars',
      );
      const carsSnapshot = await getDocs(carsRef);
      const carsList = carsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCars(carsList);
    } catch (error) {
      console.log('Error getting cars data: ', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchCarsData();
  }, [cars]);

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.carDetails}
        onPress={() =>
          navigation.navigate('EditCarRegistered', {
            id: item.id,
            brand: item.brand,
            model: item.model,
            carPlate: item.carPlate,
            year: item.year,
          })
        }>
        <Text>
          {item.brand} ({item.model})
        </Text>
        <Text>{item.carPlate}</Text>
        <Text>{item.year}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.Rectangle} />
      <View style={styles.IconContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditProfile', {
              name: user.name,
              email: user.email,
              phone: user.phoneNo,
            })
          }>
          <MaterialCommunityIcons
            name="square-edit-outline"
            size={25}
            style={styles.icon}
          />
          <Text style={styles.text}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />
        <TouchableOpacity onPress={logOut}>
          <Ionicons name="log-out-outline" size={25} style={styles.icon} />
          <Text style={styles.text}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.avatarContainer}>
        <FontAwesome name="user-circle" size={100} color={Colors.gray} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user && user.name}</Text>
        <Text style={styles.email}>{user && user.email}</Text>
        <Text style={styles.phone}>{user && user.phoneNo}</Text>
      </View>
      <View style={styles.subcontainer}>
        <Text style={styles.title}>Car Registered: </Text>
        <FlatList
          data={cars}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>Brand & Model</Text>
              <Text style={styles.headerText}>Car Plate</Text>
              <Text style={styles.headerText}>Year</Text>
            </View>
          }
        />
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
    height: '11%',
    zIndex: -1,
  },
  IconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 10,
    height: 50,
  },
  icon: {
    marginLeft: 18,
  },
  spacer: {
    flex: 1,
  },
  text: {
    marginLeft: 5,
  },
  avatarContainer: {
    alignItems: 'center',
    top: '5%',
  },
  infoContainer: {
    marginTop: '10%',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    marginTop: 5,
  },
  phone: {
    fontSize: 16,
    marginTop: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  carDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  subcontainer: {
    padding: 20,
  },
});

export default ProfileScreen;
