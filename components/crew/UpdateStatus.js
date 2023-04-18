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
  whereIn,
} from 'firebase/firestore/lite';
import Colors from '../const/color';

const UpdateStatus = () => {
  const [appointments, setAppointments] = useState([]);

  //Fetch the list of appointments from the Firestore database on screen load
  useEffect(() => {
    const appointmentRef = collection(firebaseDB, 'appointments');
    const q = query(
      appointmentRef,
      where('status', 'in', ['Accepted', 'In Progress']),
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

  const completeAppointment = async id => {
    const appointmentRef = doc(firebaseDB, 'appointments', id);
    await updateDoc(appointmentRef, {status: 'Completed'});
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id
        ? {...appointment, status: 'Completed'}
        : appointment,
    );
    setAppointments(updatedAppointments);
  };

  const inProgressAppointments = async id => {
    const appointmentRef = doc(firebaseDB, 'appointments', id);
    await updateDoc(appointmentRef, {status: 'In Progress'});
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id
        ? {...appointment, status: 'In Progress'}
        : appointment,
    );
    setAppointments(updatedAppointments);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.Rectangle} />
        <Text style={styles.title}>Update Service Status </Text>
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <View key={appointment.id} style={styles.appointmentContainer}>
              <Text style={styles.appointmentTitle}>
                {appointment.brand} ({appointment.model}) {appointment.carPlate}
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
              {appointment.status === 'Accepted' && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => completeAppointment(appointment.id)}>
                    <Text style={styles.buttonText}>Completed</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineButton}
                    onPress={() => inProgressAppointments(appointment.id)}>
                    <Text style={styles.buttonText}>In Progress</Text>
                  </TouchableOpacity>
                </View>
              )}
              {appointment.status === 'In Progress' && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => completeAppointment(appointment.id)}>
                    <Text style={styles.buttonText}>Completed</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
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
    backgroundColor: 'blue',
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

export default UpdateStatus;
