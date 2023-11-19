import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Button, Image, ScrollView, Modal,TouchableOpacity,SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { AsyncStorage, ToastAndroid,} from '@react-native-async-storage/async-storage';
import axios from 'axios';

const App = () => {
  const [captureindex,setCaptureindex]=useState(null);
  const [value, setValue] = useState(1);
  const [quote, setQuote] = useState();
  const [author, setAuthor] = useState();
  const [quotelist,setQuotelist] =  useState([])
  const [isModalVisible, setModalVisible] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#008080'); // Initialize with a default color
  const colors = ['cornflowerblue', 'green', 'yellowgreen','orange','coral','grey'];
  const captureViewRef = useRef();
  const [capturedImage, setCapturedImage] = useState(null);

const setcolor=(color)=>{
  setBackgroundColor(color);
}

  const captureView = async () => {
    try {
      const result = await captureRef(captureViewRef, {
        format: 'png',
        quality:0.9
      });
      setCapturedImage(result);
    } catch (error) {
      console.error('Error capturing view:', error);
    }
  };




  const fetchQuotes = async () => {
    fetch("https://type.fit/api/quotes")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      setQuotelist(data);
    });
  };


  const fetchRandomQuote = async () => {
    try {
      const response = await axios.get('https://api.quotable.io/quotes/random');
      const data = response.data;

      // Assuming the API response is an array, extract the first item
      if (Array.isArray(data) && data.length > 0) {
        const randomQuote = data[0];
        console.log(randomQuote);
        setQuote(randomQuote.content);
        setAuthor(randomQuote.author)
      } else {
        console.error('Invalid data format received from the API');
      }
    } catch (error) {
      console.error('Error fetching random quote:', error);
    }
  };

  useEffect(() => {
    fetchRandomQuote()
    fetchQuotes()
  }, []);

  const handleRefresh = () => {
    if (value === colors.length) {
      setValue(0);
    } else {
      setValue(value + 1);
    }
    fetchQuotes()
    fetchRandomQuote()
    const newBackgroundColor = colors[value];
    setBackgroundColor(newBackgroundColor);
  };

  const showModal = () => {
    captureView();
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };


  // const shareImage = async () => {
  //   await captureView();
  //   if (capturedImage) {
  //     try {
  //       await Sharing.shareAsync(capturedImage);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   }
 
  // };

  const saveToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        const asset = await MediaLibrary.createAssetAsync(imageUrl);

        if (Platform.OS === 'ios') {
          // For iOS, use `createAlbumAsync` to save the image to a specific album
          await MediaLibrary.createAlbumAsync('YourAlbumName', asset);
        }

        alert('Image saved to gallery!');
      } else {
        alert('Permission to access media library denied.');
      }
    } catch (error) {
      console.error('Error saving image to gallery:', error);
    }
  };

  
  const shareImage = async (index) => {
    await captureView();
    if (capturedImage) {
      try {
        await Sharing.shareAsync(capturedImage);
      } catch (e) {
        console.log(e);
      }
    }}

 


  return (<>
<View style={{ width: '100%', backgroundColor: 'white', marginTop: 30,flexDirection:"row" }}>

  <Image style={{ width: 90, height: 40, margin: 5 }} source={require('./Images/Quotesking.png')} />

<View style={{ width:300, justifyContent: 'flex-end', flexDirection: 'row' }}>
<TouchableOpacity style={{ border:"black",borderRadius:15,height:30,width:30,textAlign:"center",justifyContent:"center",margin:10,backgroundColor:backgroundColor,borderWidth: 1,alignSelf: 'flex-end'}} onPress={showModal}><Text style={{ textAlign: "center", textAlignVertical: "center" }}>bg</Text></TouchableOpacity>
</View>
</View>


    <View style={{ flex: 1,width:'100%', backgroundColor: 'white',padding:2}}>
   <View style={{width:"full",height:"auto",backgroundColor:'gray'}}>
   <Text style={{textAlign:"center",color:'white',backgroundColor:"brown",width:"50%",marginLeft:"25%",borderTopRightRadius:15, borderBottomLeftRadius:15, overflow: 'hidden',marginVertical:5}}>" Quote of the day "</Text>
   <ViewShot  style={{ width: 'full', height: 'auto', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'burlywood',margin:8, padding: 10,borderRadius: 20 }}>
         <Text style={{ fontSize: 18, color: '#ffffff', padding: 8 }}>{quote && quote}</Text>
            <Text style={{ fontSize: 18, color: 'black',  padding: 8 }}>Author - {author && author}</Text>
          </ViewShot>
          <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row', paddingRight: 15,paddingBottom:5 }}>
      <TouchableOpacity>
      <Image onPress={saveToGallery}  style={{width:30,height:30,marginHorizontal:10}} source={require('./Images/download.png')}/>
      </TouchableOpacity>
      <Icon name='share' size={30} color='#000' onPress={shareImage} style={{ alignSelf: 'flex-end' }} />
    </View>
    </View>
      <ScrollView>
        {quotelist.map((quotes, index) => (
          <View key={index} ref={captureindex === index ? captureViewRef : null} style={{ width: '100%', height: 'auto', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:backgroundColor,margin:8,borderTopRightRadius:30, borderBottomLeftRadius:30, padding: 10 }}>
            <Text style={{ fontSize: 18, color: '#ffffff', padding: 20 }}>"{quotes.text}"</Text>
            <Text style={{ fontSize: 15, color: 'black',  padding: 20 }}>Author -  {quotes.author}</Text>
            <TouchableOpacity></TouchableOpacity><Icon name="share" onPress={() => shareImage(index)} size={30} color="#000"/>
          </View>
        ))}
      </ScrollView>
    </View>

    <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideModal}
      >
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
    {/* Your modal content goes here */}
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        
        <View style={{ width: '90%', height: 'auto', backgroundColor: 'white', padding: 18,borderRadius:10,border:"1vh solid black" }}>
          <View style={{ width: '100%', justifyContent: 'flex-end', flexDirection: 'row',paddingBottom:8 }}>
          <TouchableOpacity >
            <Icon name='close' size={30} color='black' onPress={hideModal} style={{ alignSelf: 'flex-end' }} />
            </TouchableOpacity>

          </View>
            <View style={{ flexDirection: "row", flexWrap: 'wrap', maxWidth: "100%" }}>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#008080'}} onPress={()=>setcolor('#008080')} />
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#FF6F61'}} onPress={()=>setcolor('#FF6F61')}/>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#663399'}} onPress={()=>setcolor('#663399')}/>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#40E0D0'}} onPress={()=>setcolor('#40E0D0')}/>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#FFD700'}} onPress={()=>setcolor('#FFD700')}/>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#98FB98'}} onPress={()=>setcolor('#98FB98')}/>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#E6E6FA'}} onPress={()=>setcolor('#E6E6FA')}/>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#FFDAB9'}} onPress={()=>setcolor('#FFDAB9')}/>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#00BFFF'}} onPress={()=>setcolor('#00BFFF')}/>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#B76E79'}} onPress={()=>setcolor('#B76E79')}/>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#50C878'}} onPress={()=>setcolor('#50C878')}/>
              <TouchableOpacity style={{borderWidth:1,width:30,height:30,margin:10,backgroundColor:'#DAA520'}} onPress={()=>setcolor('#DAA520')}/>
            </View>           
          </View>
        </View>
  </View>
      </Modal>
      <View style={{ flexDirection: 'row', width: '100%',height:50,marginTop:5,marginBottom:5}}>
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'darkslategrey' }}
          onPress={handleRefresh}
        >
          <Text style={{ color: 'white' }}>Refresh</Text>
        </TouchableOpacity>
      </View>
</> );
};

export default App;