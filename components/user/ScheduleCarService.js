import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Button,
} from 'react-native';
import {firebaseDB, authentication} from '../../firebase/firebase-config';
import {
  collection,
  doc,
  addDoc,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore/lite';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Overlay} from '@rneui/base';
import FormSuccess from '../shared/formSuccess';

const ScheduleCarService = ({navigation}) => {
  const [cars, setCars] = useState([]);
  const [selectedCarId, setSelectedCarId] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

  const handleScheduleAppointment = async () => {
    try {
      // Schedule a car service appointment for the selected car and date
      const appointmentRef = collection(firebaseDB, 'appointments');
      const formattedDate = date.toLocaleDateString('en-GB'); // format the date as DD/MM/YYYY
      const formattedTime = formatTime(time); // format the time as HH:MM AM/PM
      await addDoc(appointmentRef, {
        userId: authentication.currentUser.uid,
        brand: selectedCar.brand,
        model: selectedCar.model,
        carPlate: selectedCar.carPlate,
        date: formattedDate,
        time: formattedTime,
        status: 'Pending',
      });
      setOverlayText(
        'Successfully Booked Car Service - Waiting Crew to Accept',
      );
      setpopUpErr(false);
      setIsVisible(true);
    } catch (error) {
      setOverlayText('Error Booking Car Service: ' + error.message);
      setpopUpErr(true);
      setIsVisible(true);
    }
  };

  const handleDateChange = (event, newDate) => {
    if (newDate !== undefined) {
      setDate(newDate);
    } else {
      setDate(null);
    }
    setIsDatePickerVisible(false);
  };

  const handleTimeChange = (event, newTime) => {
    if (newTime !== undefined) {
      const maxTime = new Date(); // get the current time
      maxTime.setHours(17); // set the maximum time to 6:00 PM
      maxTime.setMinutes(0);
      const minTime = new Date(); // get the current time
      minTime.setHours(8); // set the minimum time to 8:00 AM
      minTime.setMinutes(0);
      if (newTime >= maxTime) {
        // time selected is after the maximum time
        setTime(maxTime);
      } else if (newTime < minTime) {
        // time selected is before the minimum time
        setTime(minTime);
      } else {
        setTime(newTime);
      }
    } else {
      setTime(null);
    }
    setIsTimePickerVisible(false);
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const showTimePicker = () => {
    setIsTimePickerVisible(true);
  };

  const formatDate = date => {
    if (!date || !(date instanceof Date)) {
      return '';
    }
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const formatTime = time => {
    if (!time) {
      return '';
    }
    const hours = time.getHours();
    const minutes = ('0' + time.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  };

  // Find the selected car
  const selectedCar = cars.find(car => car.id === selectedCarId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule Car Service</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Car:</Text>
        <View style={styles.dropdown}>
          {selectedCar ? (
            <TextInput
              style={styles.dropdownText}
              placeholder="Select car"
              value={`${selectedCar.brand} (${selectedCar.model}) ${selectedCar.carPlate}`}
              editable={false}
            />
          ) : (
            <TextInput
              style={styles.dropdownText}
              placeholder="Select car"
              editable={false}
            />
          )}
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() =>
              navigation.navigate('SelectCar', {setSelectedCarId})
            }>
            <Text style={styles.dropdownButtonText}>Choose</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity onPress={showDatePicker}>
          <Text style={styles.date}>{formatDate(date)}</Text>
        </TouchableOpacity>
        {isDatePickerVisible && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            format="DD/MM/YYYY"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.alert}>
          Business Hour Starting From 9AM to 5PM{' '}
        </Text>
        <TouchableOpacity onPress={showTimePicker}>
          <Text style={styles.date}>{formatTime(time)}</Text>
        </TouchableOpacity>
        {isTimePickerVisible && (
          <DateTimePicker
            value={time || new Date()}
            mode="time"
            display="spinner"
            onChange={handleTimeChange}
          />
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleScheduleAppointment}>
        <Text style={styles.buttonText}>Schedule Appointment</Text>
      </TouchableOpacity>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alert: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  dropdownText: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  dropdownButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginLeft: 10,
  },
  dropdownButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  date: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default ScheduleCarService;
