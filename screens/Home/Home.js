import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';
import {baseUrl} from '../../assets/baseUrl';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPause} from '@fortawesome/free-solid-svg-icons';

const {height, width} = Dimensions.get('window');

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = () => {
    axios
      .get(`${baseUrl}/videos`)
      .then(r => {
        setVideos(r.data);
        console.log(r.data);
      })
      .catch(err => {
        if (err.response) {
          Alert.alert(err.response.data.message);
          console.log(err.response);
        } else {
          Alert.alert(err.message);
          console.log(err.request);
        }
      })
      .finally(() => setIsRefreshing(false));
  };

  return (
    <View style={style.mainContainer}>
      <FlatList
        keyExtractor={item => item.id}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        data={videos}
        renderItem={({item}) => (
          <View style={style.videoContentContainer}>
            <View
              style={{
                ...style.detailsContainer,
                ...style.shadow,
                bottom: tabBarHeight + 80,
              }}>
              <Text style={style.titleText}>{item.title}</Text>
              {item.description && (
                <Text style={style.descriptionText}>{item.description}</Text>
              )}
            </View>
            {isPaused && (
              <View style={style.pausedContainer}>
                <FontAwesomeIcon
                  icon={faPause}
                  size={50}
                  color={'white'}
                  style={style.pauseButton}
                />
              </View>
            )}
            <Pressable onPress={() => setIsPaused(!isPaused)}>
              <Video
                source={{uri: item.uri}}
                paused={isPaused}
                repeat={true}
                resizeMode={'cover'}
                style={style.video}
              />
            </Pressable>
          </View>
        )}
        refreshControl={
          <RefreshControl
            tintColor={'white'}
            refreshing={isRefreshing}
            onRefresh={() => fetchVideos()}
          />
        }
        ListEmptyComponent={
          <View style={style.emptyTextContainer}>
            <Text style={style.emptyText}>No videos available.</Text>
          </View>
        }
      />
    </View>
  );
};

const style = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContentContainer: {
    height,
    width,
    backgroundColor: 'red',
  },
  video: {
    flex: 1,
  },
  detailsContainer: {
    position: 'absolute',
    zIndex: 1,
    left: 20,
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 10,
  },
  descriptionText: {
    color: 'white',
  },
  pausedContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    opacity: 0.8,
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  emptyTextContainer: {
    paddingTop: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
  },
});

export default Home;
