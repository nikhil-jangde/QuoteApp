import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  View,
  Text,
  Button,
  Image,
  ScrollView,
  Modal,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import ViewShot, { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import axios from "axios";

const App = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [value, setValue] = useState(1);
  const [quote, setQuote] = useState();
  const [author, setAuthor] = useState();
  const [quotelist, setQuotelist] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#008080");
  const colors = [
    "cornflowerblue",
    "green",
    "yellowgreen",
    "orange",
    "coral",
    "grey",
  ];
  const captureViewRef1 = useRef();
  const captureViewRef2 = useRef();
  const [capturedImage, setCapturedImage] = useState();

  // Function to set background color
  const setcolor = (color) => {
    setBackgroundColor(color);
  };

  
  // Function to capture view for the first quote
  const captureView1 = async () => {
    try {
      const result = await captureRef(captureViewRef1, {
        format: "png",
        quality: 0.9,
      });
      setCapturedImage(result);
    } catch (error) {
      console.error("Error capturing view:", error);
    }
  };

    // Function to capture view for the second quote
  const captureView2 = async () => {
    try {
      const result = await captureRef(captureViewRef2, {
        format: "png",
        quality: 0.9,
      });
      setCapturedImage(result);
    } catch (error) {
      console.error("Error capturing view:", error);
    }
  };

    // Function to fetch quotes from the API
  const fetchQuotes = async () => {
    fetch("https://type.fit/api/quotes")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        setQuotelist(data);
      });
  };

    // Function to fetch a random quote from the API
  const fetchRandomQuote = async () => {
    try {
      const response = await axios.get("https://api.quotable.io/quotes/random");
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        const randomQuote = data[0];
        setQuote(randomQuote.content);
        setAuthor(randomQuote.author);
      } else {
        console.error("Invalid data format received from the API");
      }
    } catch (error) {
      console.error("Error fetching random quote:", error);
    }
  };

   // Initial data fetching on component mount
  useEffect(() => {
    fetchRandomQuote();
    fetchQuotes();
  }, []);

   // Function to handle refresh button press
  const handleRefresh = () => {
    if (value === colors.length) {
      setValue(0);
    } else {
      setValue(value + 1);
    }
    fetchQuotes();
    fetchRandomQuote();
    const newBackgroundColor = colors[value];
    setBackgroundColor(newBackgroundColor);
  };

    // Function to show the modal
  const showModal = () => {
    setModalVisible(true);
  };

    // Function to hide the modal
  const hideModal = () => {
    setModalVisible(false);
  };

    // Function to share the first captured image
  const shareImage1 = async () => {
    await captureView1();
    if (capturedImage) {
      try {
        await Sharing.shareAsync(capturedImage);
      } catch (e) {
        console.log(e);
      }
    }
  };

   // Function to share the second captured image
  const shareImage2 = async () => {
    await captureView2();
    if (capturedImage) {
      try {
        await Sharing.shareAsync(capturedImage);
      } catch (e) {
        console.log(e);
      }
    }
  };

    // Function to navigate to the previous or next quote
  const navigate = (direction) => {
    if (direction === "prev" && currentQuoteIndex > 0) {
      setCurrentQuoteIndex(currentQuoteIndex - 1);
    } else if (
      direction === "next" &&
      currentQuoteIndex < quotelist.length - 1
    ) {
      setCurrentQuoteIndex(currentQuoteIndex + 1);
    }
  };

   // Current quote data
  const currentQuote = quotelist[currentQuoteIndex];


    // Function to save captured image to the gallery
  const SavetoGallary = async (val) => {
    if (val === "first") {
      await captureView1();
    } else if (val === "second") {
      await captureView2();
    }
    try {
      if (capturedImage) {
        await MediaLibrary.saveToLibraryAsync(capturedImage);
        Alert.alert("Saved!", "Quote image saved to your device.");
      } else {
        console.log("Image is not captured or permission denied");
      }
    } catch (error) {
      console.error("Error capturing or saving image:", error);
    }
  };


  return (
    <>
  <View style={{ width: "100%", backgroundColor: "white", marginTop: 30, flexDirection: "row" }}>
    <Image style={{ width: 90, height: 40, margin: 5 }} source={require("./Images/Quotesking.png")} />
    <View style={{ width: 300, justifyContent: "flex-end", flexDirection: "row" }}>
      <TouchableOpacity style={{ borderRadius: 15, height: 30, width: 30, textAlign: "center", justifyContent: "center", margin: 10, backgroundColor: backgroundColor, borderWidth: 1, alignSelf: "flex-end" }} onPress={showModal}>
        <Text style={{ textAlign: "center", textAlignVertical: "center" }}>bg</Text>
      </TouchableOpacity>
    </View>
  </View>

  <View style={{ flex: 1, width: "100%", backgroundColor: "white", padding: 2 }}>
    <View style={{ width: "full", height: "auto", backgroundColor: "gray" }}>
      <Text style={{ textAlign: "center", color: "white", backgroundColor: "brown", width: "50%", marginLeft: "25%", borderTopRightRadius: 15, borderBottomLeftRadius: 15, overflow: "hidden", marginVertical: 5 }}>
        " Quote of the day "
      </Text>
      <ViewShot ref={captureViewRef1} style={{ width: "full", height: "auto", borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: "burlywood", margin: 8, padding: 10, borderRadius: 20 }}>
        <Text style={{ fontSize: 18, color: "#ffffff", padding: 8 }}>{quote && quote}</Text>
        <Text style={{ fontSize: 18, color: "black", padding: 8 }}>Author - {author && author}</Text>
      </ViewShot>
      <View style={{ width: "100%", justifyContent: "flex-end", flexDirection: "row", paddingRight: 15, paddingBottom: 5 }}>
        <TouchableOpacity onPress={() => SavetoGallary("first")}>
          <Image style={{ width: 30, height: 30, marginHorizontal: 10 }} source={require("./Images/download.png")} />
        </TouchableOpacity>
        <TouchableOpacity onPress={shareImage1}>
          <Icon name="share" size={30} color="#000" style={{ alignSelf: "flex-end", marginHorizontal: 10 }} />
        </TouchableOpacity>
      </View>
    </View>

    <ScrollView>
      <View style={{ width: "100%", marginVertical: 5, borderWidth: 1, backgroundColor: backgroundColor }}>
        <Text style={{ textAlign: "center", color: "white", backgroundColor: "brown", width: "50%", marginLeft: "25%", borderTopRightRadius: 15, borderBottomLeftRadius: 15, overflow: "hidden", marginVertical: 5 }}>
          " All Quotes "
        </Text>
        {currentQuote ? (
          <ViewShot ref={captureViewRef2} style={{ width: "95%", height: "auto", borderWidth: 1, justifyContent: "center", alignItems: "center", backgroundColor: backgroundColor, margin: 8, borderTopRightRadius: 30, borderBottomLeftRadius: 30, padding: 10 }}>
            <Text style={{ fontSize: 18, color: "#ffffff", padding: 20 }}>
              "{currentQuote.text}"
            </Text>
            <Text style={{ fontSize: 15, color: "black", padding: 20 }}>
              Author - {currentQuote.author}
            </Text>
          </ViewShot>
        ) : (
          <Text>No quotes available.</Text>
        )}
        <View style={{ width: "100%", justifyContent: "flex-end", flexDirection: "row", paddingRight: 15, paddingBottom: 5 }}>
          <TouchableOpacity onPress={() => SavetoGallary("second")}>
            <Image style={{ width: 30, height: 30, marginHorizontal: 10 }} source={require("./Images/download.png")} />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareImage2}>
            <Icon name="share" size={30} color="#000" style={{ alignSelf: "flex-end", marginHorizontal: 10 }} />
          </TouchableOpacity>
        </View>
        <View style={{ width: "100%", justifyContent: "flex-end", flexDirection: "row", marginTop: 20 }}>
          <TouchableOpacity style={{ width: "50%", borderWidth: 1, padding: 10 }} onPress={() => navigate("prev")}>
            <Text style={{ textAlign: "center" }}>prev</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: "50%", borderWidth: 1, padding: 10 }} onPress={() => navigate("next")}>
            <Text style={{ textAlign: "center" }}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </View>

  <Modal visible={isModalVisible} animationType="slide" transparent={true} onRequestClose={hideModal}>
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "90%", height: "auto", backgroundColor: "white", padding: 18, borderRadius: 10, border: "1vh solid black" }}>
          <View style={{ width: "100%", justifyContent: "flex-end", flexDirection: "row", paddingBottom: 8 }}>
            <TouchableOpacity>
              <Icon name="close" size={30} color="black" onPress={hideModal} style={{ alignSelf: "flex-end" }} />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", maxWidth: "100%" }}>
            {/* Color pickers */}
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

  <View style={{ flexDirection: "row", width: "100%", height: 50, marginTop: 5, marginBottom: 5 }}>
    <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "darkslategrey" }} onPress={handleRefresh}>
      <Text style={{ color: "white" }}>Refresh</Text>
    </TouchableOpacity>
  </View>
</>

  );
};

export default App;
