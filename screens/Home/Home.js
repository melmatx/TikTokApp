import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  StatusBar,
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
import {useFocusEffect} from '@react-navigation/native';

const {height, width} = Dimensions.get('window');

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);

  const tabBarHeight = useBottomTabBarHeight();

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');

      return () => setCurrentPlayingId(null);
    }, []),
  );

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

  const setCurrentlyPlaying = id => {
    if (currentPlayingId !== id) {
      setCurrentPlayingId(id);
    } else {
      setCurrentPlayingId(null);
    }
  };

  const onViewableItemsChanged = useCallback(({viewableItems}) => {
    if (viewableItems.length > 0) {
      const firstViewableItem = viewableItems[0];
      if (firstViewableItem.isViewable) {
        setCurrentPlayingId(firstViewableItem.item.id);
      }
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const viewabilityConfigCallbackPairs = useRef([
    {viewabilityConfig, onViewableItemsChanged},
  ]);

  return (
    <View style={style.mainContainer}>
      <FlatList
        keyExtractor={item => item.id}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        showsVerticalScrollIndicator={false}
        data={videos}
        renderItem={({item}) => (
          <View style={style.videoContentContainer}>
            <View
              style={{
                ...style.detailsContainer,
                bottom: tabBarHeight + 80,
              }}>
              <Text style={{...style.titleText, ...style.shadow}}>
                {item.title}
              </Text>
              {item.description && (
                <Text style={{...style.descriptionText, ...style.shadow}}>
                  {item.description}
                </Text>
              )}
            </View>
            <Pressable
              onPress={() => setCurrentlyPlaying(item.id)}
              style={style.video}>
              <Video
                source={{uri: item.uri}}
                onError={e => console.log(e)}
                paused={item.id !== currentPlayingId}
                repeat={true}
                resizeMode={'cover'}
                style={style.video}
              />
              {item.id !== currentPlayingId && (
                <View style={style.pausedContainer}>
                  <FontAwesomeIcon
                    icon={faPause}
                    size={50}
                    color={'white'}
                    style={style.pauseButton}
                  />
                </View>
              )}
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
  },
  video: {
    flex: 1,
  },
  detailsContainer: {
    position: 'absolute',
    zIndex: 1,
    left: 20,
    marginRight: 50,
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
    zIndex: 1,
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
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
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
