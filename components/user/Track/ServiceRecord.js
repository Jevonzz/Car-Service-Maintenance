import {StyleSheet, Text, View, FlatList} from 'react-native';
import {useEffect, useState} from 'react';
import {collection, query, where, getDocs} from 'firebase/firestore/lite';
import Colors from '../../const/color';
import {authentication, firebaseDB} from '../../../firebase/firebase-config';

const ServiceRecord = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const appointmentRef = collection(firebaseDB, 'appointments');
      const q = query(
        appointmentRef,
        where('userId', '==', authentication.currentUser.uid),
        where('status', '==', 'Completed'),
      );
      const querySnapshot = await getDocs(q);
      const appointments = [];
      querySnapshot.forEach(doc => {
        appointments.push({...doc.data(), id: doc.id});
      });
      setAppointments(appointments);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Brand: {item.brand}</Text>
      <Text style={styles.itemText}>Model: {item.model}</Text>
      <Text style={styles.itemText}>Plate: {item.carPlate}</Text>
      <Text style={styles.itemText}>Date: {item.date}</Text>
      <Text style={styles.itemText}>Time: {item.time}</Text>
      <Text style={styles.itemText}>Status: {item.status}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.Rectangle} />
      <Text style={styles.title}>Car Service Record & Bill</Text>
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      ) : (
        <Text>No record found</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 10,
    marginBottom: 40,
  },
  list: {
    width: '100%',
  },
  itemContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default ServiceRecord;
