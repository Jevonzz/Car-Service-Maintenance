import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Image,
  useWindowDimensions,
  TextBase,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-gesture-handler';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import {Overlay} from '@rneui/base';
import {doc, setDoc} from 'firebase/firestore/lite';

import BlankSpacer from 'react-native-blank-spacer';
import FormSuccess from './shared/formSuccess';
import Loader from './shared/loader';
import Colors from './const/color';
import {authentication, firebaseDB} from '../firebase/firebase-config';

// TextField not empty validation function
const isValidObjField = obj => {
  return Object.values(obj).every(value => value.trim());
};

const RegisterScreen = ({navigation, onPress}) => {
  const [userInfo, setUserInfo] = useState({
    fullname: '',
    phone_num: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const {fullname, phone_num, email, password, confirm_password} = userInfo;
  const [loader, setLoader] = useState(false);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Function to store user data from Firestore
  const query = async uid => {
    await setDoc(doc(firebaseDB, 'users', uid), {
      name: fullname,
      phoneNo: phone_num,
      email: email,
      uid: uid,
      role: 'user',
    });
  };

  // OnChangeText function for textfields
  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({...userInfo, [fieldName]: value});
  };

  // Function to validate user input
  const formValidation = () => {
    setLoader(true);
    var regName = /^[a-zA-Z]+$/;
    if (!isValidObjField(userInfo)) {
      setOverlayText('Please fill all fields');
      setIsVisible(true);
      setpopUpErr(true);
      return;
    }
    if (!regName.test(fullname)) {
      setOverlayText('Invalid name');
      setIsVisible(true);
      setpopUpErr(true);
      return;
    }
    if (phone_num.length < 10 || phone_num.length > 12) {
      setOverlayText('Invalid phone number');
      setIsVisible(true);
      setpopUpErr(true);
      return;
    }
    if (!email.includes('@')) {
      setOverlayText('Invalid email');
      setIsVisible(true);
      setpopUpErr(true);
      return;
    }
    if (password.length < 7) {
      setOverlayText('Minimum 8 characters required for password');
      setIsVisible(true);
      setpopUpErr(true);
      return;
    }
    if (password !== confirm_password) {
      setOverlayText('Passwords do not match');
      setIsVisible(true);
      setpopUpErr(true);
      return;
    }
    return true;
  };

  // Function to create new user
  const registerUser = () => {
    if (formValidation()) {
      createUserWithEmailAndPassword(authentication, email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          query(user.uid);
          setLoader(false);
          navigation.navigate('Login');
          setOverlayText('Sign up successfully');
          setIsVisible(true);
          setpopUpErr(false);
        })
        .catch(e => {
          setLoader(false);
          setOverlayText(e.message);
          setpopUpErr(true);
          setIsVisible(true);
        });
    } else setLoader(false);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />

        <BlankSpacer height={16} />
        <View>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 28,
              marginTop: 20,
              color: 'black',
              fontWeight: 'bold',
            }}>
            Let's Get You Registered !
          </Text>
        </View>

        {/* Fullname TextField */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Full Name"
            value={fullname}
            onChangeText={value => handleOnChangeText(value, 'fullname')}
            style={styles.input}
          />
        </View>

        {/* Phone Number TextField */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Phone Number"
            value={phone_num}
            onChangeText={value => handleOnChangeText(value, 'phone_num')}
            keyboardType={'phone-pad'}
            style={styles.input}
          />
        </View>

        {/* Email TextField */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={value => handleOnChangeText(value, 'email')}
            keyboardType={'email-address'}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        {/* Password TextField */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={value => handleOnChangeText(value, 'password')}
            autoCapitalize="none"
            secureTextEntry={true}
            style={styles.input}
          />
        </View>

        {/* Confirm Password TextField */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Confirm Password"
            value={confirm_password}
            onChangeText={value =>
              handleOnChangeText(value, 'confirm_password')
            }
            autoCapitalize="none"
            secureTextEntry={true}
            style={styles.input}
          />
        </View>

        <View style={{flexDirection: 'row', paddingTop: 20, paddingLeft: 10}}>
          <Text
            style={{fontSize: 12, color: Colors.lightblack, paddingLeft: 28}}>
            {' '}
            By registering, you confirm that you accept our{' '}
          </Text>
          <Text style={{fontSize: 12, color: Colors.primary}}>
            Terms of Use{' '}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingLeft: 10}}>
          <Text
            style={{fontSize: 12, color: Colors.lightblack, paddingLeft: 31}}>
            and
          </Text>
          <Text style={{fontSize: 12, color: Colors.primary}}>
            {' '}
            Privacy Policy.{' '}
          </Text>
        </View>

        <View style={styles.signUpButton}>
          <TouchableOpacity onPress={registerUser}>
            <View style={styles.buttonContainer}>
              <Text
                style={{color: Colors.white, fontSize: 20, fontWeight: 'bold'}}>
                Sign Up
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Text style={{fontSize: 13, marginTop: 12, color: Colors.grey}}>
            {' '}
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{
                fontSize: 13,
                marginTop: 12,
                paddingLeft: 4,
                color: 'black',
                fontWeight: 'bold',
                textDecorationLine: 'underline',
              }}>
              Log In
            </Text>
          </TouchableOpacity>
        </View>

        {loader ? <Loader /> : null}

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
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  backNav: {
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  inputContainer: {
    marginTop: 15,
    alignSelf: 'center',
    paddingLeft: 20,
    height: 50,
    width: 330,
    elevation: 25,
    borderRadius: 30,
    backgroundColor: Colors.white,
    borderWidth: 0,
  },
  signUpButton: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 15,
  },
});

export default RegisterScreen;
