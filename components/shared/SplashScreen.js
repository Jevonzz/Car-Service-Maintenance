import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ActivityIndicator,
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import {authentication} from '../../firebase/firebase-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './loader';

const SplashScreen = ({navigation}) => {
  //State for ActivityIndicator animation
  const [animating, setAnimating] = useState(true);
  const [uid, setUid] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const getRole = async () => {
      const userQuery = query(doc(firebaseDB, 'users', uid));
      const querySnapshot = await getDoc(userQuery);
      const userRole = querySnapshot.data().role;
      setRole(userRole);
    };
    if (uid) {
      getRole();
    }
  }, [uid]);

  useEffect(() => {
    setTimeout(() => {
      setAnimating(false);
      // Check if currentUser is set or not
      // If not then send for Authentication
      if (role === 'user') {
        navigation.replace('UserScreen');
      } else if (role === 'admin') {
        navigation.replace('AdminScreen');
      } else if (role === 'crew') {
        navigation.replace('CrewScreen');
      } else {
        navigation.replace('Auth');
      }
    }, 3000);
  }, [role]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <Loader />
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIndicator: {
    alignItems: 'center',
    height: 80,
  },
});
