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

const ManageAppointment = ({navigation}) => {
  const [appointments, setAppointments] = useState([]);

  //Fetch the list of appointments from the Firestore database on screen load
  useEffect(() => {
    const appointmentRef = collection(firebaseDB, 'appointments');
    const q = query(appointmentRef, where('status', '==', 'Pending'));
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

  const EndAppointment = async id => {
    const appointmentRef = doc(firebaseDB, 'appointments', id);
    await updateDoc(appointmentRef, {paymentStatus: 'Paid'});
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id
        ? {...appointment, paymentStatus: 'Paid'}
        : appointment,
    );
    setAppointments(updatedAppointments);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.Rectangle} />
        <Text style={styles.title}>Service Appointment List </Text>

        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <View key={appointment.id} style={styles.appointmentContainer}>
              <Text style={styles.appointmentTitle}>
                {appointment.brand} ({appointment.model}) {appointment.carPlate}
              </Text>
              <Text style={styles.appointmentDetail}>
                Date & Time: {appointment.date} {appointment.time}
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
              {appointment.paymentStatus === 'Waiting Payment' && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => EndAppointment(appointment.id)}>
                    <Text style={styles.buttonText}>Paid</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No Appointment Available</Text>
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
