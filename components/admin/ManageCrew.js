import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Colors from '../const/color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {firebaseDB, authentication} from '../../firebase/firebase-config';
import {
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
} from 'firebase/firestore/lite';

const ManageCrew = ({navigation}) => {
  const [crewList, setCrewList] = useState([]);
  const [newCrew, setNewCrew] = useState('');

  //Fetch the list of crew from the Firestore database on screen load
  useEffect(() => {
    const crewRef = collection(firebaseDB, 'crew');
    const fetchCrew = async () => {
      const querySnapshot = await getDocs(crewRef);
      const crews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCrewList(crews);
    };
    fetchCrew();
  }, []);

  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Service Crew List </Text>
        <View style={styles.Rectangle} />
        <View style={styles.CContainer}>
          {crewList.map(crew => (
            <TouchableOpacity
              key={crew.id}
              onPress={() =>
                navigation.navigate('UpdateCrew', {
                  id: crew.id,
                  name: crew.name,
                  email: crew.email,
                  phone: crew.phone,
                  address: crew.address,
                })
              }>
              <View style={styles.crewContainer}>
                <Text style={styles.crewName}>{crew.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddCrew')}>
          <Text style={styles.addButtonText}>Add Crew</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
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
  CContainer: {
    padding: 20,
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
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    borderTopColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  crewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#F6F6F6',
  },
  crewName: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ManageCrew;
