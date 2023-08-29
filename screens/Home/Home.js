import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Video from 'react-native-video';
import axios from 'axios';
import {baseUrl} from '../../assets/baseUrl';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const {height, width} = Dimensions.get('window');

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      .finally(() => {
        setIsLoading(false);
        setIsRefreshing(false);
      });
  };

  return (
    <View style={style.mainContainer}>
      {isLoading && <ActivityIndicator color={'white'} />}
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
            <Video
              source={{uri: item.uri}}
              controls={true}
              paused={true}
              repeat={true}
              resizeMode={'cover'}
              style={style.video}
            />
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
