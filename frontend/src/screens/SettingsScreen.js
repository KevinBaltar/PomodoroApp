//frontend/src/screens/SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

// Mock de configurações, idealmente viriam do backend ou AsyncStorage
const initialSettings = {
  focusDuration: 25, // minutos
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  soundNotifications: true,
  pushNotifications: true,
  theme: 'light', // 'light', 'dark'
};

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState(initialSettings);

  const handleValueChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = () => {
    // Aqui iria a lógica para salvar as configurações no backend e/ou AsyncStorage
    console.log('Configurações salvas:', settings);
    Alert.alert('Salvo', 'Suas configurações foram salvas com sucesso! (Simulado)');
    // navigation.goBack(); // Opcional: voltar para a tela anterior após salvar
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Configurações</Text>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Duração do Foco (minutos)</Text>
        {/* Poderia usar um Slider ou TextInput numérico aqui */}
        <Text style={styles.settingValue}>{settings.focusDuration}</Text>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Duração da Pausa Curta (minutos)</Text>
        <Text style={styles.settingValue}>{settings.shortBreakDuration}</Text>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Duração da Pausa Longa (minutos)</Text>
        <Text style={styles.settingValue}>{settings.longBreakDuration}</Text>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Sessões antes da Pausa Longa</Text>
        <Text style={styles.settingValue}>{settings.sessionsBeforeLongBreak}</Text>
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notificações Sonoras</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#ff8c69" }}
          thumbColor={settings.soundNotifications ? "#ff6347" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={(value) => handleValueChange('soundNotifications', value)}
          value={settings.soundNotifications}
        />
      </View>

      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Notificações Push</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#ff8c69" }}
          thumbColor={settings.pushNotifications ? "#ff6347" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={(value) => handleValueChange('pushNotifications', value)}
          value={settings.pushNotifications}
        />
      </View>
      
      {/* Exemplo de seleção de tema */}
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Tema do Aplicativo</Text>
        <View style={styles.themeOptionsContainer}>
            <TouchableOpacity 
                style={[styles.themeButton, settings.theme === 'light' && styles.themeButtonActive]}
                onPress={() => handleValueChange('theme', 'light')}
            >
                <Text style={[styles.themeButtonText, settings.theme === 'light' && styles.themeButtonTextActive]}>Claro</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.themeButton, settings.theme === 'dark' && styles.themeButtonActive]}
                onPress={() => handleValueChange('theme', 'dark')}
            >
                <Text style={[styles.themeButtonText, settings.theme === 'dark' && styles.themeButtonTextActive]}>Escuro</Text>
            </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
        <Text style={styles.saveButtonText}>Salvar Configurações</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => console.log("Voltar para Home") /* navigation.goBack() */}>
        <Text style={styles.backLink}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20, // Ajuste para status bar se necessário
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6347',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingValue: {
    fontSize: 16,
    color: '#ff6347',
    fontWeight: '500',
  },
  themeOptionsContainer: {
    flexDirection: 'row',
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff6347',
    marginLeft: 10,
  },
  themeButtonActive: {
    backgroundColor: '#ff6347',
  },
  themeButtonText: {
    color: '#ff6347',
    fontSize: 14,
  },
  themeButtonTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#ff6347',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backLink: {
      fontSize: 16,
      color: '#ff6347',
      textAlign: 'center',
      marginBottom: 30,
      textDecorationLine: 'underline'
  }
});

export default SettingsScreen;

