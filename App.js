import React, { useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Image, TextInput, Modal } from 'react-native';
import { SearchBar, Button, Text, Rating } from 'react-native-elements';

// Import bourbon images
import bourbon1Image from './assets/woodford.png';
import bourbon2Image from './assets/peerless.png';
import bourbon3Image from './assets/angelsenvy.png';
import bourbon4Image from './assets/blantons.png';
import bourbon5Image from './assets/makers.png';
import bourbon6Image from './assets/bulleit.png';

const BourbonApp = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [bourbons, setBourbons] = useState([
    { id: 1, name: 'Woodford', image: bourbon1Image },
    { id: 2, name: 'Peerless', image: bourbon2Image },
    { id: 3, name: 'Angels', image: bourbon3Image },
    { id: 4, name: 'Blantons', image: bourbon4Image },
    { id: 5, name: 'Makers', image: bourbon5Image },
    { id: 6, name: 'Bulleit', image: bourbon6Image },
    // Add more 
  ]);
  const [selectedBourbons, setSelectedBourbons] = useState([]);
  const [filteredBourbons, setFilteredBourbons] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Update filtered bourbons whenever searchQuery changes
  useMemo(() => {
    const filtered = bourbons.filter((bourbon) =>
      bourbon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBourbons(filtered);
  }, [searchQuery, bourbons]);

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleAddBourbon = (bourbon) => {
    setSelectedBourbons([...selectedBourbons, { ...bourbon, notes: '', rating: 0 }]);
    // Remove the bourbon from the top list
    const updatedBourbons = bourbons.filter((b) => b.id !== bourbon.id);
    setBourbons(updatedBourbons);
  };

  const handleRemoveBourbon = (id) => {
    const updatedSelectedBourbons = selectedBourbons.filter((bourbon) => bourbon.id !== id);
    setSelectedBourbons(updatedSelectedBourbons);
    // Add the bourbon back to the top list
    const bourbonToAdd = selectedBourbons.find((b) => b.id === id);
    setBourbons([...bourbons, bourbonToAdd]);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleAddButtonPress = () => {
    if (selectedBourbons.length > 0) {
      setMessage('Bourbon logged');
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const renderBourbonItem = ({ item, index }) => {
    const isBourbonSelected = selectedBourbons.some((selected) => selected.id === item.id);
    return (
      <View style={styles.bourbonItem}>
        <Image source={item.image} style={styles.bourbonImage} />
        <Text>{item.name}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title="Add"
            onPress={() => handleAddBourbon(item)}
            disabled={isBourbonSelected}
            buttonStyle={styles.button}
          />
          {isBourbonSelected && (
            <Button
              title="Remove"
              onPress={() => handleRemoveBourbon(item.id)}
              buttonStyle={[styles.button, styles.removeButton]}
            />
          )}
        </View>
        {isBourbonSelected && (
          <TextInput
            placeholder="Notes"
            onChangeText={(text) => {
              const updatedSelectedBourbons = [...selectedBourbons];
              updatedSelectedBourbons[index].notes = text;
              setSelectedBourbons(updatedSelectedBourbons);
            }}
            value={selectedBourbons[index].notes}
            style={styles.textInput}
          />
        )}
        {isBourbonSelected && (
          <Rating
            type="star"
            ratingCount={5}
            imageSize={20}
            showRating
            onFinishRating={(rating) => {
              const updatedSelectedBourbons = [...selectedBourbons];
              updatedSelectedBourbons[index].rating = rating;
              setSelectedBourbons(updatedSelectedBourbons);
            }}
            startingValue={selectedBourbons[index].rating}
          />
        )}
      </View>
    );
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text h4 style={styles.heading}>Login Page</Text>
        <Button title="Login" onPress={handleLogin} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search"
        onChangeText={handleSearch}
        value={searchQuery}
        inputStyle={styles.searchInput}
      />
      <Text h4 style={styles.heading}>Bourbon List</Text>
      <FlatList
        data={filteredBourbons}
        renderItem={renderBourbonItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Set number of columns to 2
      />
      <Text h4 style={styles.heading}>Selected Bourbons</Text>
      <FlatList
        data={selectedBourbons}
        renderItem={renderBourbonItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Set number of columns to 2
      />
     {selectedBourbons.length > 0 && (
      <Button title="Add" onPress={handleAddButtonPress} buttonStyle={styles.button} />
    )}
    <Modal
      visible={showModal}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.modalView}>
        <View style={styles.modalContent}>
          <Text>{message}</Text>
          <Button title="OK" onPress={closeModal} buttonStyle={styles.button}/>
        </View>
      </View>
    </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    marginTop: 20,
  },
  bourbonItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 10,
    flex: 1,
    width: '45%',
    margin: 5,
  },
  bourbonImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center buttons horizontally
  },
  button: {
    backgroundColor: 'black',
    marginRight: 5, // Add margin between buttons
  },
  removeButton: {
    backgroundColor: 'red',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%', // Adjust the width of text input
    marginBottom: 5,
    marginTop: 20,
  },
  searchInput: {
    backgroundColor: 'white', // Set background color to white
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default BourbonApp;