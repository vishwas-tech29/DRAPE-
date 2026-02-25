import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useUserStore } from '../../store';
import { Colors, Typography, Spacing, Layout, BorderRadius } from '../../constants';
import { Button } from '../../components';

interface QuizState {
  wearMost?: 'Ethnic' | 'Western' | 'Fusion' | 'All of These';
  city?: 'Hyderabad' | 'Bangalore';
  stylePreference?: 'Minimal' | 'Bold' | 'Casual' | 'Traditional';
}

const questions = [
  {
    id: 1,
    question: 'What do you wear most?',
    options: ['Ethnic', 'Western', 'Fusion', 'All of These'],
  },
  {
    id: 2,
    question: 'What is your city?',
    options: ['Hyderabad', 'Bangalore'],
  },
  {
    id: 3,
    question: 'What is your style preference?',
    options: ['Minimal', 'Bold', 'Casual', 'Traditional'],
  },
];

const StyleQuizScreen = ({ navigation }: any) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizState>({});
  const { setOnboardingComplete, updateUser } = useUserStore();

  const handleSelectAnswer = (answer: string) => {
    const questionId = questions[currentQuestion].id;
    const answerKey = {
      1: 'wearMost',
      2: 'city',
      3: 'stylePreference',
    }[questionId] as keyof QuizState;

    setAnswers({
      ...answers,
      [answerKey]: answer,
    });

    // Auto-advance after selection
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleComplete();
      }
    }, 300);
  };

  const handleComplete = () => {
    // Save quiz answers
    updateUser({
      stylePreferences: {
        wearMost: answers.wearMost || 'All of These',
        stylePreference: answers.stylePreference || 'Casual',
      },
      city: answers.city || 'Hyderabad',
    });
    setOnboardingComplete(true);
    navigation.replace('SignUp');
  };

  const question = questions[currentQuestion];
  const isAnswered = Object.keys(answers).length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.question}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options.map((option) => {
            const isSelected =
              answers[Object.keys(answers)[Object.keys(answers).length - 1] as keyof QuizState] === option;

            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.option,
                  isSelected && styles.selectedOption,
                ]}
                onPress={() => handleSelectAnswer(option)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmCream,
    paddingHorizontal: Layout.screenPadding,
  },
  header: {
    marginBottom: Spacing.xxl,
    marginTop: Spacing.lg,
  },
  progressText: {
    ...Typography.labelSmall,
    color: Colors.warmGrey,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.softBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.darkText,
  },
  content: {
    flex: 1,
  },
  question: {
    ...Typography.h2,
    color: Colors.darkText,
    marginBottom: Spacing.xxl,
  },
  optionsContainer: {
    gap: Spacing.lg,
  },
  option: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.softBorder,
    borderRadius: BorderRadius.card,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: Colors.darkText,
    borderColor: Colors.darkText,
  },
  optionText: {
    ...Typography.label,
    color: Colors.darkText,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: Colors.white,
  },
});

export default StyleQuizScreen;
