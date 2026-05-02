import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Book } from '../types';

export type HomeStackParamList = {
  BookList: undefined;
  BookDetail: { book: Book };
};

export type RootTabParamList = {
  HomeStack: undefined;
  Saved: undefined;
};

export type BookListNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'BookList'
>;
export type BookDetailNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'BookDetail'
>;
export type BookDetailRouteProp = {
  key: string;
  name: 'BookDetail';
  params: { book: Book };
};
