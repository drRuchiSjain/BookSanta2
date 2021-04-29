import React ,{Component} from 'react'
import {View, Text,TouchableOpacity,ScrollView,FlatList,StyleSheet} from 'react-native';
import {Card,Icon,ListItem} from 'react-native-elements'
import MyHeader from '../components/MyHeader.js'
import firebase from 'firebase';
import db from '../config.js'
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';

export default class MyDonationScreen extends Component {
  static navigationOptions = { header: null };

   constructor(){
     super()
     this.state = {
       userId : firebase.auth().currentUser.email,
       allDonations : []
     }
     this.requestRef= null
   }


   getAllDonations =()=>{
     this.requestRef = db.collection("all_donations").where("donor_id" ,'==', this.state.userId)
     .onSnapshot((snapshot)=>{
       var allDonations = snapshot.docs.map(document => document.data());
       this.setState({
         allDonations : allDonations,
       });
     })
   }

   keyExtractor = (item, index) => index.toString()

   renderItem = ( {item, i} ) =>{
    return (
      <ListItem key={i} bottomDivider>
        <ListItem.Content>
        <Avatar source= {require('../assets/book.png')} />
          <ListItem.Title style={{ color: "black", fontWeight: "bold" }}>
            {item.book_name}
          </ListItem.Title>
          <ListItem.Subtitle style={{ color: "green" }}>
            {"Requested By : " + item.requested_by +"\nStatus : " + item.request_status}
          </ListItem.Subtitle>
        
          
                   
         
          <TouchableOpacity style={styles.button}

              onPress ={()=>{
                this.props.navigation.navigate("RecieverDetails",{"details": item})
              }}
              >
            <Text style={{ color: "#ffff" }}>View</Text>
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
   


   componentDidMount(){
     this.getAllDonations()
   }

   componentWillUnmount(){
     this.requestRef();
   }

   render(){
     return(
       <View style={{flex:1}}>
         <MyHeader navigation={this.props.navigation} title="My Donations"/>
         <View style={{flex:1}}>
           {
             this.state.allDonations.length === 0
             ?(
               <View style={styles.subtitle}>
                 <Text style={{ fontSize: 20}}>List of all book Donations</Text>
               </View>
             )
             :(
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
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     },
    elevation : 16
  },
  subtitle :{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  }
})