import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useEffect, useState} from 'react';
import {collection, query, where, getDocs} from 'firebase/firestore/lite';
import Colors from '../../const/color';
import {authentication, firebaseDB} from '../../../firebase/firebase-config';

const ServiceRecord = () => {
  const [appointments, setAppointments] = useState([]);
  const [billItems, setBillItems] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const getBillItems = async () => {
    try {
      const appointmentRef = collection(
        firebaseDB,
        'appointments',
        selectedAppointment.id,
        'bills',
      );
      const querySnapshot = await getDocs(appointmentRef);
      const billItems = [];
      querySnapshot.forEach(doc => {
        billItems.push(doc.data());
      });
      setBillItems(billItems);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(billItems);

  useEffect(() => {
    getAppointments();
  }, []);

  useEffect(() => {
    if (selectedAppointment) {
      getBillItems();
    }
  }, [selectedAppointment]);

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        setSelectedAppointment(item);
        setShowModal(true);
      }}>
      <Text style={styles.itemText}>
        Car: {item.brand} {item.model} ({item.carPlate})
      </Text>
      <Text style={styles.itemText}>
        Date & Time: {item.date} {item.time}
      </Text>
      <Text style={styles.itemText}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
  };

  const renderBillItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>
        {item.quantity} x RM{item.price}
      </Text>
      <Text style={styles.itemText}>RM{item.totalPrice}</Text>
    </View>
  );

  const totalPrice = billItems.reduce((acc, item) => {
    return acc + item.quantity * item.price;
  }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.Rectangle} />
      <Text style={styles.title}>Car Service Record & Bill</Text>
      <View style={styles.inputContainer}>
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

      <Modal visible={selectedAppointment !== null} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalHeaderText}>Detailed Record & Bill</Text>
            <View style={{width: 60}} />
          </View>
          {billItems.length > 0 ? (
            <View style={styles.modalContent}>
              <FlatList
                data={billItems}
                renderItem={renderBillItem}
                keyExtractor={item => item.id}
                style={styles.list}
              />
              <Text style={styles.totalText}>Total: RM{totalPrice}</Text>
            </View>
          ) : (
            <Text>No bill items found</Text>
          )}
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  closeButtonText: {
    fontSize: 16,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
  },
  billItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  billItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  billItemQuantity: {
    fontSize: 16,
    color: '#666',
  },
  billItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ServiceRecord;
