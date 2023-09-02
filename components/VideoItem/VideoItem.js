import React from 'react';
import {Pressable, Text, View} from 'react-native';
import Video from 'react-native-video';
import {baseURL} from '../../api/TiktokAPI';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPause} from '@fortawesome/free-solid-svg-icons';
import {style} from './style';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

const VideoItem = ({item, setCurrentlyPlaying, currentPlayingId}) => {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={style.videoContentContainer}>
      <View
        style={{
          ...style.detailsContainer,
          bottom: tabBarHeight + 80,
        }}>
        <Text style={{...style.titleText, ...style.shadow}}>{item.title}</Text>
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
          source={{uri: `${baseURL}/videos/${item.id}`}}
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
  );
};

export default VideoItem;
