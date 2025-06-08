import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  useDisclosure,
  useToast,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Progress,
  Text,
  VStack,
  HStack,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Select,
  Icon,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Divider,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Checkbox,
  List,
  ListItem,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Tooltip,
  useDisclosure as useDisclosure2
} from '@chakra-ui/react';
import { FaPlus, FaFlag, FaSearch, FaSort, FaFilter, FaCalendarAlt, FaClock, FaCheck } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Define the Course type
type Course = {
  id: string;
  name: string;
  description: string;
  duration: {
    hours: number;
    minutes: number;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  topics: string[];
  dailyStudyTime: {
    hours: number;
    minutes: number;
  };
  studyDays: string[];
  progress: number;
  lastStudiedDate: string | null;
  streak: number;
  resources: string[];
  relatedCourse: string | null;
  revisionCycles: {
    nextRevisionDate: string;
    cycleNumber: number;
  };
  pomodoroSettings: {
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
  };
  color: string;
  createdAt: any;
  userId: string;
};

// Add new type for daily schedule
type DailySchedule = {
  id: string;
  date: string;
  subjects: {
    subjectId: string;
    name: string;
    startTime: string;
    endTime: string;
    duration: number; // in minutes
    completed: boolean;
  }[];
  totalStudyTime: number;
  createdAt: any;
};

// Enhanced types for next-gen scheduling
type TimeSlot = {
  startTime: string;
  endTime: string;
  type: 'study' | 'break' | 'review' | 'exercise' | 'rest';
  subjectId?: string;
  subjectName?: string;
  energyLevel: number;
  focusLevel: number;
  activityType?: string;
};

type EnergyLevel = {
  time: string;
  level: number;
  activity: string;
  recommendedSubjects: string[];
};

type LearningPattern = {
  type: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  optimalTime: string;
  duration: number;
  breakAfter: number;
};

const StudyPlan = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [newCourse, setNewCourse] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState({ hours: 1, minutes: 0 });
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');
  const [dailyStudyTime, setDailyStudyTime] = useState({ hours: 0, minutes: 30 });
  const [studyDays, setStudyDays] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [resources, setResources] = useState<string[]>([]);
  const [newResource, setNewResource] = useState('');
  const [relatedCourse, setRelatedCourse] = useState<string | null>(null);
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4
  });
  const [color, setColor] = useState('#3182CE');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'progress' | 'name'>('priority');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [dailySchedule, setDailySchedule] = useState<DailySchedule | null>(null);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);
  const { isOpen: isScheduleModalOpen, onOpen: onScheduleModalOpen, onClose: onScheduleModalClose } = useDisclosure2();

  // Enhanced energy levels with activity recommendations
  const dailyEnergyLevels: EnergyLevel[] = [
    {
      time: '06:00',
      level: 7,
      activity: 'Morning Exercise',
      recommendedSubjects: ['beginner', 'review']
    },
    {
      time: '08:00',
      level: 9,
      activity: 'Peak Focus',
      recommendedSubjects: ['advanced', 'complex']
    },
    {
      time: '10:00',
      level: 8,
      activity: 'High Energy',
      recommendedSubjects: ['intermediate', 'advanced']
    },
    {
      time: '12:00',
      level: 6,
      activity: 'Post-Lunch',
      recommendedSubjects: ['beginner', 'review']
    },
    {
      time: '14:00',
      level: 7,
      activity: 'Afternoon Focus',
      recommendedSubjects: ['intermediate']
    },
    {
      time: '16:00',
      level: 8,
      activity: 'Evening Energy',
      recommendedSubjects: ['advanced', 'practice']
    },
    {
      time: '18:00',
      level: 6,
      activity: 'Evening Review',
      recommendedSubjects: ['review', 'beginner']
    }
  ];

  // Learning patterns for different types of subjects
  const learningPatterns: Record<string, LearningPattern> = {
    theory: {
      type: 'reading',
      optimalTime: '08:00',
      duration: 45,
      breakAfter: 15
    },
    practice: {
      type: 'kinesthetic',
      optimalTime: '14:00',
      duration: 60,
      breakAfter: 20
    },
    review: {
      type: 'visual',
      optimalTime: '18:00',
      duration: 30,
      breakAfter: 10
    }
  };

  // Fetch courses when component mounts
  useEffect(() => {
    if (!currentUser) {
      console.log('No user logged in');
      return;
    }

    console.log('Setting up courses listener for user:', currentUser.uid);
    const q = query(
      collection(db, 'user_study_plans', currentUser.uid, 'courses'),
      orderBy('priority', 'desc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('Received courses update');
        const coursesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Course[];
        console.log('Courses data:', coursesData);
        setCourses(coursesData);
        setError(null);
      },
      (error) => {
        console.error('Error fetching courses:', error);
        setError('Failed to load courses. Please try again.');
      }
    );

    return () => {
      console.log('Cleaning up courses listener');
      unsubscribe();
    };
  }, [currentUser]);

  const handleAddCourse = async () => {
    if (!currentUser) {
      setError('You must be logged in to add a course');
      return;
    }

    if (!newCourse.trim()) {
      setError('Please enter a subject name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const courseData = {
        name: newCourse.trim(),
        description: description.trim() || '',
        duration: duration || { hours: 0, minutes: 0 },
        difficulty: difficulty || 'beginner',
        priority: priority || 'medium',
        startDate: startDate || '',
        endDate: endDate || '',
        topics: topics || [],
        dailyStudyTime: dailyStudyTime || { hours: 0, minutes: 30 },
        studyDays: studyDays || [],
        progress: progress || 0,
        lastStudiedDate: null,
        streak: 0,
        resources: resources || [],
        relatedCourse: relatedCourse || null,
        revisionCycles: {
          nextRevisionDate: startDate || new Date().toISOString(),
          cycleNumber: 0
        },
        pomodoroSettings: pomodoroSettings || {
          workDuration: 25,
          breakDuration: 5,
          longBreakDuration: 15,
          sessionsUntilLongBreak: 4
        },
        color: color || '#3182CE',
        userId: currentUser.uid,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(
        collection(db, 'user_study_plans', currentUser.uid, 'courses'),
        courseData
      );

      // Reset form
      setNewCourse('');
      setDescription('');
      setDuration({ hours: 1, minutes: 0 });
      setDifficulty('beginner');
      setPriority('medium');
      setStartDate('');
      setEndDate('');
      setTopics([]);
      setDailyStudyTime({ hours: 0, minutes: 30 });
      setStudyDays([]);
      setProgress(0);
      setResources([]);
      setRelatedCourse(null);
      setPomodoroSettings({
        workDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4
      });
      setColor('#3182CE');
      onClose();

      toast({
        title: 'Success',
        description: 'Subject added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error adding course:', error);
      setError(error.message || 'Failed to add subject');
      toast({
        title: 'Error',
        description: error.message || 'Failed to add subject',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProgress = async (courseId: string, newProgress: number) => {
    if (!currentUser) return;

    try {
      console.log('Updating course progress:', { courseId, newProgress });
      const courseRef = doc(db, 'user_study_plans', currentUser.uid, 'courses', courseId);
      await updateDoc(courseRef, {
        progress: newProgress,
        updatedAt: serverTimestamp()
      });
      console.log('Progress updated successfully');
    } catch (error: any) {
      console.error('Error updating progress:', error);
      setError(error.message || 'Failed to update progress');
      toast({
        title: 'Error',
        description: error.message || 'Failed to update progress',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdatePriority = async (courseId: string, newPriority: 'high' | 'medium' | 'low') => {
    if (!currentUser) return;

    try {
      console.log('Updating course priority:', { courseId, newPriority });
      const courseRef = doc(db, 'user_study_plans', currentUser.uid, 'courses', courseId);
      await updateDoc(courseRef, {
        priority: newPriority,
        updatedAt: serverTimestamp()
      });
      console.log('Priority updated successfully');
    } catch (error: any) {
      console.error('Error updating priority:', error);
      setError(error.message || 'Failed to update priority');
      toast({
        title: 'Error',
        description: error.message || 'Failed to update priority',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!currentUser) return;

    try {
      console.log('Deleting course:', courseId);
      const courseRef = doc(db, 'user_study_plans', currentUser.uid, 'courses', courseId);
      await deleteDoc(courseRef);
      console.log('Course deleted successfully');
      toast({
        title: 'Success',
        description: 'Course deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error deleting course:', error);
      setError(error.message || 'Failed to delete course');
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete course',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Calculate optimal study time with enhanced algorithm
  const calculateOptimalStudyTime = (
    subject: Course,
    currentTime: Date,
    previousSubjects: TimeSlot[]
  ): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const duration = (subject.dailyStudyTime?.hours || 0) * 60 + (subject.dailyStudyTime?.minutes || 30);
    
    // Determine subject type and learning pattern
    const subjectType = determineSubjectType(subject);
    const pattern = learningPatterns[subjectType];
    
    // Calculate optimal start time based on energy levels
    const optimalTimeSlot = findOptimalTimeSlot(subject, currentTime);
    
    // Add warm-up break if needed
    if (previousSubjects.length > 0) {
      slots.push(createBreakSlot(currentTime, 10, 'warm-up'));
      currentTime.setMinutes(currentTime.getMinutes() + 10);
    }

    // Add study slot with energy and focus levels
    const studyEndTime = new Date(currentTime.getTime() + duration * 60000);
    slots.push({
      startTime: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: studyEndTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'study',
      subjectId: subject.id,
      subjectName: subject.name,
      energyLevel: optimalTimeSlot.level,
      focusLevel: calculateFocusLevel(subject, optimalTimeSlot),
      activityType: subjectType
    });

    // Add active break
    slots.push(createBreakSlot(studyEndTime, pattern.breakAfter, 'active'));

    return slots;
  };

  // Determine subject type based on content and difficulty
  const determineSubjectType = (subject: Course): string => {
    if (subject.difficulty === 'advanced') return 'practice';
    if (subject.difficulty === 'intermediate') return 'theory';
    return 'review';
  };

  // Find optimal time slot based on subject and current time
  const findOptimalTimeSlot = (subject: Course, currentTime: Date): EnergyLevel => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    return dailyEnergyLevels.reduce((optimal, current) => {
      const currentTimeValue = timeToMinutes(timeString);
      const optimalTimeValue = timeToMinutes(current.time);
      const timeDiff = Math.abs(currentTimeValue - optimalTimeValue);

      if (current.recommendedSubjects.includes(subject.difficulty || 'beginner') &&
          current.level > optimal.level) {
        return current;
      }
      return optimal;
    }, dailyEnergyLevels[0]);
  };

  // Calculate focus level based on subject and time slot
  const calculateFocusLevel = (subject: Course, timeSlot: EnergyLevel): number => {
    const baseFocus = timeSlot.level;
    const difficultyMultiplier = {
      'advanced': 0.8,
      'intermediate': 1,
      'beginner': 1.2
    }[subject.difficulty || 'beginner'];

    return Math.min(10, Math.round(baseFocus * difficultyMultiplier));
  };

  // Create break slot with specific type
  const createBreakSlot = (time: Date, duration: number, type: string): TimeSlot => {
    const endTime = new Date(time.getTime() + duration * 60000);
    return {
      startTime: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      endTime: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'break',
      energyLevel: 5,
      focusLevel: 3,
      activityType: type
    };
  };

  // Convert time string to minutes for comparison
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Enhanced schedule generation with next-gen algorithm
  const generateDailySchedule = async () => {
    if (!selectedDate || selectedSubjects.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select a date and at least one subject',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGeneratingSchedule(true);
    try {
      const selectedCoursesData = courses.filter(course => 
        selectedSubjects.includes(course.id)
      );

      // Enhanced subject sorting with multiple factors
      const sortedSubjects = [...selectedCoursesData].sort((a, b) => {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        const difficultyWeight = { advanced: 3, intermediate: 2, beginner: 1 };
        
        const aScore = (priorityWeight[a.priority || 'medium'] * 2) + 
                      difficultyWeight[a.difficulty || 'beginner'];
        const bScore = (priorityWeight[b.priority || 'medium'] * 2) + 
                      difficultyWeight[b.difficulty || 'beginner'];
        
        return bScore - aScore;
      });

      const schedule: DailySchedule = {
        id: Date.now().toString(),
        date: selectedDate,
        subjects: [],
        totalStudyTime: 0,
        createdAt: serverTimestamp()
      };

      let currentTime = new Date(`${selectedDate}T08:00:00`);
      let totalStudyTime = 0;
      let previousSlots: TimeSlot[] = [];

      // Generate enhanced schedule
      for (const subject of sortedSubjects) {
        const timeSlots = calculateOptimalStudyTime(subject, currentTime, previousSlots);
        
        // Add study slot
        const studySlot = timeSlots.find(slot => slot.type === 'study');
        if (studySlot) {
          schedule.subjects.push({
            subjectId: subject.id,
            name: subject.name,
            startTime: studySlot.startTime,
            endTime: studySlot.endTime,
            duration: (subject.dailyStudyTime?.hours || 0) * 60 + (subject.dailyStudyTime?.minutes || 30),
            completed: false
          });

          totalStudyTime += studySlot.duration || 0;
          currentTime = new Date(`${selectedDate}T${studySlot.endTime}`);
          previousSlots = timeSlots;
        }
      }

      schedule.totalStudyTime = totalStudyTime;
      setDailySchedule(schedule);
      onScheduleModalOpen();

      // Enhanced AI study tips
      const tips = generateEnhancedStudyTips(sortedSubjects, schedule);
      toast({
        title: 'AI Study Tips',
        description: tips,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      console.error('Error generating schedule:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate schedule. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGeneratingSchedule(false);
    }
  };

  // Generate enhanced study tips
  const generateEnhancedStudyTips = (subjects: Course[], schedule: DailySchedule): string => {
    const tips: string[] = [];
    
    // Analyze study patterns
    const hasDifficultSubjects = subjects.some(s => s.difficulty === 'advanced');
    const hasMultipleSubjects = subjects.length > 2;
    const totalStudyTime = schedule.totalStudyTime;
    
    // General tips
    if (hasDifficultSubjects) {
      tips.push('📚 Schedule difficult subjects in the morning when your energy is highest.');
    }
    
    if (hasMultipleSubjects) {
      tips.push('⏰ Take regular breaks between subjects to maintain focus.');
    }

    // Time-based tips
    if (totalStudyTime > 240) { // More than 4 hours
      tips.push('🎯 Consider splitting your study sessions across multiple days for better retention.');
    }

    // Subject-specific tips
    subjects.forEach(subject => {
      const difficulty = subject.difficulty || 'beginner';
      const pattern = learningPatterns[determineSubjectType(subject)];
      
      switch (difficulty) {
        case 'advanced':
          tips.push(`🧠 For ${subject.name}, use the ${pattern.type} learning method and take ${pattern.breakAfter}min breaks.`);
          break;
        case 'intermediate':
          tips.push(`📝 Review ${subject.name} materials before starting and practice active recall.`);
          break;
        case 'beginner':
          tips.push(`🌟 Start with ${subject.name} to build confidence and momentum.`);
          break;
      }
    });

    // Add energy management tips
    tips.push('💪 Stay hydrated and take short walks during breaks to maintain energy levels.');
    tips.push('🎵 Consider using background music or white noise for better focus.');

    return tips.join('\n');
  };

  // Function to mark subject as completed
  const toggleSubjectCompletion = (subjectId: string) => {
    if (!dailySchedule) return;

    setDailySchedule(prev => {
      if (!prev) return null;
      return {
        ...prev,
        subjects: prev.subjects.map(subject =>
          subject.subjectId === subjectId
            ? { ...subject, completed: !subject.completed }
            : subject
        )
      };
    });
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Sidebar />
      <Box ml="280px" p={8}>
        <Container maxW="container.xl">
          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>All Subjects</Tab>
              <Tab>Daily Planner</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Heading size="lg" mb={6}>
                  Study Plan
                </Heading>

                {error && (
                  <Alert status="error" mb={4}>
                    <AlertIcon />
                    <AlertTitle>Error!</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  leftIcon={<FaPlus />} 
                  colorScheme="blue" 
                  onClick={onOpen}
                  isLoading={isLoading}
                >
                  Add Subject
                </Button>

                {/* Display Courses */}
                <VStack spacing={4} mt={8} align="stretch">
                  {courses.map((course) => (
                    <Box
                      key={course.id}
                      p={6}
                      bg={useColorModeValue('white', 'gray.800')}
                      borderRadius="lg"
                      shadow="base"
                      borderLeft="4px solid"
                      borderLeftColor={getPriorityColor(course.priority)}
                    >
                      <VStack align="stretch" spacing={4}>
                        <HStack justify="space-between">
                          <HStack>
                            <Text fontSize="xl" fontWeight="bold">{course.name}</Text>
                            <Badge colorScheme={getPriorityColor(course.priority)}>
                              <Icon as={FaFlag} mr={1} />
                              {course.priority}
                            </Badge>
                          </HStack>
                          <Badge colorScheme={course.progress === 100 ? 'green' : 'blue'}>
                            {course.progress}%
                          </Badge>
                        </HStack>
                        <Text color="gray.500">
                          Time: {course.duration.hours}h {course.duration.minutes}m
                        </Text>
                        <Progress value={course.progress} colorScheme="blue" size="lg" borderRadius="full" />
                        <HStack justify="space-between">
                          <HStack>
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateProgress(course.id, Math.max(0, course.progress - 10))}
                              isDisabled={course.progress <= 0}
                            >
                              -10%
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleUpdateProgress(course.id, Math.min(100, course.progress + 10))}
                              isDisabled={course.progress >= 100}
                            >
                              +10%
                            </Button>
                            <Select
                              size="sm"
                              value={course.priority}
                              onChange={(e) => handleUpdatePriority(course.id, e.target.value as 'high' | 'medium' | 'low')}
                              width="100px"
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </Select>
                          </HStack>
                          <Button 
                            size="sm" 
                            colorScheme="red" 
                            variant="ghost"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            Delete
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <Heading size="lg">Daily Study Planner</Heading>
                  
                  <Card>
                    <CardBody>
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel>Select Date</FormLabel>
                          <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Select Subjects</FormLabel>
                          <List spacing={2}>
                            {courses.map(course => (
                              <ListItem key={course.id}>
                                <Checkbox
                                  isChecked={selectedSubjects.includes(course.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedSubjects([...selectedSubjects, course.id]);
                                    } else {
                                      setSelectedSubjects(selectedSubjects.filter(id => id !== course.id));
                                    }
                                  }}
                                >
                                  {course.name}
                                </Checkbox>
                              </ListItem>
                            ))}
                          </List>
                        </FormControl>

                        <Button
                          colorScheme="blue"
                          leftIcon={<FaCalendarAlt />}
                          onClick={generateDailySchedule}
                          isLoading={isGeneratingSchedule}
                          isDisabled={!selectedDate || selectedSubjects.length === 0}
                        >
                          Generate Daily Schedule
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>

      {/* Daily Schedule Modal */}
      <Modal isOpen={isScheduleModalOpen} onClose={onScheduleModalClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Daily Study Schedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {dailySchedule && (
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="bold">
                  Schedule for {new Date(dailySchedule.date).toLocaleDateString()}
                </Text>
                <List spacing={3}>
                  {dailySchedule.subjects.map((subject) => (
                    <ListItem key={subject.subjectId}>
                      <Card>
                        <CardBody>
                          <HStack justify="space-between">
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold">{subject.name}</Text>
                              <Text color="gray.500">
                                {subject.startTime} - {subject.endTime}
                              </Text>
                            </VStack>
                            <Checkbox
                              isChecked={subject.completed}
                              onChange={() => toggleSubjectCompletion(subject.subjectId)}
                            >
                              Completed
                            </Checkbox>
                          </HStack>
                        </CardBody>
                      </Card>
                    </ListItem>
                  ))}
                </List>
                <Text color="gray.500">
                  Total Study Time: {Math.floor(dailySchedule.totalStudyTime / 60)}h {dailySchedule.totalStudyTime % 60}m
                </Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onScheduleModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Course Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Subject</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Subject Name</FormLabel>
                <Input
                  placeholder="Enter subject name"
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
                  autoFocus
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description (Optional)</FormLabel>
                <Input
                  placeholder="Enter a short description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Time Wanted (Optional)</FormLabel>
                <HStack>
                  <NumberInput
                    min={0}
                    max={24}
                    value={duration.hours}
                    onChange={(_, value) => setDuration(prev => ({ ...prev, hours: value }))}
                    width="120px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>hours</Text>
                  <NumberInput
                    min={0}
                    max={59}
                    value={duration.minutes}
                    onChange={(_, value) => setDuration(prev => ({ ...prev, minutes: value }))}
                    width="120px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>minutes</Text>
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Difficulty Level (Optional)</FormLabel>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Priority (Optional)</FormLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Start Date (Optional)</FormLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>End Date (Optional)</FormLabel>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Topics/Sub-units (Optional)</FormLabel>
                <HStack>
                  <Input
                    placeholder="Add a topic"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (newTopic.trim()) {
                        setTopics([...topics, newTopic.trim()]);
                        setNewTopic('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </HStack>
                <VStack align="stretch" mt={2}>
                  {topics.map((topic, index) => (
                    <HStack key={index}>
                      <Text>{topic}</Text>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => setTopics(topics.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              </FormControl>

              <FormControl>
                <FormLabel>Daily Study Time (Optional)</FormLabel>
                <HStack>
                  <NumberInput
                    min={0}
                    max={24}
                    value={dailyStudyTime.hours}
                    onChange={(_, value) => setDailyStudyTime(prev => ({ ...prev, hours: value }))}
                    width="120px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>hours</Text>
                  <NumberInput
                    min={0}
                    max={59}
                    value={dailyStudyTime.minutes}
                    onChange={(_, value) => setDailyStudyTime(prev => ({ ...prev, minutes: value }))}
                    width="120px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text>minutes</Text>
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Study Days (Optional)</FormLabel>
                <HStack wrap="wrap">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <Button
                      key={day}
                      size="sm"
                      colorScheme={studyDays.includes(day) ? 'blue' : 'gray'}
                      onClick={() => {
                        if (studyDays.includes(day)) {
                          setStudyDays(studyDays.filter(d => d !== day));
                        } else {
                          setStudyDays([...studyDays, day]);
                        }
                      }}
                    >
                      {day}
                    </Button>
                  ))}
                </HStack>
              </FormControl>

              <FormControl>
                <FormLabel>Resources (Optional)</FormLabel>
                <HStack>
                  <Input
                    placeholder="Add a resource URL"
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                  />
                  <Button
                    onClick={() => {
                      if (newResource.trim()) {
                        setResources([...resources, newResource.trim()]);
                        setNewResource('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </HStack>
                <VStack align="stretch" mt={2}>
                  {resources.map((resource, index) => (
                    <HStack key={index}>
                      <Text>{resource}</Text>
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => setResources(resources.filter((_, i) => i !== index))}
                      >
                        Remove
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              </FormControl>

              <FormControl>
                <FormLabel>Pomodoro Settings (Optional)</FormLabel>
                <VStack spacing={2}>
                  <HStack>
                    <Text>Work Duration (minutes):</Text>
                    <NumberInput
                      min={1}
                      max={60}
                      value={pomodoroSettings.workDuration}
                      onChange={(_, value) => setPomodoroSettings(prev => ({ ...prev, workDuration: value }))}
                      width="100px"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                  <HStack>
                    <Text>Break Duration (minutes):</Text>
                    <NumberInput
                      min={1}
                      max={30}
                      value={pomodoroSettings.breakDuration}
                      onChange={(_, value) => setPomodoroSettings(prev => ({ ...prev, breakDuration: value }))}
                      width="100px"
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </HStack>
                </VStack>
              </FormControl>

              <FormControl>
                <FormLabel>Color Tag (Optional)</FormLabel>
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  width="100px"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3} 
              onClick={handleAddCourse}
              isLoading={isLoading}
            >
              Add
            </Button>
            <Button 
              variant="ghost" 
              onClick={onClose}
              isDisabled={isLoading}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudyPlan; 