import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {globalStyles} from '../../assets/styles/globalStyles';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import {baseUrl} from '../../assets/baseUrl';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const Uploader = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please wait...');
  const [errors, setErrors] = useState({});

  const tabBarHeight = useBottomTabBarHeight();

  useFocusEffect(() => {
    StatusBar.setBarStyle('dark-content');
  });

  useEffect(() => {
    if (videoFile) {
      uploadVideo();
    }
  }, [videoFile]);

  const chooseVideo = () => {
    setIsLoading(true);
    setLoadingMessage('Waiting for video...');
    Alert.alert('Video options', 'Choose an option:', [
      {
        text: 'Cancel',
        onPress: () => setIsLoading(false),
      },
      {
        text: 'Take a video now',
        onPress: () =>
          launchCamera({mediaType: 'video'})
            .then(file => setVideoFile(file.assets[0]))
            .catch(() => Alert.alert('Failed to take a video.'))
            .finally(() => setIsLoading(false)),
      },
      {
        text: 'Pick from gallery',
        onPress: () =>
          launchImageLibrary({mediaType: 'video'})
            .then(file => setVideoFile(file.assets[0]))
            .catch(() => Alert.alert('Failed to pick from gallery.'))
            .finally(() => setIsLoading(false)),
      },
    ]);
  };
  const uploadVideo = () => {
    setIsLoading(true);
    setLoadingMessage('Uploading video...');

    const data = new FormData();

    data.append('title', title);
    data.append('description', description);
    data.append('video', {
      name: videoFile.fileName,
      type: videoFile.type,
      uri:
        Platform.OS === 'android'
          ? videoFile.uri
          : videoFile.uri.replace('file://', ''),
    });

    axios
      .post(`${baseUrl}/videos`, data, {headers: {Accept: 'application/json'}})
      .then(r => {
        Alert.alert(r.data.message);
        clearForm();
        console.log(r.data);
      })
      .catch(err => {
        if (err.response) {
          setErrors(err.response.data.errors);
          console.log('Response data: ', err.response.data);
        } else {
          Alert.alert(err.message);
          console.log('Error request: ', err.request);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setVideoFile(null);
  };

  return (
    <SafeAreaView style={globalStyles.flexFull}>
      <Pressable
        style={{...style.mainContainer, marginBottom: tabBarHeight}}
        onPress={() => Keyboard.dismiss()}>
        {isLoading ? (
          <View>
            <ActivityIndicator />
            <Text>{loadingMessage}</Text>
          </View>
        ) : (
          <View>
            <TextInput
              value={title}
              onChangeText={setTitle}
              autoFocus={true}
              placeholder={'Enter title:'}
              style={style.textInput}
            />
            {errors?.title && (
              <Text style={style.errorText}>{errors.title}</Text>
            )}
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline={true}
              textAlignVertical={'top'}
              placeholder={'Enter description'}
              style={{...style.textInput, ...style.descriptionTextInput}}
            />
            {errors?.description && (
              <Text style={style.errorText}>{errors.description}</Text>
            )}
            {errors?.video && (
              <Text style={style.errorText}>{errors.video}</Text>
            )}
            <View style={style.buttonContainer}>
              <Button
                title={'Select Video'}
                onPress={() => chooseVideo()}
                disabled={!title}
              />
            </View>
          </View>
        )}
      </Pressable>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    padding: 10,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'gray',
    padding: 15,
    margin: 15,
    width: 250,
  },
  descriptionTextInput: {
    height: 200,
    paddingTop: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Uploader;
