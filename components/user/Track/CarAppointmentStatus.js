import {StyleSheet, Text, View, FlatList} from 'react-native';
import {useEffect, useState} from 'react';
import {collection, query, where, getDocs} from 'firebase/firestore/lite';
import Colors from '../../const/color';
import {authentication, firebaseDB} from '../../../firebase/firebase-config';

const CarAppointmentStatus = () => {
  const [appointments, setAppointments] = useState([]);

  const getAppointments = async () => {
    try {
      const appointmentRef = collection(firebaseDB, 'appointments');
      const q = query(
        appointmentRef,
        where('userId', '==', authentication.currentUser.uid),
        where('status', '!=', 'Completed'),
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
      <Text style={styles.itemText}>
        Car: {item.brand} {item.model} ({item.carPlate})
      </Text>
      <Text style={styles.itemText}>
        Date & Time: {item.date} {item.time}
      </Text>
      <Text style={styles.itemText}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.Rectangle} />
      <Text style={styles.title}>Appointment Status</Text>
      <View style={styles.inputContainer}>
        {appointments.length > 0 ? (
          <FlatList
            data={appointments}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            style={styles.list}
          />
        ) : (
          <Text>No appointments found</Text>
        )}
      </View>
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
  inputContainer: {
    padding: 20,
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 30,
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
    backgroundColor: '#d3d3d3',
  },
  itemText: {
    fontSize: 16,
  },
});
export default CarAppointmentStatus;
