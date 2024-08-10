import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image  } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

const { width } = Dimensions.get('window');
const overlayWidth = width * 0.8;

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
    return <Text style={styles.permissionText}>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.permissionText}>No access to camera</Text>;
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
          <View style={styles.rectangleContainer}>
            <View style={styles.rectangle}></View>
          </View>
          <Text style={styles.scanText}>Align the barcode within the frame</Text>
        </View>
        <View style={styles.unfocusedContainer}></View>
      </View>
    </RNCamera>
    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
     <Image source={require('./assets/close.png')} />
    </TouchableOpacity>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  overlay: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  focusedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rectangleContainer: {
    width: overlayWidth,
    height: overlayWidth * 0.6,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rectangle: {
    width: overlayWidth - 20,
    height: (overlayWidth * 0.6) - 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
  },
  scanText: {
    marginTop: 20,
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  permissionText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 18,
    color: '#fff',
    backgroundColor: '#000',
  },
});

export default BarcodeScannerScreen;