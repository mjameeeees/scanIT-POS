import React from 'react'
import { View } from 'react-native'
import { db } from '../../DatabaseHelper';

const AllData = ({navigation}) => {


  return (
    <View>
        <Button title="Export Data" 
        
        onPress={() => navigation.navigate('Map', { handleExportButtonPress })}/>
    </View>
  )
}

export default AllData