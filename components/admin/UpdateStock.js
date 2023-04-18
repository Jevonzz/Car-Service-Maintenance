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
import {Overlay} from '@rneui/base';
import FormSuccess from '../shared/formSuccess';

const UpdateStockScreen = ({route, navigation}) => {
  const [name, setName] = useState(route.params.name);
  const [price, setPrice] = useState(route.params.price);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleUpdateStock = async () => {
    try {
      const stockRef = doc(firebaseDB, 'stock', route.params.id);
      await updateDoc(stockRef, {
        name: name,
        price: price,
      });
      navigation.navigate('Admin');
      setOverlayText('Stock has successfully updated');
      setpopUpErr(false);
      setIsVisible(true);
      
    } catch (error) {
      setOverlayText('Error updating the stock');
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  const handleDeleteStock = async () => {
    try {
      const stockRef = doc(firebaseDB, 'stock', route.params.id);
      await deleteDoc(stockRef);
      navigation.navigate('Admin');
      setOverlayText('Stock has successfully deleted');
      setpopUpErr(false);
      setIsVisible(true);
    } catch (error) {
      setOverlayText('Error deleting the stock');
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Stock Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        value={price.toString()}
        onChangeText={value => setPrice(parseInt(value))}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateStock}>
        <Text style={styles.updateButtonText}>Update Stock</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteStock}>
        <Text style={styles.deleteButtonText}>Delete Stock</Text>
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

export default UpdateStockScreen;
