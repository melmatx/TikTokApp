import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import {globalStyles} from '../../assets/styles/globalStyles';
import {style} from './style';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import TiktokAPI from '../../api/TiktokAPI';

const Uploader = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Please wait...');
  const [errors, setErrors] = useState({});

  const tabBarHeight = useBottomTabBarHeight();

  useFocusEffect(() => {
    StatusBar.setBarStyle('dark-content');
  });

  const chooseVideo = () => {
    setIsLoading(true);
    setLoadingMessage('Waiting for video...');

    Alert.alert('Video Options', 'Choose an option:', [
      {
        text: 'Cancel',
        onPress: () => setIsLoading(false),
      },
      {
        text: 'Take a video now',
        onPress: () =>
          launchCamera({mediaType: 'video'})
            .then(file => uploadVideo(file.assets[0]))
            .catch(() => Alert.alert('Failed to take a video.'))
            .finally(() => setIsLoading(false)),
      },
      {
        text: 'Pick from gallery',
        onPress: () =>
          launchImageLibrary({mediaType: 'video'})
            .then(file => uploadVideo(file.assets[0]))
            .catch(() => Alert.alert('Failed to pick from gallery.'))
            .finally(() => setIsLoading(false)),
      },
    ]);
  };

  const uploadVideo = videoFile => {
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

    TiktokAPI.post('/videos', data, {headers: {Accept: 'application/json'}})
      .then(r => {
        Alert.alert(r.data.message);
        console.log(r.data);
        clearForm();
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
              placeholder={'Enter title'}
              placeholderTextColor={'gray'}
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
              placeholderTextColor={'gray'}
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

export default Uploader;
