import React from "react";
import Ionicons from "react-native-ionicons";
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, ScrollView, PermissionsAndroid, RefreshControl } from "react-native";
import Geolocation from '@react-native-community/geolocation';
// import Icon from "react-native-ionicons";
// import { Button } from "react-native-elements";
// import MenuSearchComponent from "../components/MenuSearchComponent";
import {getWeatherData, getBMKGData} from '../communication/ApiEndpoints';
import { withNavigationFocus } from 'react-navigation'; 
const parseString = require('react-native-xml2js').parseString;

class HomeScreen extends React.Component {
  static navigationOptions = {
		header: null
	};
  constructor(props) {
    super(props);
    this.state = {
      latitude: null,
      longitude: null,
      error: null,
      refresh: false,
      city: '-',
      temp : 0
    };

    this.requestLocationPermission = this.requestLocationPermission.bind(this);
    this.setCityTemp = this.setCityTemp.bind(this);
    // this.refreshCurrentPos = this.refreshCurrentPos.bind(this);
  }

  requestLocationPermission = async () => {
    if(Platform.OS !== 'ios'){
      console.log('Android');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'QuakeZone Permission',
          message:
            'QuakeZone needs access to your Location ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if(granted === PermissionsAndroid.RESULTS.GRANTED){
        this.getLocation();
      }else{
        alert('Error');
      }
      
    }else{
      console.log('ios');
      this.getLocation();
    }
  }

  getLocation = () => {
    return new Promise((resolve, reject) => {
          this.watchId = Geolocation.getCurrentPosition( position => {
            getWeatherData(position.coords.latitude, position.coords.longitude)
            .then(res => {
              this.setState({
                ...this.state,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                refresh: false
              }, () => {
                this.setCityTemp(res);
              })
            });
            
          }, (error) => {
            this.setState({
              ...this.state,
              error: error.message
            })
          }, 
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );

    })
  }

  refreshCurrentPos = async () => {
    try{
      Geolocation.getCurrentPosition((pos) => {
        getWeatherData(pos.coords.latitude, pos.coords.longitude)
        .then(res => {
          console.log(res);
          this.setState({
            ...this.state,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            refresh: false
          }, () => {
            this.setCityTemp(res);
          })
        });
      })
    }catch(err){
      console.warn(err);
    }
  }

  setCityTemp = (data) => {
    this.setState({
      ...this.state,
      city: data.city,
      temp: data.observation[0].temperature
    })
  }

  componentDidMount() {
    getBMKGData().then(data => {
      console.log(data);
      parseString(data.data, function (err, result) {
        var gempa = result.Infogempa.Gempa;
        // console.log(gempa.length-1);
        // console.log(JSON.stringify(result, null, 2))
      });
    });
    this.requestLocationPermission();
  }

  componentWillUnmount() {
   Geolocation.clearWatch(this.watchId);
  }

  render() {

    // console.log('asdadasd');
    return (
      <ScrollView style={{height:'100%',}} contentContainerStyle={{flexGrow:1}}
      refreshControl={
        <RefreshControl 
        refreshing={this.state.refresh}
        onRefresh={() => this.refreshCurrentPos()}
        />
      }
      >
      <View style={styles.wraps}>
      
      
        {/* {Platform.OS !== 'ios' && (
          <MenuSearchComponent
          onMenuClick={() => {
            this.props.navigation.toggleDrawer();
          }}
        />
        )} */}
        
        
        <View style={styles.Fourty}>
          <Image
            source={require("../assets/STORMY.jpg")}
            style={{ width: "100%", height: "100%" }}
          />
          <View style={styles.overlayFirst}>
            <View style={styles.TempWeather}>
              <Image
                source={require("../assets/rain.png")}
                style={{ marginBottom: 7, height: "50%", width: "50%" }}
              />
              <Text style={styles.TempText}>{this.state.temp}º C</Text>
            </View>

            <View style={{ marginBottom: 7, alignSelf: "flex-end", width: "45%" }}>
              <Text style={styles.City}>{this.state.city}</Text>
            </View>
          </View>
        </View>

        <View style={styles.Twenty}>
          <Image
            source={require("../assets/kolkata-map.jpg")}
            style={{ width: "100%", height: "100%" }}
          />
          <View style={styles.overlayMiddle}>
            <View style={styles.InnerMiddle}>
              <Text style={styles.MiddleText}>
                Tectonic Earthquake just happened 5M, in the city of Solok{" "}
              </Text>

              <View style={styles.TextRaw}>
                <Text style={styles.MiddleText}>Time : a{' '}</Text>
                <Text style={styles.MiddleText}>Magnitude : b{' '}</Text>
                <Text style={styles.MiddleText}>Depth : C</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.overlay}>

          {/* Warning Notification */}
          <View style={styles.redWarning}>
            <Text style={styles.textWarning}>Earthquake Early Warning : Padang</Text>
          </View>
          {/* End Warning Notification */}
          
          <Image
            source={require("../assets/kolkata-map.jpg")}
            style={{ width: "100%", height: "100%" }}
          />

            <View style={styles.firstRow}>
              <View style={styles.firstLayer}>
                <Text style={styles.textStyle}>1 Hari yang Lalu</Text>
                <Text style={styles.textEpicenter}>1 Mar 2019</Text>
                <Text style={styles.textStyle}>08:35:51 WIB</Text>
              </View>

              <View style={styles.firstLayerMiddle}>
                {/*this.DrawSeparator("first",true,)*/}
              </View>

              <View style={styles.firstLayer}>
                <Text style={styles.textStyle}>
                  <Ionicons
                    size={40}
                    name="pulse"
                    color="red"
                  />
                </Text>
                <Text style={styles.textEpicenter}>2.9</Text>
                <Text style={styles.textStyle}>Magnitudo</Text>
              </View>

              <View style={styles.firstLayerMiddle} />
                {/*this.DrawSeparator("first",true,)*/}

              <View style={styles.firstLayer}>
                <Text style={styles.textStyle}>
                <Ionicons size={40} name="wifi" color="green" />
                </Text>
                <Text style={styles.textEpicenter}>10 KM</Text>
                <Text style={styles.textStyle}>Kedalaman</Text>
              </View>
              {/* </View> */}

            </View>

            <View style={styles.secondRow}>
              <View style={styles.secondLayer}>
                <Ionicons size={20} name="locate" color="yellow" />
                <Text style={styles.bottomText}>
                Pusat Gempa berada di darat laut 11 KM timur laut Lombok Tengah</Text>
              </View>

              <View style={styles.secondLayerMiddle}/>

              <View style={styles.secondLayer}>
              <Ionicons size={20} name="wifi" color="yellow" />
                <Text style={styles.bottomText}>Dirasakan (MMI): {'\n'}III Lombok Tengah</Text>
              </View>

            </View>

        </View>
      
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  wraps: {
    flex:1,
    // justifyContent: 'space-around',
    // alignItems: 'center',
    height:'100%',
    width:'100%'
  },
  container: {
    flexDirection: "row",
    height: "100%",
    width: "100%"
  },
  ButtonStyle: {
    height: "100%",
    width: "100%",
    borderWidth: 2,
    borderColor: "black",
    backgroundColor: "red",
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  margin: {
    margin: 6
  },
  rightBorder: {
    width: "48%",
    height: "40%",
    borderRightWidth: 2,
    borderColor: "black"
  },
  thirdMain: {
    borderRightWidth: 2,
    borderColor: "black",
    width: "33%"
  },
  TempWeather: {
    height: "100%",
    width: "50%"
  },
  City: {
    bottom: 0,
    color: "white",
    fontSize: 25,
    position: "absolute",
    alignSelf: "flex-end"
  },
  TextCenter: {
    paddingTop: 6,
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold"
  },
  ViewContentCenter: {
    justifyContent: "center",
    alignItems: "center"
  },
  TempText: {
    bottom: 0,
    marginLeft: 8,
    marginBottom: 5,
    position: "absolute",
    color: "white",
    fontSize: 40
  },
  MiddleText: {
    color: "white",
    fontSize: 16
  },
  Fourty: {
    width: "100%",
    height: '40%',
    position:'relative'
    // height: 200
  },
  Twenty: {
    width: "100%",
    height: "20%"
  },
  overlayFirst: {
    flexDirection: "row",
    height: "70%",
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0)",
    bottom: 0
  },
  overlayMiddle: {
    backgroundColor: "rgba(0,0,0,0.5)",
    height: "100%",
    width: "100%",
    position: "absolute"
  },
  InnerMiddle: {
    marginLeft: 4,
    bottom: 10,
    position: "absolute",
    height: "50%",
    width: "100%"
  },
  overlayBottom: {
    flexDirection: "row",
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    bottom: 0
  },
  bottom: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "flex-end"
  },
  BottomFirst: {
    width: "100%",
    height: "40%",
    borderTopWidth: 2
  },
  BottomSecond: {
    width: "100%",
    height: "60%",
    borderTopWidth: 2,
    borderTopColor: "black"
  },
  BottomSecondInner: {
    width: "100%",
    height: "50%",
    flexDirection: "row"
  },
  TextRaw: {
    marginTop: 4,
    flexDirection: "row"
  },
  // overlay: {
  //   width: '100%',
  //   height:'auto',
  //   position: 'absolute',
  //   backgroundColor: 'rgba(0,0,0,0.3)',
  //   bottom: 0
  // },

  firstRow: {
    flexDirection: 'row',
    height: "30%",
    width: "100%",
    position:'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
    top:0,
    borderBottomWidth: 1,
    borderColor:'#FFF',
    // paddingBottom:1
  },
  secondRow: {
    flexDirection: 'row',
    height: "10%",
    width: "100%",
    position:'absolute',
    backgroundColor: 'rgba(0,0,0,0.4)',
    top:'30%',
    paddingTop:'1%'
  },
  firstLayer: {
    paddingTop:'23%',
    height: "100%",
    width: "32%"
  },
  secondLayer: {
    // paddingTop:'30%',
    flexDirection: "row",
    height: "100%",
    width: "45%",
    paddingLeft:20,
    flex:1,
    alignItems: 'center',
    justifyContent:'center'
  },
  textStyle: {
    paddingTop: 6,
    textAlign: 'center',
    color: "#ffffff",
    fontSize: 13,
    // fontWeight: 'bold'
  },
  bottomText: {
    padding: 6,
    color: "#ffffff",
    fontSize: 13,
  },
  firstLayerMiddle:
  {
    marginTop: '20%',
    borderLeftWidth: 1,
    borderColor: '#FFF',
    height: "50%",
    width: "1%"
  },
  secondLayerMiddle: {
    top:'2%',
    borderLeftWidth: 1,
    borderColor: '#FFF',
    marginLeft:30,
    height: "90%",
    width: "1%"
  },
  textEpicenter: {
    paddingTop: 6,
    textAlign: 'center',
    color: "#ffffff",
    fontSize: 18,
    fontWeight: 'bold'
  },

  redWarning: {
    width:'100%',
    height:'auto',
    padding:6,
    position:'absolute',
    backgroundColor:'#E55E5E',
    top:0,
    zIndex: 5
  },
  textWarning: {
    fontSize:20,
    fontWeight:'bold'
  }
});

export default withNavigationFocus(HomeScreen);