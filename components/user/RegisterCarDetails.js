import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {firebaseDB, authentication} from '../../firebase/firebase-config';
import {addDoc, collection} from 'firebase/firestore/lite';
import {Overlay} from '@rneui/base';
import FormSuccess from '../shared/formSuccess';

const RegisterCarDetails = ({navigation}) => {
  const [uid] = useState(authentication.currentUser.uid);
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleRegister = async () => {
    try {
      // Add new car document to Firestore with uid as the document id
      const carsRef = collection(firebaseDB, 'users', uid, 'cars');
      await addDoc(carsRef, {
        brand: carBrand,
        model: carModel,
        carPlate: carPlate,
        year: carYear,
      });
      navigation.navigate('UserScreen');
      setOverlayText('Successfully registered');
      setpopUpErr(false);
      setIsVisible(true);
    } catch (error) {
      setOverlayText('Error registering: ' + error.message);
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register your car details</Text>
      <Text style={styles.label}>Car Brand</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Car Brand"
        value={carBrand}
        onChangeText={setCarBrand}
      />
      <Text style={styles.label}>Car Model</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Car Model"
        value={carModel}
        onChangeText={setCarModel}
      />
      <Text style={styles.label}>Car Plate Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Car Plate Number"
        value={carPlate}
        onChangeText={setCarPlate}
      />
      <Text style={styles.label}>Car Manufacture Year</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Car Manufacture Year"
        value={carYear}
        keyboardType="numeric"
        onChangeText={setCarYear}
      />
      <TouchableOpacity
        style={styles.button}
        title="Register"
        onPress={handleRegister}>
        <Text style={styles.buttonText}>Register Car</Text>
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
    </View>
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
    margin: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default RegisterCarDetails;
