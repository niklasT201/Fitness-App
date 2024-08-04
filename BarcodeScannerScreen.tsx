import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

interface BarcodeScannerScreenProps {
  onBarCodeScanned: (data: string) => void;
  onClose: () => void;
}

const BarcodeScannerScreen: React.FC<BarcodeScannerScreenProps> = ({ onBarCodeScanned, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const cameraPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
      const result = await request(cameraPermission);
      setHasPermission(result === RESULTS.GRANTED);
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    onBarCodeScanned(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={handleBarCodeScanned}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.focusedContainer}>
            <Text style={styles.scanText}>Scan a barcode</Text>
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
      </RNCamera>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    height: 500,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: 'black',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  focusedContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default BarcodeScannerScreen;