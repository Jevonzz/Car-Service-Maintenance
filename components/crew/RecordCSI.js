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

const RecordCSI = () => {
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [appointmentId, setAppointmentId] = useState(null);

  // Fetch the list of appointments & bills from the Firestore database on screen load
  useEffect(() => {
    const appointmentRef = collection(firebaseDB, 'appointments');
    const q = query(appointmentRef, where('status', '==', 'Completed'));

    const fetchAppointments = async () => {
      const querySnapshot = await getDocs(q);
      const appointments = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      

      const bills = [];
      for (const appointment of appointments) {
        const billRef = collection(
          firebaseDB,
          'appointments',
          appointment.id,
          'bills',
        );
        const billQuerySnapshot = await getDocs(billRef);
        const appointmentBills = billQuerySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        bills.push(appointmentBills);
      }

      setAppointments(appointments);
      setBills(bills);
    };

    fetchAppointments();
  }, []);

  const EndAppointment = async id => {
    const appointmentRef = doc(firebaseDB, 'appointments', id);
    await updateDoc(appointmentRef, {paymentStatus: 'Paid'});
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id
        ? {...appointment, paymentStatus: 'Paid'}
        : appointment,
    );
    setAppointments(updatedAppointments);
    setAppointmentId(id);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.Rectangle} />
        <Text style={styles.title}>Records of Completed Car Service </Text>
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <View key={appointment.id} style={styles.appointmentContainer}>
              <Text style={styles.appointmentTitle}>
                {appointment.brand} ({appointment.model}) {appointment.carPlate}
              </Text>
              <Text style={styles.appointmentDetail}>
                Date & Time: {appointment.date} {appointment.time}
              </Text>
              <Text style={styles.appointmentStatus}>
                Payment Status: {appointment.paymentStatus}
              </Text>
              <Text />
              <Text style={styles.appointmentStatus}>
                Part Name & Quantity:
              </Text>
              {bills[index] && bills[index].length > 0 && (
                <View>
                  {bills[index].map(bill => (
                    <View key={bill.id}>
                      <Text>
                        {bill.name} ({bill.quantity})
                      </Text>
                    </View>
                  ))}
                  <Text />
                  <Text style={styles.appointmentStatus}>
                    Total Price: RM
                    {bills[index].reduce(
                      (acc, bill) => acc + bill.totalPrice,
                      0,
                    )}
                  </Text>
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

export default RecordCSI;
