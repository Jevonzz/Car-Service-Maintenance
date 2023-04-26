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
import Colors from '../../const/color';

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
      <View style={styles.Rectangle} />
      <Text style={styles.title}>Edit Your Profile Here </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name :</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.label}>Email :</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Phone Number :</Text>
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
      </View>
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
  },
  Rectangle: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: Colors.primary,
    width: '100%',
    height: '10%',
    zIndex: -1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  inputContainer: {
    padding: 20,
  },
  label: {
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
