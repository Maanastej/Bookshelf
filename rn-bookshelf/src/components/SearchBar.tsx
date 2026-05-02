import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

interface Props {
  value: string;
  onSubmit: (query: string) => void;
  onChangeText: (text: string) => void;
}

const SearchBar = ({ value, onSubmit, onChangeText }: Props) => {
  const [focused, setFocused] = useState(false);

  const handleClear = useCallback(() => {
    onChangeText('');
  }, [onChangeText]);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  }, [value, onSubmit]);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search books, authors..."
        placeholderTextColor="#666"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.searchBtn, !value.trim() && styles.searchBtnDisabled]}
        onPress={handleSubmit}
        disabled={!value.trim()}>
        <Text style={styles.searchBtnText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 10,
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  containerFocused: {
    borderColor: '#7c83fd',
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  input: {
    flex: 1,
    color: '#e0e0e0',
    fontSize: 15,
    paddingVertical: 10,
  },
  clearIcon: {
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 6,
  },
  searchBtn: {
    backgroundColor: '#7c83fd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 6,
  },
  searchBtnDisabled: {
    backgroundColor: '#3a3a5a',
  },
  searchBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default SearchBar;
