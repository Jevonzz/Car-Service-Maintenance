import React, {Component, useState} from 'react';
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
import {sendPasswordResetEmail} from 'firebase/auth';
import {Overlay} from '@rneui/base';

import FormSuccess from './shared/formSuccess';
import Colors from './const/color';

import {authentication} from '../firebase/firebase-config';

const isValidObjField = obj => {
  return Object.values(obj).every(value => value.trim());
};

const ForgotPasswordScreen = ({navigation, onPress}) => {
  const [userInfo, setUserInfo] = useState({email: ''});
  const [error, setError] = useState('');
  const {email} = userInfo;
  const [isVisible, setIsVisible] = useState(false);
  const [OverlayText, setOverlayText] = useState('');
  const [popUpErr, setpopUpErr] = useState(false);

  // OnChangeText function for textfields
  const handleOnChangeText = (value, fieldName) => {
    setUserInfo({...userInfo, [fieldName]: value});
  };

  // Function to validate user input
  const formValidation = () => {
    if (!isValidObjField(userInfo)) {
      setOverlayText('Please enter your email');
      setpopUpErr(true);
      return setIsVisible(true);
    }
    if (!email.includes('@')) {
      setOverlayText('Invalid email');
      setpopUpErr(true);
      return setIsVisible(true);
    }
    return true;
  };

  // Function to send reset password link to user
  const forgotPassword = () => {
    if (formValidation()) {
      sendPasswordResetEmail(authentication, email)
        .then(() => {
          setOverlayText('Successfully sent password reset link to your email');
          setpopUpErr(false);
          setIsVisible(true);
        })
        .catch(e => {
          setOverlayText(e.message);
          setpopUpErr(true);
          setIsVisible(true);
        });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <Image style={styles.logo} source={require('../assets/img/Logo.png')} />

        <View>
          <Text
            style={{
              fontSize: 30,
              paddingLeft: 15,
              marginTop: 50,
              color: 'black',
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Unfortunate Things Happen{' '}
          </Text>
          <Text
            style={{
              fontSize: 15,
              marginTop: 5,
              paddingLeft: 14,
              color: Colors.grey,
              textAlign: 'center',
            }}>
            Enter your email account. We’ll send you the instructions to reset
            your password.{' '}
          </Text>
        </View>

        {/* Email TextField */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email Address"
            keyboardType={'email-address'}
            value={email}
            onChangeText={value => handleOnChangeText(value, 'email')}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.forgottenButton}>
          <TouchableOpacity onPress={forgotPassword}>
            <View style={styles.buttonContainer}>
              <Text
                style={{color: Colors.white, fontSize: 20, fontWeight: 'bold'}}>
                Reset Password
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

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
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  logo: {
    marginTop: 20,
    alignSelf: 'center',
    height: 180,
    width: 180,
  },
  backNav: {
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  inputContainer: {
    marginTop: 30,
    alignSelf: 'center',
    paddingLeft: 20,
    height: 50,
    width: 330,
    elevation: 25,
    borderRadius: 30,
    backgroundColor: Colors.white,
    borderWidth: 0,
  },
  forgottenButton: {
    height: 50,
    width: 330,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    backgroundColor: Colors.primary,
    borderRadius: 15,
  },
});

export default ForgotPasswordScreen;
