import React, { useState } from 'react';
import { View, Text, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable, ActivityIndicator, Alert, useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { color } from '../themes';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import authService from '../services/authService';

const Button = Animated.createAnimatedComponent(Pressable);

const LoginScreen = ({navigation}: any) => {

  const Dark = useColorScheme() === 'dark';
  const Width = useSharedValue(320);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoad] = useState(false);
  const Animation = useAnimatedStyle(() => {
    return {
      width: Width.value,
    };
  });

  const loginPressed = async () => {
    // FormData validations
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all the fields!');
      return;
    }
    else if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters!');
      return;
    }
    else if (!regex.test(email)) {
      Alert.alert('Error', 'Email Invalid!');
      return;
    }

    setLoad(true);
    Width.value = withSpring(50, {duration: 1000, dampingRatio: 0.7, stiffness: 130});

    // Login api call
    setTimeout( async () => {
      try {
        let res = await authService.login(email, password);
        if (res.status >= 200 && res.status < 300) {
          navigation.replace('Splash');
        } else {
          Alert.alert('Error', 'User doesn\'t exist!');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Something went wrong!');
      }

      Width.value = withSpring(320, {duration: 1000, dampingRatio: 0.7, stiffness: 130});
      setEmail('');
      setPassword('');
      setLoad(false);
    }, 1250);
  };

  return (
    <SafeAreaView
    className = "flex-1 items-center"
    style = {{backgroundColor: Dark ? color.primaryDark : color.primaryLight}}
    >
      <View>
        <Image className = "w-[410px] h-[215px]" source = {require('../../assets/slice.png')} />
      </View>
      {/* SignIn form */}
      <KeyboardAvoidingView>
        <Text className="text-[27px] my-11 font-bold text-center" style={{color: Dark ? color.contrastLight : color.primaryDark}} >Sign in to the World of YUM!</Text>
        {/* Text inputs */}
        <View className = "flex-col mx-2">
          {/* Email */}
          <View
          className = "flex-row items-center h-12 my-4 px-4 rounded-2xl"
          style={{backgroundColor: Dark ? color.contrastDark : color.contrastLight}}
          >
            <Ionicons name = "mail-outline" size = {24} color = {Dark ? 'white' : 'black'} />
            <TextInput
            className = "ml-3 text-lg"
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            />
          </View>
          {/* Password */}
          <View
          className = "flex-row items-center h-12 my-4 px-4 rounded-2xl"
          style={{backgroundColor: Dark ? color.contrastDark : color.contrastLight}}
          >
            <Feather name = "lock" size = {24} color = {Dark ? 'white' : 'black'} />
            <TextInput
            className = "ml-3 text-lg"
            placeholder="Password"
            value={password}
            secureTextEntry = {true}
            onChangeText={text => setPassword(text)}
            />
          </View>
        </View>
        {/* Animated Button */}
        <View className = "flex-col items-center justify-center">
          <Button
            className="justify-center items-center mt-12 h-12 rounded-[21px]"
            style={[Animation, {backgroundColor: Dark ? color.secondaryDark : color.secondaryLight}]}
            onPress={loginPressed}
            disabled={load}
          >
            {load ? (
              <ActivityIndicator animating={true} size={'large'} color={'white'} />
            ) : (
              <Text className="text-lg font-bold" style={{color: color.contrastLight}}>Login</Text>
            )}
          </Button>
          <Pressable className="flex-row items-center justify-center my-5" onPress={() => navigation.navigate('Signup')} >
            <Text className="font-bold mr-0.5" style={{color: Dark ? color.contrastLight : color.primaryDark}} >Don't have an account?</Text>
            <Text className = "text-red-500 font-bold ml-0.5" >Signup</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
