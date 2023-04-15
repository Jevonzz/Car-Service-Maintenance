import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import React, {Component, useState, useEffect} from 'react';
import {firebaseDB, authentication} from '../../../firebase/firebase-config';
import {doc, updateDoc} from 'firebase/firestore/lite';
import {Overlay} from '@rneui/base';
import FormSuccess from '../../shared/formSuccess';

const EditProfile = ({navigation, route}) => {
  const [name, setName] = useState(route.params.name);
  const [email, setEmail] = useState(route.params.email);
  const [phone, setPhone] = useState(route.params.phone);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      // Update the user's display name and email
      const userRef = doc(firebaseDB, 'users', authentication.currentUser.uid);
      await updateDoc(userRef, {
        name: name,
        email: email,
        phone: phone,
      });

      // Update the user's email address in Firebase authentication
      const user = authentication.currentUser;
      if (user.email !== email) {
        await user.updateEmail(email);
      }
      if (user.name !== name) {
        await user.updateProfile({displayName: name});
      }

      setOverlayText('Profile has successfully updated');
      setpopUpErr(false);
      setIsVisible(true);
      navigation.navigate('ProfileScreen');
    } catch (error) {
      setOverlayText('Error updating the profile');
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit Your Profile Here </Text>
      <Text style={styles.title}>Name :</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.title}>Email :</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.title}>Phone Number :</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateProfile}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
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
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 50,
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default EditProfile;
