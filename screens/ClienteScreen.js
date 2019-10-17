import React, {Component} from "react";
import {
    Platform,
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    TextInput,
    Dimensions,
    Image
} from "react-native";
import Confetti from "react-native-confetti";
import {Stitch, RemoteMongoClient, AnonymousCredential} from "mongodb-stitch-react-native-sdk";

var height = Dimensions.get("window").height;

export default class ClienteScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: false,
            nombreCliente: "",
            monto: undefined,
            rfc: undefined
        };
    }

    handleSubmit = () => {
        Keyboard.dismiss();
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );

        const db = mongoClient.db("cajaahorros");
        const clientes = db.collection("clientes");
        if (this.state.rfc != "") {
            clientes
                .insertOne({
                    monto: this.state.monto,
                    nombre: this.state.nombreCliente,
                    date: new Date(),
                    rfc: this.state.rfc

                })
                .then(() => {
                    if (this._confettiView) {
                        this._confettiView.startConfetti();
                    }
                    this.setState({ value: !this.state.value });
                    this.setState({ rfc: "" });
                    this.setState({ nombreCliente: "" });
                    this.setState({ monto: undefined });
                })
                .catch(err => {
                    console.warn(err);
                });
        }
    };

    render() {
        return (
                <View style={styles.container}>
                    <Confetti
                        confettiCount={50}
                        timeout={10}
                        duration={2000}
                        ref={node => (this._confettiView = node)}
                    />
                    <TextInput
                        style={{
                            color: "black",
                            fontSize: 20,
                            marginTop: 0
                        }}
                        placeholder="RFC"
                        onChangeText={rfc => this.setState({ rfc })}
                        value={this.state.rfc}
                        onSubmitEditing={() => this.handleSubmit()}
                    />
                    <TextInput
                        style={{
                            color: "black",
                            fontSize: 20,
                            marginTop: 20
                        }}
                        placeholder="Nombre del Cliente"
                        onChangeText={nombreCliente => this.setState({ nombreCliente })}
                        value={this.state.nombreCliente}
                        onSubmitEditing={() => this.handleSubmit()}
                    />
                    <TextInput
                        style={{
                            color: "black",
                            fontSize: 20,
                            marginTop: 40
                        }}
                        keyboardType={'numeric'}
                        placeholder="Monto Inicial"
                        onChangeText={monto => this.setState({ monto })}
                        value={this.state.monto}
                        onSubmitEditing={() => this.handleSubmit()}
                    />
                    <TouchableOpacity onPress={() => this.handleSubmit()} style={{marginTop: 20}}>
                        <Image
                            source={require('../src/image/new-user.png')}
                            style={{ width: 25, height: 25, marginLeft: 5 }}
                        />
                    </TouchableOpacity>
                </View>
            );
    }

    componentDidMount() {
        //this._loadClient();
    }
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

        });

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    }
});