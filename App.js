import React, { Component } from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {createAppContainer} from "react-navigation";
import {createStackNavigator} from 'react-navigation-stack';
import { HeaderButtons, HeaderButton, Item } from 'react-navigation-header-buttons';
import {createDrawerNavigator} from 'react-navigation-drawer';
import HomeScreen from "./screens/HomeScreen";
import ClienteScreen from "./screens/ClienteScreen";
import DetalleScreen from "./screens/DetalleScreen";

class NavigationDrawerStructure extends Component {
  //Structure for the navigatin Drawer
  toggleDrawer = () => {
    //Props to open/close the drawer
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.toggleDrawer.bind(this)}>
            {/*Donute Button Image */}
            <Image
                source={require('./src/image/menu.png')}
                style={{ width: 25, height: 25, marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>
    );
  }
}

const HomeNavigator = createStackNavigator({
      Home: {
            screen: HomeScreen,
            navigationOptions: ({ navigation }) => ({
                  title: 'Listado de Clientes',
                  headerLeft: <NavigationDrawerStructure navigationProps={navigation} />
          })
      }
},
    { headerLayoutPreset : 'center'}
);

const ClienteNavigator = createStackNavigator({
        Cliente: {
            screen: ClienteScreen,
            navigationOptions: ({ navigation }) => ({
                title: 'Alta de Cliente',
                headerLeft: <NavigationDrawerStructure navigationProps={navigation} />
            })
        }
    },
    { headerLayoutPreset : 'center'}
);

const DetalleNavigator = createStackNavigator({
        Detalle: {
            screen: DetalleScreen,
            navigationOptions: ({ navigation }) => ({
                title: 'Detalle',
                headerLeft: <NavigationDrawerStructure navigationProps={navigation} />
            })
        }
    },
    { headerLayoutPreset : 'center'}
);

const DrawerNavigator = createDrawerNavigator({
    //Drawer Optons and indexing

    Home: {
        //Title
        screen: HomeNavigator,
        navigationOptions: {
            drawerLabel: 'Listado Clientes',
            drawerIcon: ({ tintColor }) => (
                <Image
                    source={require("./src/image/clientes.png")}
                    resizeMode="contain"
                    style={{ width: 20, height: 20, tintColor: tintColor }}
                />
            )
        },
    },
    Cliente: {
        //Title
        screen: ClienteNavigator,
            navigationOptions: {
            drawerLabel: 'Alta Cliente',
                drawerIcon: ({ tintColor }) => (
                <Image
                    source={require("./src/image/new-user.png")}
                    resizeMode="contain"
                    style={{ width: 20, height: 20, tintColor: tintColor }}
                />
            )
        },
    },
    Detalle: {
        //Title
        screen: DetalleNavigator,
        navigationOptions: {
            drawerLabel: 'Detalle',
            drawerIcon: ({ tintColor }) => (
                <Image
                    source={require("./src/image/new-user.png")}
                    resizeMode="contain"
                    style={{ width: 20, height: 20, tintColor: tintColor }}
                />
            )
        },
    }

});

export default createAppContainer(DrawerNavigator);
