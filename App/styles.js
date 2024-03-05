import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'lightcyan'
  },
  subcontainer1: {
    flex: 5,
    backgroundColor:'lightcyan'
  },
  subcontainer2: {
    flex: 1,
    backgroundColor:'lightcyan'
  },
  button:{
    padding:'10px'
  },
  input:{
    color:'black',
    padding:'10px'
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color:'black',
  },
  fancyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    backgroundColor: 'lightyellow',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    width: '50%',
    textAlign: 'left'
  },
  fancySelectedText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
    backgroundColor: 'green',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    width: '50%',
    textAlign: 'left'
  },
  longButton: {
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareButton: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: 'white',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    width: '33%',
    textAlign: 'center',
    justifyContent: 'center',

  },
  squareCurrentButton: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'blue',
    backgroundColor: 'orange',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    width: '33%',
    textAlign: 'center',
    justifyContent: 'center',

  },
  buttonText:{
    fontSize: 50,
    fontWeight: 'bold',
    color: 'black',
  },
  radioButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    backgroundColor: 'lightyellow',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    width: '70%',
    textAlign: 'center'
  },
  radioSelectedButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
    backgroundColor: 'green',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 20,
    padding: 10,
    width: '70%',
    textAlign: 'center'
  },
});