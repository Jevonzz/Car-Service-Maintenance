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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-gesture-handler';
import {signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {Overlay} from '@rneui/base';
import BlankSpacer from 'react-native-blank-spacer';

import FormSuccess from './shared/formSuccess';
import Loader from './shared/loader';
import Colors from './const/color';
import {authentication} from '../firebase/firebase-config';

// TextField not empty validation function
const isValidObjField = obj => {
  return Object.values(obj).every(value => value.trim());
};

const LoginScreen = ({navigation, onPress}) => {
  const [userInfo, setUserInfo] = useState({email: '', password: ''});
  const {email, password} = userInfo;
  const [loader, setLoader] = useState(false);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);

  // Listens to auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authentication, user => {
      if (user) {
        navigation.replace('UserHome');
      }
    });
    return unsubscribe;
  }, []);

  // OnChangeText function for textfields
  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({...userInfo, [fieldName]: value});
  };

  // Function to validate user input
  const formValidation = () => {
    setLoader(true);
    if (!isValidObjField(userInfo)) {
      setOverlayText('Please enter your email and password');
      return setpopUpErr(true);
    }
    if (!email.includes('@')) {
      setOverlayText('Invalid email');
      return setpopUpErr(true);
    }
    return true;
  };

  // Function to sign in user
  const signInUser = () => {
    if (formValidation()) {
      signInWithEmailAndPassword(authentication, email, password)
        .then(userCredentials => {
          const user = userCredentials.user;
          console.log('Logged in with: ', user.email);
          setLoader(false);
        })
        .catch(e => {
          setLoader(false);
          setOverlayText('User Not Found');
          setpopUpErr(true);
        });
    } else setLoader(false);
  };

  return (
    <>
      <View style={styles.container}>
        <BlankSpacer height={16} />
        <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
        <Image style={styles.logo} source={require('../assets/img/Logo.png')} />

        {/* Username TextField */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={value => handleOnChangeText(value, 'email')}
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

        <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text
              style={{
                color: Colors.grey,
                fontSize: 12,
                marginTop: 12,
                alignSelf: 'flex-end',
                paddingRight: 60,
              }}>
              Forgotten Password ?
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.loginButton}>
          <TouchableOpacity onPress={signInUser}>
            <View style={styles.buttonContainer}>
              <Text
                style={{color: Colors.white, fontSize: 20, fontWeight: 'bold'}}>
                Log In
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          <Text style={{fontSize: 13, marginTop: 12, color: Colors.grey}}>
            {' '}
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text
              style={{
                fontSize: 13,
                marginTop: 12,
                paddingLeft: 4,
                color: 'black',
                fontWeight: 'bold',
                textDecorationLine: 'underline',
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loader ? <Loader /> : null}

      <Overlay
        isVisible={popUpErr}
        overlayStyle={{
          backgroundColor: 'white',
          borderColor: 'white',
          borderRadius: 20,
        }}
        onBackdropPress={() => setpopUpErr(false)}>
        <FormSuccess
          errorBtn={() => setpopUpErr(false)}
          text={OverlayText}
          error={popUpErr}
        />
      </Overlay>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  logo: {
    alignSelf: 'center',
    height: 200,
    width: 200,
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
  input: {},
  loginButton: {
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 15,
  },
});

export default LoginScreen;
