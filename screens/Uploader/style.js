import {StyleSheet} from 'react-native';

export const style = StyleSheet.create({
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
    backgroundColor: '#eaeaea',
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
