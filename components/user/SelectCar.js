import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {firebaseDB, authentication} from '../../firebase/firebase-config';
import {collection, getDocs} from 'firebase/firestore/lite';
import Colors from '../const/color';

const SelectCar = ({navigation, route}) => {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    // Fetch the cars registered by the current user
    const fetchCars = async () => {
      try {
        const userCarsRef = collection(
          firebaseDB,
          'users',
          authentication.currentUser.uid,
          'cars',
        );
        const snapshot = await getDocs(userCarsRef);
        const carsData = snapshot.docs.map(doc => {
          return {id: doc.id, ...doc.data()};
        });
        setCars(carsData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCars();
  }, []);

  const handleCarSelect = carId => {
    // Set the selected car ID and navigate back to the previous screen
    route.params.setSelectedCarId(carId);
    navigation.goBack();
  };

  const renderCarItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.carItem}
        onPress={() => handleCarSelect(item.id)}>
        <Text style={styles.carMakeModel}>
          {item.brand} ({item.model}) {item.carPlate}
        </Text>
        <Text style={styles.carYear}>{item.year}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.Rectangle} />
      <Text style={styles.title}>Select Your Car Here</Text>
      <View style={styles.inputContainer}>
        <FlatList
          data={cars}
          renderItem={renderCarItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  carItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 10,
  },
  carMakeModel: {
    flex: 1,
    fontSize: 18,
  },
  carYear: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SelectCar;
