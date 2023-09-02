import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  StatusBar,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {style} from './style';
import VideoItem from '../../components/VideoItem/VideoItem';
import TiktokAPI from '../../api/TiktokAPI';

const {height} = Dimensions.get('window');

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      return () => setCurrentPlayingId(null);
    }, []),
  );

  useEffect(() => {
    fetchVideos(true);
  }, []);

  const fetchVideos = (reset = false) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);

    let cursorValue = nextCursor;
    if (reset) {
      cursorValue = true;
      setVideos([]);
    }

    TiktokAPI.get(`/videos?cursor=${cursorValue}`)
      .then(r => {
        if (cursorValue) {
          setVideos(prevVideos => [...prevVideos, ...r.data.data]);
          setNextCursor(r.data.next_cursor);
          console.log('Response data:', r.data);
        }
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
    itemVisiblePercentThreshold: 98,
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
        onEndReached={() => fetchVideos()}
        onEndReachedThreshold={0.6}
        data={videos}
        renderItem={({item}) => (
          <VideoItem
            item={item}
            setCurrentlyPlaying={setCurrentlyPlaying}
            currentPlayingId={currentPlayingId}
          />
        )}
        refreshControl={
          <RefreshControl
            tintColor={'white'}
            refreshing={isRefreshing}
            onRefresh={() => {
              fetchVideos(true);
            }}
          />
        }
      />
    </View>
  );
};

export default Home;
