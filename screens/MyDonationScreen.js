import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'

import { List, Colors } from 'react-native-paper';

export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

  constructor() {
    super()
    this.state = {
      userId: firebase.auth().currentUser.email,
      allDonations: []
    }
    this.requestRef = null
  }

  
  getAllDonations = () => {
    console.log(this.state.userId)
    this.requestRef = db.collection("all_donations")
      .where("donor_id", '==', this.state.userId)
      .onSnapshot((snapshot) => {
        var allDonations = snapshot.docs.map(document => document.data());
        this.setState({
          allDonations: allDonations,
        });
      })
  }

  sendBook=(bookDetails)=>{
    if(bookDetails.request_status === "Book Sent"){
      var requestStatus = "Donor Interested"
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        "request_status" : "Donor Interested"
      })
      this.sendNotification(bookDetails,requestStatus)
    }
    else{
      var requestStatus = "Book Sent"
      db.collection("all_donations").doc(bookDetails.doc_id).update({
        "request_status" : "Book Sent"
      })
      this.sendNotification(bookDetails,requestStatus)
    }
  }

  sendNotification=(bookDetails,requestStatus)=>{
    var requestId = bookDetails.request_id
    var donorId = bookDetails.donor_id
    db.collection("all_notifications")
    .where("request_id","==", requestId)
    .where("donor_id","==",donorId)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        var message = ""
        if(requestStatus === "Book Sent"){
          message = this.state.donorName + " sent you book"
        }else{
           message =  this.state.donorName  + " has shown interest in donating the book"
        }
        db.collection("all_notifications").doc(doc.id).update({
          "message": message,
          "notification_status" : "unread",
          "date"                : firebase.firestore.FieldValue.serverTimestamp()
        })
      });
    })
  }
 
  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item, i }) => {
    return (
      <ListItem key={i} bottomDivider>
        <List.Icon color={Colors.orange500} icon="book" />
        <ListItem.Content>
         
          <ListItem.Title style={{ color: "black", fontWeight: "bold" }}>
            {item.book_name}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: "green" }}>
            {"Requested By : " + item.requested_by + "\nStatus : " + item.request_status}
          </ListItem.Subtitle>

          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor : item.request_status === "Book Sent" ? "green" : "#ff5722"
              }
            ]}
            onPress = {()=>{
              this.sendBook(item)
            }}
           >
             <Text style={{color:'#ffff'}}>{
               item.request_status === "Book Sent" ? "Book Sent" : "Send Book"
             }</Text>
           </TouchableOpacity>



        </ListItem.Content>
      </ListItem>
    );
  }


  /* <ListItem

       


  <Icon name="book"  style={{type:"font-awesome", color :'#696969'}}/>   
  key={i}
     title={item.book_name}
     subtitle={"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
     leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>}
     titleStyle={{ color: 'black', fontWeight: 'bold' }}
     rightElement={
         <TouchableOpacity style={styles.button}>
           <Text style={{color:'#ffff'}}>Send Book</Text>
         </TouchableOpacity>
       }
     bottomDivider
   />*/



  componentDidMount() {
    this.getAllDonations()
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Donations" />
        <View style={{ flex: 1 }}>
          {
            this.state.allDonations.length === 0
              ? (
                <View style={styles.subtitle}>
                  <Text style={{ fontSize: 20 }}>List of all book Donations</Text>
                </View>
              )
              : (
                <FlatList
                  keyExtractor={this.keyExtractor}
                  data={this.state.allDonations}
                  renderItem={this.renderItem}
                />
              )
          }
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    elevation: 16
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center'
  }
})