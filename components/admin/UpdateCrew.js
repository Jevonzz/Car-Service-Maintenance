import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {firebaseDB} from '../../firebase/firebase-config';
import {updateDoc, doc, deleteDoc} from 'firebase/firestore/lite';
import Colors from '../const/color';
import {Overlay} from '@rneui/base';
import FormSuccess from '../shared/formSuccess';

const UpdateCrew = ({route, navigation}) => {
  const [name, setName] = useState(route.params.name);
  const [email, setEmail] = useState(route.params.email);
  const [phone, setPhone] = useState(route.params.phone);
  const [address, setAddress] = useState(route.params.address);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleUpdateCrew = async () => {
    try {
      const crewRef = doc(firebaseDB, 'crew', route.params.id);
      await updateDoc(crewRef, {
        name: name,
        email: email,
        phone: phone,
        address: address,
      });
      navigation.navigate('Admin');
      setOverlayText('Crew has successfully updated');
      setpopUpErr(false);
      setIsVisible(true);
    } catch (error) {
      setOverlayText('Error updating the crew');
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  const handleDeleteCrew = async () => {
    try {
      const crewRef = doc(firebaseDB, 'crew', route.params.id);
      await deleteDoc(crewRef);
      setOverlayText('Crew has successfully deleted');
      setpopUpErr(false);
      setIsVisible(true);
      navigation.navigate('Admin');
    } catch (error) {
      setOverlayText('Error deleting the crew');
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Crew</Text>
      <View style={styles.Rectangle} />
      <View style={styles.CContainer}>
        <Text style={styles.label}>Crew Name:</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />
        <Text style={styles.label}>Email:</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          value={address}
          multiline={true}
          numberOfLines={3}
          onChangeText={setAddress}
        />

        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateCrew}>
          <Text style={styles.updateButtonText}>Update Crew</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteCrew}>
          <Text style={styles.deleteButtonText}>Delete Crew</Text>
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
    top: -0,
    left: 0,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    backgroundColor: Colors.primary,
    width: '100%',
    height: 50,
    zIndex: -1,
  },
  CContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
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
    marginBottom: 10,
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
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default UpdateCrew;
