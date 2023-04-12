import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {firebaseDB} from '../../firebase/firebase-config';
import {collection, getDocs, doc, updateDoc} from 'firebase/firestore/lite';

const ManageAppointment = ({navigation}) => {
  const [appointments, setAppointments] = useState([]);

  //Fetch the list of appointments from the Firestore database on screen load
  useEffect(() => {
    const appointmentRef = collection(firebaseDB, 'appointments');
    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(appointmentRef);
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(appointments);
    };
    fetchAppointments();
  }, []);

  const acceptAppointment = async id => {
    const appointmentRef = doc(firebaseDB, 'appointments', id);
    await updateDoc(appointmentRef, {status: 'Accepted'});
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id
        ? {...appointment, status: 'Accepted'}
        : appointment,
    );
    setAppointments(updatedAppointments);
  };

  const declineAppointment = async id => {
    const appointmentRef = doc(firebaseDB, 'appointments', id);
    await updateDoc(appointmentRef, {status: 'Declined'});
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id
        ? {...appointment, status: 'Declined'}
        : appointment,
    );
    setAppointments(updatedAppointments);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Service Appointment List: </Text>

        {appointments.map(appointment => (
          <View key={appointment.id} style={styles.appointmentContainer}>
            <Text style={styles.appointmentTitle}>
              {appointment.carModel} ({appointment.carPlate})
            </Text>
            <Text style={styles.appointmentDetail}>
              Date: {appointment.date}
            </Text>
            <Text style={styles.appointmentDetail}>
              Time: {appointment.time}
            </Text>
            <Text style={styles.appointmentStatus}>
              Status: {appointment.status}
            </Text>
            {appointment.status === 'Pending' && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptAppointment(appointment.id)}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => declineAppointment(appointment.id)}>
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
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
  acceptButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  declineButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManageAppointment;
