import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class BookDonateScreen extends Component{
  constructor(){
    super()
    this.state = {
      requestedBooksList : [],
      lastVisibleTransaction: null
    }
  
  }

  componentDidMount = async ()=>{
    const transaction =  await db.collection("requested_books").get()
    transaction.docs.map((doc)=>{
      this.setState({
        requestedBooksList:[...this.state.requestedBooksList,doc.data()],
        lastVisibleTransaction: doc
      })
    })
}
  render() {
    return (
      <View style={styles.container}>
      <FlatList
        keyExtractor= {(item, index)=> index.toString()}
        data={this.state.requestedBooksList}
        renderItem={({item})=>(
          <View style={{borderBottomWidth: 2}}>
            <Text>{"Book Name: " + item.book_name}</Text>
            <Text>{"Reason to Request: " + item.reason_to_request}</Text>
            
          </View>
        )}
        
       
      /> 
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },
  searchBar:{
    flexDirection:'row',
    height:40,
    width:'auto',
    borderWidth:0.5,
    alignItems:'center',
    backgroundColor:'grey',

  },
  bar:{
    borderWidth:2,
    height:30,
    width:300,
    paddingLeft:10,
  },
  searchButton:{
    borderWidth:1,
    height:30,
    width:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'green'
  }
})