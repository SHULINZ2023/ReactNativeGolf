import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import GlobalStyle  from '../../styles';


const GameListComp = ({ games, onGamePress }) => {
    return (
      <View style={containerStyle}>
        <FlatList
          data={games}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onGamePress(item)}>
              <Text style={buttonStyle}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };
  const containerStyle = [GlobalStyle.container];
  const buttonStyle = [GlobalStyle.button];
  export default GameListComp
