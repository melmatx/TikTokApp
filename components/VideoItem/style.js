import {Dimensions, StyleSheet} from 'react-native';

const {height, width} = Dimensions.get('window');

export const style = StyleSheet.create({
  videoContentContainer: {
    height,
    width,
  },
  video: {
    flex: 1,
    borderRadius: 30,
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
});
