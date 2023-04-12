import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {firebaseDB} from '../../firebase/firebase-config';
import {addDoc, collection} from 'firebase/firestore/lite';
import {Overlay} from '@rneui/base';
import FormSuccess from '../shared/formSuccess';

const AddCrew = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleAddStock = async () => {
    const CrewRef = collection(firebaseDB, 'crew');
    try {
      await addDoc(CrewRef, {name, email, phone, address});
      navigation.navigate('Admin');
      setOverlayText('Crew has successfully added');
      setpopUpErr(false);
      setIsVisible(true);
    } catch (error) {
      setOverlayText('Error Adding Crew');
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Crew Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Crew name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Phone Number"
        value={phone}
        keyboardType="numeric"
        onChangeText={setPhone}
      />
      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        multiline={true}
        numberOfLines={3}
        placeholder="Enter Address"
        value={address}
        onChangeText={setAddress}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddStock}>
        <Text style={styles.addButtonText}>Add Crew</Text>
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
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default AddCrew;
