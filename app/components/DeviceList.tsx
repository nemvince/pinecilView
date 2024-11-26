import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Device } from 'react-native-ble-plx';
import Material from "@expo/vector-icons/MaterialIcons";

interface DeviceListProps {
    devices: Device[];
    onDeviceSelect: (device: Device) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({ onDeviceSelect, devices }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select a Device</Text>
            <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.deviceItem}
                        onPress={() => onDeviceSelect(item)}
                    >
                        <Material name="bluetooth" size={24} color="#938AA9" style={styles.icon} />
                        <Text style={styles.deviceName}>{item.name}</Text>
                        <Material name="chevron-right" size={24} color="#938AA9" style={styles.chevron} />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#181616',
        marginTop: 50,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#c5c9c5',
        textAlign: 'center',
    },
    deviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#0d0c0c',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    deviceName: {
        fontSize: 18,
        color: '#c5c9c5',
        flex: 1,
        marginLeft: 10,
    },
    icon: {
        marginRight: 10,
    },
    chevron: {
        marginLeft: 'auto',
    },
});

export default DeviceList;
