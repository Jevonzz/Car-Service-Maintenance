import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {firebaseDB} from '../../firebase/firebase-config';
import {
  updateDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  collection,
} from 'firebase/firestore/lite';
import Colors from '../const/color';

const ManageStockScreen = ({navigation}) => {
  const [stocks, setStocks] = useState([]);

  // Fetch the list of stocks from the Firestore database on screen load
  useEffect(() => {
    const stockRef = collection(firebaseDB, 'stock');
    const fetchStocks = async () => {
      const querySnapshot = await getDocs(stockRef);
      const stocks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStocks(stocks);
    };
    fetchStocks();
  }, []);

  const renderStockItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.stockItem}
        onPress={() =>
          navigation.navigate('UpdateStock', {
            id: item.id,
            name: item.name,
            price: item.price,
          })
        }>
        <Text style={styles.stockItemName}>{item.name}</Text>
        <Text style={styles.stockItemQuantity}>{item.price}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Stock</Text>
      <View style={styles.Rectangle} />
      <View style={styles.stockContainer}>
        <FlatList
          data={stocks}
          renderItem={renderStockItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerText}>Stock Name</Text>
              <Text style={styles.headerText}>Price</Text>
            </View>
          }
        />
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddStock')}>
        <Text style={styles.addButtonText}>Add Stock</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  stockContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 30,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  stockItemName: {
    fontSize: 16,
  },
  stockItemQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default ManageStockScreen;
