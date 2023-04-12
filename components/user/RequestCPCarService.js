import React, {Component, useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
  useWindowDimensions,
  TextBase,
} from 'react-native';
import Colors from '../const/color';
import Octicons from 'react-native-vector-icons/Octicons';
import {firebaseDB} from '../../firebase/firebase-config';
import {doc, getDoc} from 'firebase/firestore/lite';

const RequestCPCarService = () => {
  const [contact, setContact] = useState(null);
  //Retrieve company contact information
  useEffect(() => {
    const getContact = async () => {
      const docRef = doc(firebaseDB, 'company', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContact(docSnap.data());
      }
    };
    getContact();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.Rectangle} />
        <Image
          style={styles.logo}
          source={require('../../assets/img/Logo.png')}
        />

        <View>
          <Text
            style={{
              fontSize: 30,
              paddingLeft: 15,
              marginTop: 20,
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Unfortunate Things Happen{' '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              marginTop: 10,
              paddingLeft: 14,
              color: Colors.grey,
              textAlign: 'center',
            }}>
            You May Request Cancel or Postpone of your Car Service by
            Call/Message Our Company Number or Email to us!{' '}
          </Text>
          <Text
            style={{
              fontSize: 18,
              paddingLeft: 15,
              marginTop: 50,
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Here's Our Contact <Octicons name="smiley" size={20} />
          </Text>
          {contact && (
            <View style={styles.contactContainer}>
              <Text style={styles.title}>CarProX Email</Text>
              <Text style={styles.label}>{contact.email}</Text>
              <View></View>
              <Text style={styles.title}>CarProX Phone</Text>
              <Text style={styles.label}>{contact.phone}</Text>
            </View>
          )}
        </View>
      </View>
    </>
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
    height: '30%',
    zIndex: -1,
  },
  logo: {
    marginTop: 0,
    alignSelf: 'center',
    height: 180,
    width: 180,
  },
  backNav: {
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  inputContainer: {
    marginTop: 30,
    alignSelf: 'center',
    paddingLeft: 20,
    height: 50,
    width: 330,
    elevation: 25,
    borderRadius: 30,
    backgroundColor: Colors.white,
    borderWidth: 0,
  },
  forgottenButton: {
    height: 50,
    width: 330,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: Colors.primary,
    borderRadius: 15,
  },
  contactContainer: {
    marginTop: '5%',
    alignItems: 'center',
  },
  label: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 18,

    marginTop: 10,
  },
});

export default RequestCPCarService;
