import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator, StatusBar } from 'react-native';
import DeviceList from './components/DeviceList';
import DataDisplay, { type PinecilData } from './components/DataDisplay';
import useBLE from './hooks/useBLE';
import { Device } from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import Material from "@expo/vector-icons/MaterialIcons";

const BULK_SERVICE_UUID = '9eae1000-9d0d-48c5-aa55-33e27f9bc533';
const BULK_LIVE_DATA_CHAR_UUID = '9eae1001-9d0d-48c5-aa55-33e27f9bc533';

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState<PinecilData | null>(null);
  const [pollId, setPollId] = useState<NodeJS.Timeout | null>(null);

  const {
    allDevices,
    connectedDevice,
    connectToDevice,
    requestPermissions,
    scanForPeripherals
  } = useBLE();

  const beginPinecilDataPoll = useCallback(async (device: Device) => {
    try {
      console.log('Starting data streaming for device:', device.id);

      if (!device) {
        throw new Error('No device connected');
      }

      const services = await device.services();
      const targetService = services.find(service => service.uuid === BULK_SERVICE_UUID);

      if (!targetService) {
        throw new Error(`Service ${BULK_SERVICE_UUID} not found`);
      }

      const characteristics = await targetService.characteristics();
      const targetChar = characteristics.find(
        char => char.uuid === BULK_LIVE_DATA_CHAR_UUID
      );

      if (!targetChar) {
        throw new Error(`Characteristic ${BULK_LIVE_DATA_CHAR_UUID} not found`);
      }

      const id = setInterval(async () => {
        try {
          if (!device) {
            return;
          }
          const data = await targetChar.read();
          poll(data.value || "");
        } catch (error) {
          console.error('Error reading data:', error);
        }
      }, 200);
      setPollId(id);

      console.log('Polling started successfully');
    } catch (error) {
      console.error('Error starting data stream:', error);
    }
  }, []);

  const poll = (data: string) => {
    const decodedBytes = base64.decode(data);
    const dataView = new DataView(new TextEncoder().encode(decodedBytes).buffer);

    setData({
      temperature: dataView.getUint32(0 * 4, true),
      setpoint: dataView.getUint32(1 * 4, true),
      inputVoltage: dataView.getUint32(2 * 4, true) / 10,
      handleTemperature: dataView.getUint32(3 * 4, true) / 10,
      powerWatts: dataView.getUint32(4 * 4, true) / 10
    });
  }

  const handleConnect = useCallback(async (device: Device) => {
    try {
      console.log(`Connecting to device: ${device.id}`);
      setIsModalVisible(false);

      await connectToDevice(device);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await beginPinecilDataPoll(device);
    } catch (error) {
      console.error('Connection failed:', error);
      Alert.alert('Connection Failed', 'Could not connect to the device');
    }
  }, [connectToDevice, beginPinecilDataPoll]);

  const handleDisconnect = async () => {
    if (!connectedDevice) return;
    if (pollId) clearInterval(pollId);
    await connectedDevice.cancelConnection()
  }

  const handleScan = useCallback(async () => {
    try {
      const isPermissionsEnabled = await requestPermissions();
      if (isPermissionsEnabled) {
        await scanForPeripherals();
        setIsModalVisible(true);
      } else {
        Alert.alert('Permissions Required', 'Bluetooth permissions are needed to scan');
      }
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Scan Error', 'Could not start device scan');
    }
  }, [requestPermissions, scanForPeripherals]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#181616" barStyle="light-content" />
      
      {!connectedDevice ? (
        <View>
          <Text style={styles.title}>blehh :3</Text>
          <TouchableOpacity style={styles.connectButton} onPress={handleScan}>
            <Material name="bluetooth-searching" size={24} color="#0d0c0c" />
            <Text style={styles.buttonText}>Connect to BLE Device</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {data ? <DataDisplay onDisconnect={handleDisconnect} data={data} device={connectedDevice} /> : <View>
            <Text style={styles.connectingText}>Connecting...</Text>
            <ActivityIndicator size="large" color="#938AA9" />
            </View>}
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <DeviceList onDeviceSelect={handleConnect} devices={allDevices} />
      </Modal>
      <Text style={styles.footer}>Made with ❤️ by Vince</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181616',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#c5c9c5',
    marginBottom: 20,
  },
  connectingText: {
    fontSize: 24,
    color: '#c5c9c5',
    textAlign: 'center',
    marginBottom: 20,
  },
  connectButton: {
    backgroundColor: '#87a987',
    flexDirection: 'row',
    gap: 10,
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#0d0c0c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    fontSize: 16,
    color: '#938AA9',
  },
});