import React, { useState, useEffect } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const TaskModal = ({
  visible,
  onClose,
  onAddTask,
  onEditTask,
  selectedTask,
}) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDate(new Date(selectedTask.dueDate));
    } else {
      setTitle("");
      setDate(new Date());
    }
  }, [selectedTask]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (currentDate >= today) {
      setShowPicker(false);
      setDate(currentDate);
    } else {
      setShowPicker(false);
      alert("No puedes seleccionar una fecha anterior a hoy.");
    }
  };

  const handleSubmit = () => {
    if (title.trim() && date) {
      const formattedDate = date.toISOString().split("T")[0];
      if (selectedTask) {
        onEditTask({
          title,
          dueDate: formattedDate,
        });
      } else {
        onAddTask({ title, dueDate: formattedDate });
      }
      setTitle("");
      setDate(new Date());
      onClose();
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View className="w-4/5 bg-white rounded-lg p-5 z-10 shadow-lg">
          <Text className="text-xl font-bold mb-3">
            {selectedTask ? "Editar Tarea" : "Agregar Tarea"}
          </Text>
          <TextInput
            placeholder="Título"
            value={title}
            onChangeText={setTitle}
            className="border-2 border-gray-200 mb-5 p-3 rounded-lg"
          />
          <TouchableOpacity onPress={() => setShowPicker(true)}>
            <Text className="mb-3">
              Fecha: {date.toISOString().split("T")[0]}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-blue-500 py-3 px-5 rounded-lg"
            >
              <Text className="text-white">Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onClose}
              className="bg-red-500 py-3 px-5 rounded-lg"
            >
              <Text className="text-white">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TaskModal;
