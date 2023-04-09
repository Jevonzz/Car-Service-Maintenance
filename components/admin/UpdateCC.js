import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {firebaseDB} from '../../firebase/firebase-config';
import {updateDoc, doc, getDoc, onSnapshot} from 'firebase/firestore/lite';
import {async} from '@firebase/util';
import Colors from '../const/color';
import {Overlay} from '@rneui/base';

import FormSuccess from '../shared/formSuccess';
import Loader from '../shared/loader';

const UpdateCC = ({navigation}) => {
  const [prevContact, setPrevContact] = useState(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loader, setLoader] = useState(false);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const phoneRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

  //Get previous company contact
  useEffect(() => {
    const getPrevContact = async () => {
      const docRef = doc(firebaseDB, 'company', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPrevContact(docSnap.data());
      }
    };
    getPrevContact();
  }, []);

  // Update the contact in the database
  const updateContact = async () => {
    setLoader(true);
    if (address.trim() === '' || phone.trim() === '') {
      setLoader(false);
      setOverlayText('Please fill all fields');
      setpopUpErr(true);
      setIsVisible(true);
      return;
    } else if (!phoneRegex.test(phone)) {
      setLoader(false);
      setOverlayText('Please enter a valid phone number');
      setpopUpErr(true);
      setIsVisible(true);
    } else {
      try {
        const docRef = doc(firebaseDB, 'company', 'contact');
        await updateDoc(docRef, {
          address,
          phone,
        });
        setIsVisible(true);
        setOverlayText('Updated Successfully');
        setpopUpErr(false);
        setLoader(false);
        navigation.navigate('Admin');
      } catch (e) {
        setIsVisible(true);
        setLoader(false);
        setOverlayText('Failed to updating company contact');
        setpopUpErr(true);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Update Company Contact</Text>
      {prevContact && (
        <View>
          <Text style={styles.label}>Current Address:</Text>
          <Text style={styles.value}>{prevContact.address}</Text>
          <Text style={styles.label}>Current Phone:</Text>
          <Text style={styles.value}>{prevContact.phone}</Text>
        </View>
      )}
      <View style={{marginTop: 50, marginHorizontal: 16}} />
      <Text style={styles.label}>New Phone:</Text>
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter new contact number"
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>New Address:</Text>
      <TextInput
        multiline={true}
        numberOfLines={3}
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter new address"
      />
      <TouchableOpacity style={styles.button} onPress={updateContact}>
        <Text style={styles.buttonText}>Update Contact</Text>
      </TouchableOpacity>

      <Overlay
        isVisible={isVisible}
        overlayStyle={{
          backgroundColor: 'white',
          borderColor: 'white',
          borderRadius: 20,
        }}
        onBackdropPress={() => setIsVisible(false)}>
        <FormSuccess
          errorBtn={() => setIsVisible(false)}
          successBtn={() => setIsVisible(false)}
          text={OverlayText}
          error={popUpErr}
        />
      </Overlay>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UpdateCC;
