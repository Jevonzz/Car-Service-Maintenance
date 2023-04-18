import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {firebaseDB} from '../../firebase/firebase-config';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore/lite';
import Colors from '../const/color';

const FetchCompletedAppointments = ({navigation}) => {
  const [appointments, setAppointments] = useState([]);

  //Fetch the list of appointments from the Firestore database on screen load
  useEffect(() => {
    const appointmentRef = collection(firebaseDB, 'appointments');
    const q = query(
      appointmentRef,
      where('status', '==', 'Completed'),
      where('paymentStatus', '==', 'Pending'),
    );
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(q);
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(appointments);
    };
    fetchAppointments();
  }, []);

  // Navigate the user to the CreateCSB screen and pass the appointment data as props
  const handleAppointmentPress = appointment => {
    navigation.navigate('CreateCSB', {appointment: appointment});
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Car Service Billing </Text>
        <View style={styles.Rectangle} />
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <TouchableOpacity
              key={appointment.id}
              style={styles.appointmentContainer}
              onPress={() => handleAppointmentPress(appointment)}>
              <Text style={styles.appointmentTitle}>
                {appointment.brand} ({appointment.model}) {appointment.carPlate}
              </Text>
              <Text style={styles.appointmentDetail}>
                Date & Time: {appointment.date} {appointment.time}
              </Text>
              <Text style={styles.appointmentStatus}>
                Payment Status: {appointment.paymentStatus}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.empty}>No Car Service Available</Text>
        )}
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
  empty: {
    fontSize: 17,
    margin: 20,
    textAlign: 'center',
  },
  formContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  appointmentContainer: {
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#F6F6F6',
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  appointmentDetail: {
    fontSize: 16,
  },
  appointmentStatus: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FetchCompletedAppointments;
