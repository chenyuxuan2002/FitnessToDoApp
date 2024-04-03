// App.js
import React, { useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import AddToDo from './components/AddToDo';
import DisplayToDos from './components/DisplayToDos';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [showCreate, setShowCreate] = useState(true);

  const handleToDoCreate = (newToDo) => {
    setTodos([...todos, newToDo]);
    setShowCreate(false); // Switch to display view after creating a todo
  };

  return (
    <View style={styles.container}>
      {showCreate ? (
        <AddToDo onToDoCreate={handleToDoCreate} />
      ) : (
        <DisplayToDos todos={todos} />
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={showCreate ? "ToDo-list" : "To publish"}
          onPress={() => setShowCreate(!showCreate)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  buttonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // 半透明黑色背景
    margin: 30,
    borderRadius: 10, // 圆角边框
  },
});
