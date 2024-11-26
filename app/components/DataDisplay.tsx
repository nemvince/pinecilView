import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Device } from 'react-native-ble-plx';

interface DataDisplayProps {
  data: PinecilData;
  device: Device;
  onDisconnect: () => void;
}

export type PinecilData = {
  temperature: number;
  setpoint: number;
  inputVoltage: number;
  handleTemperature: number;
  powerWatts: number;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ data, device, onDisconnect }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.smTitle}>Connected to</Text>
        <Text style={styles.title}>{device.name}</Text>
      </View>
      <View style={styles.dataContainer}>
        <DataItem icon="thermostat" label="Temperature" value={`${data.temperature}°C`} />
        <DataItem icon="speed" label="Setpoint" value={`${data.setpoint}°C`} />
        <DataItem icon="device-thermostat" label="Handle" value={`${data.handleTemperature}°C`} />
        <DataItem icon="battery-charging-full" label="Input Voltage" value={`${data.inputVoltage}V`} />
        <DataItem icon="power" label="Power" value={`${data.powerWatts}W`} />
      </View>
      <TouchableOpacity style={styles.disconnectButton} onPress={onDisconnect}>
        <MaterialIcons name="power-settings-new" size={24} color="#0d0c0c" />
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>
    </View>
  );
};

interface DataItemProps {
  icon: string;
  label: string;
  value: string;
}

const DataItem: React.FC<DataItemProps> = ({ icon, label, value }) => {
  return (
    <View style={styles.dataRow}>
      <View style={styles.dataName}>
        <MaterialIcons name={icon as any} size={32} color="#938AA9" />
        <Text style={styles.dataLabel}>{label}</Text>
      </View>
      <View>
        <Text style={styles.dataValue}>{value}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c5c9c5',
    textAlign: 'center',
  },
  smTitle: {
    fontSize: 16,
    color: '#938AA9',
    textAlign: 'center',
  },
  dataContainer: {
    width: '100%',
    padding: 30,
  },
  dataRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dataName: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a6a69c',
    marginLeft: 10,
  },
  dataValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#c5c9c5',
    marginTop: 5,
  },
  disconnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E46876',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#0d0c0c',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default DataDisplay;
