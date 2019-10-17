import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    Keyboard,
    FlatList,
    SectionList,
    RefreshControl
} from "react-native";
import {Stitch} from "mongodb-stitch-react-native-core";
import {RemoteMongoClient} from "mongodb-stitch-react-native-services-mongodb-remote";
import Confetti from "react-native-confetti";
import moment, {parseTwoDigitYear} from "moment";

export default class DetalleScreen extends Component {
    constructor(props) {
        console.log("DetalleScreen");
        super(props);
        this.state = {
            value: false,
            cliente: undefined,
            abono: undefined,
            abonos: [],
            refreshing: false,
        }
        this._loadClient = this._loadClient.bind(this);
    }
    render() {
        const { navigation  } = this.props;
        const { goBack } = this.props.navigation;
        const item = this.state.cliente == undefined ?
            "" : this.state.cliente;

        const sections =
            this.state.abonos == undefined
                ? [{ data: [{ title: "Loading..." }], title: "Loading..." }]
                : this.state.abonos.length > 0
                ? [{ data: this.state.abonos, title: "Lista de Abonos" }]
                : [
                    {
                        data: [{ title: "No hay Abonos" }],
                        title: "No hay Abonos"
                    }
                ];
        return (
            <View style={styles.container}>
                <View style={styles.containerFormulario}>
                    <Confetti
                        confettiCount={50}
                        timeout={10}
                        duration={2000}
                        ref={node => (this._confettiView = node)}
                    />
                    <Text style={styles.sectionContentText}> RFC: {item.rfc} </Text>
                    <Text style={styles.sectionContentText}> Nombre: {item.nombre} </Text>
                    <Text style={styles.sectionContentText}> Monto: {item.monto} </Text>

                    <TextInput keyboardType={'numeric'}
                               placeholder="Abono"
                               style={styles.abono}
                               onChangeText={abono => this.setState({ abono })}
                               value={this.state.abono}
                               onSubmitEditing={() => this.handleSubmit()}
                    />
                    <TouchableOpacity onPress={() => this.handleSubmit()} style={{marginTop: 20}}>
                        <Image
                            source={require('../src/image/new-user.png')}
                            style={{ width: 25, height: 25, marginLeft: 5 }}
                        />
                    </TouchableOpacity>
                </View>
                <SectionList
                    style={{ ...styles.containerSelection }}
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
                    }/>

            </View>

        )
    }

    _onRefresh = () => {
        console.log("Refresh");
        this.setState({ refreshing: true });
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("cajaahorros");
        const pagosCollection = db.collection("pagos");
        pagosCollection.find({rfc: '123'})
            .asArray().then(docs => {
            this.setState({abonos: docs});
            this.state.abonos = docs;
        }).catch(err => {
            console.warn(err);
        })
    }
    _renderItem = ({ item }) => {
        return (
            <SectionContent>
                <Text style={styles.sectionContentText}>
                    {item.title != "No hay Abonos" ? moment(item.date).format('d MMM YY') + "  ---- $" + item.abono: ""}
                </Text>
            </SectionContent>
        )
    };

    _renderSectionHeader = ({ section }) => {
        return <SectionHeader title={section.title} />;
    };


    handleSubmit = () => {
        Keyboard.dismiss();
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("cajaahorros");
        const pagosCollection = db.collection("pagos");
        if (this.state.abono != "") {
            pagosCollection.insertOne({
                date: new Date(),
                rfc: this.state.cliente.rfc,
                abono: this.state.abono
            }).then(() => {
                if (this._confettiView) {
                    this._confettiView.startConfetti();
                }
                this.setState({ value: !this.state.value });
                this.setState({ abono: undefined });
            }).catch(err => {
                console.warn(err);
            });
            pagosCollection.find({rfc: '123'}).asArray().then(docs => {
                this.setState({abonos: docs});
                this.state.abonos = docs;
                console.log("Se cargaron los datoss " + docs.length)
            }).catch(err => {
                console.warn(err);
            })
        };
        const clienteCollection = db.collection("clientes");
        clienteCollection.updateOne(
            {_id: this.state.cliente._id},
            {$set: {monto: parseInt(this.state.cliente.monto) + parseInt(this.state.abono)}},
            {upsert: true}
        ).then(() => {
            clienteCollection.findOne({rfc: this.state.cliente.rfc}).then(doc => {
                this.setState({cliente: doc});
                this.state.cliente = doc;
                console.log("Se cargaron los datos " + doc.nombre)}
            ).catch(err => {
                console.warn(err);
            });
        })

    }

    componentWillMount() {
        console.log("componentDidMount");
        this._loadClient();
    }

    _loadClient() {
        console.log("Load");
        this.state.abonos = [];
        this.state.cliente = undefined;
        this.setState({cliente: null});
        this.setState({abonos: []});
        const stitchAppClient = Stitch.defaultAppClient;
        const mongoClient = stitchAppClient.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        const db = mongoClient.db("cajaahorros");
        const clientesCollection = db.collection("clientes");
        clientesCollection.findOne({rfc: '123'}).then(doc => {
            this.setState({cliente: doc});
            this.state.cliente = doc;
            console.log("Se cargaron los datos " + doc.nombre)
        }).catch(err => {
            console.warn(err);
        })

        const pagosCollection = db.collection("pagos");
        pagosCollection.find({rfc: '123'}).asArray().then(docs => {
            this.setState({abonos: docs});
            this.state.abonos = docs;
            console.log("Se cargaron los datos " + docs.length)
        }).catch(err => {
            console.warn(err);
        })
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
        flex: 3,
        backgroundColor: "#fff",
    },
    containerFormulario: {
        flex: 1,
        backgroundColor: "#fff",
    },
    containerSelection: {
        flex: 2,
        backgroundColor: "#fff",
    },
    sectionContentText: {
        color: "black",
        fontSize: 15,
        paddingBottom: 10,
        paddingHorizontal: 10,
        textAlign: "center",
        alignItems: "center"
    },
    abono : {
        color: "lightgray",
        fontSize: 15,
        paddingBottom: 10,
        paddingHorizontal: 10,
        textAlign: "center",
        alignItems: "center"
    },
    tableHead:{
        flex: 1,
        flexDirection:'row',
    },
    header:{
        fontWeight:'bold'
    },
    row:{
        flex:1,
        flexDirection:'row'
    },
    sectionHeaderText: {
        fontSize: 14,
        fontWeight: "bold"
    }
});