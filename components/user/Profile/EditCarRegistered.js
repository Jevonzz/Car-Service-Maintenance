import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import {firebaseDB, authentication} from '../../../firebase/firebase-config';
import {updateDoc, doc, deleteDoc, collection} from 'firebase/firestore/lite';
import {Overlay} from '@rneui/base';
import FormSuccess from '../../shared/formSuccess';
import Colors from '../../const/color';

const EditCarRegistered = ({route, navigation}) => {
  const [brand, setBrand] = useState(route.params.brand);
  const [model, setModel] = useState(route.params.model);
  const [carPlate, setcarPlate] = useState(route.params.carPlate);
  const [year, setYear] = useState(route.params.year);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleUpdateCar = async () => {
    try {
      // Fetch cars collection data
      const carsRef = doc(
        firebaseDB,
        'users',
        authentication.currentUser.uid,
        'cars',
        route.params.id,
      );

      await updateDoc(carsRef, {
        brand: brand,
        model: model,
        carPlate: carPlate,
        year: year,
      });

      navigation.navigate('ProfileScreen');
      setOverlayText('Car Information has successfully updated');
      setpopUpErr(false);
      setIsVisible(true);
    } catch (error) {
      setOverlayText('Error updating the Car Information');
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  const handleDeleteCar = async () => {
    try {
      // Fetch cars collection data
      const carsRef = doc(
        firebaseDB,
        'users',
        authentication.currentUser.uid,
        'cars',
        route.params.id,
      );
      await deleteDoc(carsRef);

      navigation.navigate('ProfileScreen');
      setOverlayText('Car Information has successfully deleted');
      setpopUpErr(false);
      setIsVisible(true);
    } catch (error) {
      setOverlayText('Error deleting the Car Information');
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Rectangle} />
      <Text style={styles.title}>Edit Your Car Detail Here </Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Brand: </Text>
        <TextInput style={styles.input} value={brand} onChangeText={setBrand} />
        <Text style={styles.label}>Model: </Text>
        <TextInput style={styles.input} value={model} onChangeText={setModel} />
        <Text style={styles.label}>Car Plate: </Text>
        <TextInput
          style={styles.input}
          value={carPlate}
          onChangeText={setcarPlate}
        />
        <Text style={styles.label}>Year: </Text>
        <TextInput
          style={styles.input}
          value={year.toString()}
          onChangeText={value => setYear(parseInt(value))}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateCar}>
          <Text style={styles.updateButtonText}>Update Car Information</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteCar}>
          <Text style={styles.deleteButtonText}>Delete Car Information</Text>
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

export default EditCarRegistered;
