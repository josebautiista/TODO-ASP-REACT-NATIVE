import { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import TaskModal from "./components/TaskModal";
import TaskCard from "./components/TaskCard";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [change, setChange] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [change]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.0.21:5245/api/todos");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleAddTask = async (newTask) => {
    try {
      const response = await fetch("http://192.168.0.21:5245/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTask.title,
          dueDate: newTask.dueDate,
          isDone: false,
        }),
      });
      const data = await response.json();
      setChange(!change);
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditTask = async (updatedTask) => {
    try {
      const response = await fetch(
        `http://192.168.0.21:5245/api/todos/${selectedTask.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...updatedTask, id: selectedTask.id }),
        }
      );

      setChange(!change);
      setSelectedTask(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleComplete = async (id) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const updatedTask = { ...taskToUpdate, isDone: !taskToUpdate.isDone };

    try {
      await fetch(`http://192.168.0.21:5245/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      setChange(!change);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`http://192.168.0.21:5245/api/todos/${id}`, {
        method: "DELETE",
      });

      setChange(!change);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditButtonPress = (task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const renderTask = ({ item }) => (
    <TaskCard
      item={item}
      onToggleComplete={handleToggleComplete}
      onEdit={handleEditButtonPress}
      onDelete={handleDeleteTask}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-200 px-4 pt-10">
      <View className="w-full items-center mb-4">
        <Text className="text-4xl font-extrabold text-blue-700">DailyDo</Text>
        <Text className="text-lg text-gray-600">
          Organiza tus tareas diarias
        </Text>
      </View>

      <View className="flex-row w-full mb-6">
        <TouchableOpacity
          className="w-full bg-blue-500 rounded-xl items-center justify-center py-2"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-white font-bold">Agregar Tarea</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-2 text-lg text-gray-600">Cargando tareas...</Text>
        </View>
      ) : (
        <FlatList
          className="w-full"
          data={[
            ...tasks.filter((task) => !task.isDone),
            ...tasks.filter((task) => task.isDone),
          ]}
          renderItem={renderTask}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

      <TaskModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedTask(null);
        }}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        selectedTask={selectedTask}
      />
    </SafeAreaView>
  );
}
