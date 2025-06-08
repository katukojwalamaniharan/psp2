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
  Icon
} from '@chakra-ui/react';
import { FaPlus, FaFlag } from 'react-icons/fa';
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

    if (duration.hours === 0 && duration.minutes === 0) {
      setError('Please specify a duration');
      return;
    }

    if (!startDate || !endDate) {
      setError('Please specify start and end dates');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const courseData = {
        name: newCourse.trim(),
        description: description.trim(),
        duration,
        difficulty,
        priority,
        startDate,
        endDate,
        topics,
        dailyStudyTime,
        studyDays,
        progress,
        lastStudiedDate: null,
        streak: 0,
        resources,
        relatedCourse,
        revisionCycles: {
          nextRevisionDate: startDate,
          cycleNumber: 0
        },
        pomodoroSettings,
        color,
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
        description: 'Course added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error adding course:', error);
      setError(error.message || 'Failed to add course');
      toast({
        title: 'Error',
        description: error.message || 'Failed to add course',
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

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Sidebar />
      <Box ml="280px" p={8}>
        <Container maxW="container.xl">
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
        </Container>
      </Box>

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
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Enter a short description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Time Wanted</FormLabel>
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

              <FormControl isRequired>
                <FormLabel>Difficulty Level</FormLabel>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Topics/Sub-units</FormLabel>
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
                <FormLabel>Daily Study Time</FormLabel>
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
                <FormLabel>Study Days</FormLabel>
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
                <FormLabel>Resources</FormLabel>
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
                <FormLabel>Pomodoro Settings</FormLabel>
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
                <FormLabel>Color Tag</FormLabel>
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