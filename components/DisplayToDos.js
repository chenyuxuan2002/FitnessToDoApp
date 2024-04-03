import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Button, TextInput, Alert, Share, TouchableOpacity, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DisplayToDos = () => {
    const [todos, setTodos] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editingText, setEditingText] = useState("");

    useEffect(() => {
        fetchToDos();
    }, []);

    const fetchToDos = async () => {
        try {
            const todosJSON = await AsyncStorage.getItem('@todos');
            if (todosJSON) {
                setTodos(JSON.parse(todosJSON));
            }
        } catch (e) {
            Alert.alert('Failed to fetch ToDos');
        }
    };

    const handleDelete = async (index) => {
        const updatedToDos = [...todos];
        updatedToDos.splice(index, 1);
        await AsyncStorage.setItem('@todos', JSON.stringify(updatedToDos));
        fetchToDos(); // Refresh the list of ToDos
    };

    const handleEdit = (index) => {
        setIsEditing(index);
        setEditingText(todos[index].todoText);
    };

    const handleSaveEdit = async (index) => {
        const updatedToDos = [...todos];
        updatedToDos[index].todoText = editingText;
        await AsyncStorage.setItem('@todos', JSON.stringify(updatedToDos));
        setIsEditing(null);
        fetchToDos(); // Refresh the list of ToDos
    };

    const handleCancelEdit = () => {
        setIsEditing(null);
    };

    const onShare = async (todo) => {
        try {
            const result = await Share.share({
                message: `Check out my ToDo item:\nPlan: ${todo.todoText}\nSteps: ${todo.steps}\nLocation: ${todo.location ? todo.location.coords.latitude + ", " + todo.location.coords.longitude : 'Unknown'}\nDate: ${new Date(todo.date).toLocaleDateString()}`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <ImageBackground source={require('../assets/bg.png')} style={styles.backgroundImage}>
            <ScrollView style={styles.container}>
                {todos.map((todo, index) => (
                    <View key={index} style={styles.todoContainer}>
                        {todo.imageUri && <Image source={{ uri: todo.imageUri }} style={styles.image} />}
                        {isEditing === index ? (
                            <TextInput
                                style={styles.input}
                                onChangeText={setEditingText}
                                value={editingText}
                            />
                        ) : (
                            <View style={styles.textContainer}>
                                <Text style={styles.text}>Plan: {todo.todoText}</Text>
                                <Text style={styles.text}>Steps: {todo.steps}</Text>
                                <Text style={styles.text}>Location: {todo.location ? `${todo.location.coords.latitude}, ${todo.location.coords.longitude}` : 'Unknown'}</Text>
                                <Text style={styles.text}>Date: {new Date(todo.date).toLocaleDateString()}</Text>
                            </View>
                        )}

                        <View style={styles.buttonContainer}>
                            {isEditing === index ? (
                                <>
                                    <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveEdit(index)}>
                                        <Text style={styles.buttonText}>Save</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                                        <Text style={styles.buttonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(index)}>
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.shareButton} onPress={() => onShare(todo)}>
                                        <Text style={styles.buttonText}>Share</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1, 
        resizeMode: 'cover', 
    },
    container: {
        flex: 1,
    },
    todoContainer: {
        margin: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 5,
    },
    textContainer: {
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 5,
    },
    text: {
        fontSize: 16,
        marginTop: 5,
        color: '#333',
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    editButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    shareButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default DisplayToDos;
