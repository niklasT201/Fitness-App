import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image, StatusBar, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import { useTheme } from './ThemeContext'; 

const { width, height } = Dimensions.get('window');
const overlayWidth = width * 0.8;

interface BarcodeScannerScreenProps {
  onBarCodeScanned: (productName: string) => void; // Update the type to return a product name
  onClose: () => void;
}

const BarcodeScannerScreen: React.FC<BarcodeScannerScreenProps> = ({ onBarCodeScanned, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedProduct, setScannedProduct] = useState<string | null>(null);
  const { isDarkTheme } = useTheme();  // Use the theme context
  const colorSwitch = isDarkTheme ? '#603ca6' : '#4CAF50';

  useEffect(() => {
    (async () => {
      const cameraPermission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
      const result = await request(cameraPermission);
      setHasPermission(result === RESULTS.GRANTED);
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    // Use the Open Food Facts API to fetch product information
    const apiUrl = `https://world.openfoodfacts.org/api/v0/product/${data}.json`;

    try {
      const response = await fetch(apiUrl);
      const product = await response.json();
      
      if (product.status === 1) {
        const productName = product.product.product_name || 'Unknown Product';
        setScannedProduct(productName); // Set the product name from the API response
        onBarCodeScanned(productName); // Pass the product name back to CaloriesScreen
      } else {
        Alert.alert('Product not found', 'The scanned product is not available in the database.');
        setScannedProduct('Product not found');
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch product information. Please try again.');
    }
  };

  if (hasPermission === null) {
    return <Text style={styles.permissionText}>Requesting camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text style={styles.permissionText}>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Change the StatusBar color to fit the barcode scanner theme */}
      <StatusBar barStyle="light-content" backgroundColor="black" />

      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        onBarCodeRead={scannedProduct ? undefined : handleBarCodeScanned}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer}></View>
          <View style={styles.focusedContainer}>
            <View style={styles.rectangleContainer}>
              <View style={[styles.rectangle, { borderColor: colorSwitch }]}></View>
            </View>
            <Text style={styles.scanText}>Align the barcode within the frame</Text>
          </View>
          <View style={styles.unfocusedContainer}></View>
        </View>
      </RNCamera>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Image source={require('./assets/close.png')} style={styles.closeButtonImage} />
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
    height: height, // Make the camera fill the screen
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 8,
    borderRadius: 50,
    zIndex: 1,
  },
  closeButtonImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor:'#fff',
  },
  overlay: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  unfocusedContainer: {
    flex: 0.7,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  focusedContainer: {
    flex: 1.6,
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
  productInfoContainer: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
  },
  productInfoText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  scanAgainButton: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BarcodeScannerScreen;