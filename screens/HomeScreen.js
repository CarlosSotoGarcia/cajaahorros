import React, {Component} from "react";
import {StyleSheet, View, Text, SectionList, RefreshControl, Image, Platform } from "react-native";
import Swipeout from "react-native-swipeout";
import { Stitch, RemoteMongoClient, AnonymousCredential } from "mongodb-stitch-react-native-sdk";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Confetti from "react-native-confetti";
import moment from "moment";

export default class HomeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUserId: undefined,
            client: undefined,
            clientes: undefined,
            refreshing: false,
            idCliente: undefined
        };
        this._loadClient = this._loadClient.bind(this);
    }


    componentDidMount() {
        this._loadClient();
    }

    render() {
        const sections =
            this.state.clientes == undefined
                ? [{ data: [{ title: "Loading..." }], title: "Loading..." }]
                : this.state.clientes.length > 0
                ? [{ data: this.state.clientes, title: "Lista de Clientes" }]
                : [
                    {
                        data: [{ title: "No hay clientes" }],
                        title: "No hay clientes"
                    }
                ];
        return (
            <SectionList
                style={{ ...styles.container }}
                renderItem={this._renderItem}
                renderSectionHeader={this._renderSectionHeader}
                stickySectionHeadersEnabled={true}
                keyExtractor={(item, index) => index}
                sections={sections}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                }
            />


        );
    }

    _renderSectionHeader = ({ section }) => {
        return <SectionHeader title={section.title} />;
    };

    _renderItem = ({ item }) => {
        return (
            <SectionContent>
                <Confetti
                    confettiCount={50}
                    timeout={10}
                    duration={2000}
                    ref={node => (this._confettiView = node)}
                />
                <Swipeout
                    autoClose={true}
                    backgroundColor="none"
                    right={[
                        {
                            component: (
                                <View style={{
                                    flex: 1,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column"
                                }}>
                                    <Image
                                        source={require('../src/image/pay.png')}
                                        style={{ width: 30, height: 30, marginLeft: 0 }}
                                    />
                                </View>
                            ),
                            backgroundColor: "green",
                            onPress: () => this.props.navigation.navigate('Detalle')
                        }
                    ]}
                >
                    <View style={styles.clienteListTextTime}>
                        {item.title != "No hay clientes" && item.nombre != "Loading..." ? (
                            <Text style={styles.clienteListTextTime}>
                                {moment(item.date).fromNow()}
                            </Text>
                        ) : item.title == "No hay clientes" ? (
                            <Image
                                source={require('../src/image/cancelar.png')}
                                style={{ width: 30, height: 30, marginLeft: 0 }}
                            />
                        ) : (
                            <Text />
                        )}
                    </View>
                    <Text style={styles.sectionContentText}>
                        {item.title != "No hay clientes" ? item.nombre + " Saldo: " + item.monto: ""}
                    </Text>
                </Swipeout>
            </SectionContent>
        )};


    _onRefresh = () => {
        this.setState({ refreshing: true });
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("cajaahorros");
        const tasks = db.collection("clientes");
        tasks
            .find()
            .asArray()
            .then(docs => {
                this.setState({ clientes: docs });
                this.setState({ refreshing: false });
            })
            .catch(err => {
                console.warn(err);
            });
    };

    _loadClient() {
        Stitch.initializeDefaultAppClient("cajaahorros-agjnx").then(client => {
            this.setState({ client });
            this.state.client.auth
                .loginWithCredential(new AnonymousCredential())
                .then(user => {
                    console.log(`Successfully logged in as user ${user.id}`);
                    this.setState({ currentUserId: user.id });
                    this.setState({ currentUserId: client.auth.user.id });
                })
                .catch(err => {
                    console.log(`Failed to log in anonymously: ${err}`);
                    this.setState({ currentUserId: undefined });
                });
            const stitchAppClient = Stitch.defaultAppClient;
            const mongoClient = stitchAppClient.getServiceClient(
                RemoteMongoClient.factory,
                "mongodb-atlas"

            );
            const db = mongoClient.db("cajaahorros");
            const clientes = db.collection("clientes");
            clientes.find().asArray().then(docs => {
                this.setState({clientes: docs});
                console.log("Se cargaron los datos")
            }).catch(err => {
                console.warn(err);
            })
        });

    }
}
const SectionContent = props => {
    return <View style={styles.sectionContentContainer}>{props.children}</View>;
};
const SectionHeader = ({ title }) => {
    return (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    text : {
        color: "#fff"
    },
    sectionContentText: {
        color: "black",
        fontSize: 15,
        paddingBottom: 10,
        paddingHorizontal: 10,
        textAlign: "left"
    },
    clienteListTextTime: {
        paddingHorizontal: 15,
        paddingVertical: 3,
        textAlign: "center",
        color: "lightgray"
    },
    sectionContentContainer: {
        paddingHorizontal: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "lightgray"
    },
    sectionHeaderContainer: {
        backgroundColor: "#fbfbfb",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#ededed",
        alignItems: "center"
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: "bold"
    }
});
