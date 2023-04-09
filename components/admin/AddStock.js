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

const AddStockScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleAddStock = async () => {
    const stockRef = collection(firebaseDB, 'stock');
    try {
      await addDoc(stockRef, {name, quantity: parseInt(quantity)});
      setOverlayText('Stock has successfully added');
      setpopUpErr(false);
      setIsVisible(true);
      navigation.navigate('ManageStock');
    } catch (error) {
      setOverlayText('Error Adding Stock');
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Stock Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter stock name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.label}>Quantity</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddStock}>
        <Text style={styles.addButtonText}>Add Stock</Text>
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

export default AddStockScreen;
