import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const TaskCard = ({ item, onToggleComplete, onEdit, onDelete }) => {
  return (
    <View
      className={`flex-row items-center justify-between p-4 mb-2 rounded-md ${
        item.isDone ? "bg-gray-200" : "bg-white"
      } shadow-sm`}
    >
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => onToggleComplete(item.id)}>
          <Icon
            name={item.isDone ? "check-circle" : "radio-button-unchecked"}
            size={24}
            color={item.isDone ? "green" : "gray"}
          />
        </TouchableOpacity>
        <View className="flex-col items-start">
          <Text
            className={`ml-4 text-lg font-bold ${
              item.isDone ? "text-gray-500 line-through" : "text-gray-800"
            }`}
          >
            {item.title}
          </Text>
          <Text
            className={`ml-4 text-xs ${
              item.isDone ? "text-gray-500 line-through" : "text-gray-800"
            }`}
          >
            Vence: {item.dueDate}
          </Text>
        </View>
      </View>
      <View className="flex-row">
        <TouchableOpacity onPress={() => onEdit(item)}>
          <Icon name="edit" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(item.id)}>
          <Icon name="delete" size={24} color="red" className="ml-4" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskCard;
