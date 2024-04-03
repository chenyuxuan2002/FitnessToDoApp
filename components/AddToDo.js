import React, { useState } from 'react';
import { Text, View, Button, Image, TextInput, StyleSheet, TouchableOpacity, Alert, Platform , ImageBackground} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 

const AddToDo = () => {
  const [imageUri, setImageUri] = useState(null);
  const [todoText, setTodoText] = useState('');
  const [steps, setSteps] = useState(0);
  const [location, setLocation] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Helper function to save data to AsyncStorage
  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      Alert.alert(`${key} saved successfully`);
    } catch (e) {
      Alert.alert(`Failed to save the ${key}`);
    }
  };

  // 选择图库中的图片
  const selectImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need photo gallery access permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled && result.assets) {
      setImageUri(result.assets[0].uri);
    }
  };

  //  使用相机拍照
  const takePhotoWithCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera access permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled && result.assets) {
      setImageUri(result.assets[0].uri);
    }
  };


  //  获取步数
  const getStepCount = async () => {
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    let result = await Pedometer.getStepCountAsync(start, end);
    setSteps(result.steps);
  };

  //获取位置信息
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    saveData('@location', location);
  };

  // 选择日期
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  // 发布待办事项
  const handleCreatePress = async () => {
    const newToDo = { imageUri, todoText, steps, location, date: date.toISOString() };
    try {
      const currentToDosJSON = await AsyncStorage.getItem('@todos');
      const currentToDos = currentToDosJSON ? JSON.parse(currentToDosJSON) : [];
      const updatedToDos = [...currentToDos, newToDo];
      await AsyncStorage.setItem('@todos', JSON.stringify(updatedToDos));
      Alert.alert('The todo item was saved successfully');
      // 清空表单
      setImageUri(null);
      setTodoText('');
      setSteps(0);
      setLocation(null);
      setDate(new Date());
    } catch (e) {
      Alert.alert('Failed to save todo item');
    }
  };

  const iconButton = {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    backgroundColor: '#DDDDDD',
    borderRadius: 25,
    marginHorizontal: 10,
  };


  return (
    <ImageBackground source={require('../assets/bg.png')} style={styles.backgroundImage}>
    <View style={styles.container}>
      {/* Button to select image from gallery */}
      <TouchableOpacity onPress={selectImageFromGallery} style={styles.button}>
        <Text>Choose from Album </Text>
      </TouchableOpacity>

      {/* Button to take photo with camera */}
      <TouchableOpacity onPress={takePhotoWithCamera} style={styles.button}>
        <Text>Photo</Text>
      </TouchableOpacity>

      {/* Display selected/taken image */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {/* Input for ToDo Text */}
      <TextInput
        style={styles.input}
        placeholder="Enter a fitness plan"
        value={todoText}
        onChangeText={setTodoText}
      />

      {/* Display Step Count */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity onPress={getStepCount} style={iconButton}>
          <MaterialIcons name="directions-run" size={30} />
        </TouchableOpacity>

        {steps > 0 && <Text>Number of steps: {steps}</Text>}

        {/* Display Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={iconButton}>
          <MaterialIcons name="calendar-today" size={30} />
        </TouchableOpacity>
      </View>
      <Text>Data: {date.toLocaleDateString()}</Text>
      {/* Display Location */}
      <View style={styles.locationContainer}>
      <TouchableOpacity onPress={getLocation} style={iconButton}>
        <MaterialIcons name="location-on" size={30} />
      </TouchableOpacity>
      {location && <Text>Location: {location.coords.latitude}, {location.coords.longitude}</Text>}
      </View>
      {/* Submit Button */}
      <Button title="Add" onPress={handleCreatePress} />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, 
    resizeMode: 'cover', 
},
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  button: {
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  locationContainer: {
    alignItems: 'flex-start', // Align location text to the start
    width: '100%', // Take the full width
    marginBottom: 100, // Margin bottom for spacing
  },
  locationText: {
    marginTop: 10, 
  },
});

export default AddToDo;
