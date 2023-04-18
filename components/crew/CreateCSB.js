import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {firebaseDB} from '../../firebase/firebase-config';
import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  query,
  where,
} from 'firebase/firestore/lite';
import Colors from '../const/color';
import {Picker} from '@react-native-picker/picker';
import InputSpinner from 'react-native-input-spinner';
import {Overlay} from '@rneui/base';
import FormSuccess from '../shared/formSuccess';

const CreateCSB = ({route, navigation}) => {
  const {appointment} = route.params;
  const [parts, setParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedPartQuantity, setSelectedPartQuantity] = useState(0);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  //Fetch stock information
  useEffect(() => {
    const partsRef = collection(firebaseDB, 'stock');
    const fetchParts = async () => {
      const querySnapshot = await getDocs(partsRef);
      const parts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setParts(parts);
    };

    fetchParts();
  }, []);

  // select handler
  const handleSelectPart = useCallback(
    (partId, partPrice, num) => {
      const isSelected = selectedParts.some(p => p.id === partId);
      if (isSelected) {
        const newSelectedParts = selectedParts.map(p => {
          if (p.id === partId) {
            return {...p, quantity: num};
          } else {
            return p;
          }
        });
        setSelectedParts(newSelectedParts);
      } else {
        const part = {
          id: partId,
          name: parts.find(p => p.id === partId)?.name,
          price: partPrice,
          quantity: num,
        };
        setSelectedParts([...selectedParts, part]);
      }
    },
    [selectedParts, setSelectedParts, parts],
  );

  //pick handler
  const handlePickerSelect = part => {
    setSelectedPart(part);
    setSelectedPartQuantity(
      selectedParts.find(p => p.id === part.id)?.quantity || 0,
    );
  };

  //Listening to price changes
  useEffect(() => {
    let newTotalPrice = 0;
    selectedParts.forEach(part => {
      const partPrice = parts.find(p => p.id === part.id)?.price || 0;
      newTotalPrice += part.quantity * partPrice;
    });
    setTotalPrice(newTotalPrice);
  }, [selectedParts, parts]);

  // create bill for each selected part
  const onPressCreateCSB = async () => {
    try {
      const appointmentRef = doc(firebaseDB, 'appointments', appointment.id);
      const billsRef = collection(appointmentRef, 'bills');
      const billRefs = await Promise.all(
        selectedParts.map(async part => {
          const billRef = await addDoc(billsRef, {
            name: part.name,
            quantity: part.quantity,
            price: part.price,
            totalPrice: part.price * part.quantity,
          });
          return billRef;
        }),
      );
      setSelectedParts([]);
      setTotalPrice(0);

      const AppRef = await updateDoc(appointmentRef, {
        paymentStatus: 'Waiting Payment',
      });

      navigation.navigate('Crew');
      setOverlayText('Bills have been created successfully');
      setpopUpErr(false);
      setIsVisible(true);
    } catch (e) {
      setOverlayText('Failed to create bills - ' + e.message);
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Car Service Bill </Text>
        <View style={styles.Rectangle} />
        {parts.length > 0 ? (
          <View>
            <Picker
              selectedValue={selectedPart}
              onValueChange={handlePickerSelect}>
              <Picker.Item label="Select Part" value={null} />
              {parts.map(part => (
                <Picker.Item key={part.id} label={part.name} value={part} />
              ))}
            </Picker>
            {selectedPart && (
              <View style={styles.partContainer}>
                <Text style={styles.partTitle}>{selectedPart.name}</Text>
                <Text style={styles.partDetail}>
                  Price: {selectedPart.price}
                </Text>
                <InputSpinner
                  min={0}
                  step={1}
                  value={selectedPartQuantity}
                  rounded={false}
                  showBorder
                  colorMin={'#40c5f4'}
                  onChange={num =>
                    handleSelectPart(selectedPart.id, selectedPart.price, num)
                  }
                />
              </View>
            )}
            {selectedParts.length > 0 && (
              <View style={styles.selectedPartsContainer}>
                <Text style={styles.selectedPartsTitle}>Selected Parts:</Text>
                {selectedParts.map(part => (
                  <View key={part.id} style={styles.selectedPart}>
                    <Text style={styles.selectedPartName}>
                      {parts.find(p => p.id === part.id)?.name}
                    </Text>
                    <Text style={styles.selectedPartQuantity}>
                      x{part.quantity}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.empty}>No Parts Available</Text>
        )}
        {selectedParts.length > 0 && (
          <View style={styles.priceContainer}>
            <Text style={styles.totalPrice}>Total Price: RM{totalPrice}</Text>
            <TouchableOpacity style={styles.button} onPress={onPressCreateCSB}>
              <Text style={styles.buttonText}>Create Bill</Text>
            </TouchableOpacity>
          </View>
        )}

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
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  partContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  partTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  partDetail: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectedPartsContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedPartsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  selectedPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
  },
  selectedPartName: {
    fontSize: 16,
  },
  selectedPartQuantity: {
    fontSize: 16,
    color: '#888',
  },
  priceContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4285F4',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
});
export default CreateCSB;
