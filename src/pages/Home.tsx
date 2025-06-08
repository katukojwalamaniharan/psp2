import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useColorModeValue,
  Container,
  Flex,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useToast,
  Avatar,
  Badge,
  Progress,
  HStack,
  IconButton,
  Divider,
  Image,
  Tag,
  TagLabel,
  TagLeftIcon,
  Wrap,
  WrapItem,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getUserProgress } from '../config/firebase';
import { 
  FaGraduationCap, 
  FaBook, 
  FaChartLine, 
  FaCalendarAlt, 
  FaBell, 
  FaTrophy,
  FaLightbulb,
  FaClock,
  FaCheckCircle,
  FaStar,
  FaUser
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

const MotionBox = motion(Box);

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) {
        console.log('No current user found');
        setError('No user logged in');
        setIsLoading(false);
        return;
      }

      console.log('Starting data load for user:', currentUser.uid);
      setIsLoading(true);
      setError(null);

      try {
        // Load profile data
        console.log('Loading profile data...');
        const profile = await getUserProfile(currentUser.uid);
        console.log('Profile loaded:', profile);
        setUserProfile(profile);

        // Load progress data
        console.log('Loading progress data...');
        const progress = await getUserProgress(currentUser.uid);
        console.log('Progress loaded:', progress);
        setUserProgress(progress);

        console.log('All data loaded successfully');
      } catch (error) {
        console.error('Error in loadData:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to load user data';
        setError(errorMessage);
        toast({
          title: 'Error loading data',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser, toast]);

  if (isLoading) {
    return (
      <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
        <Sidebar />
        <Box ml="280px" p={8}>
          <Center h="calc(100vh - 64px)">
            <VStack spacing={4}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
              <Text>Loading your personalized dashboard...</Text>
            </VStack>
          </Center>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
        <Sidebar />
        <Box ml="280px" p={8}>
          <Container maxW="container.xl">
            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
              borderRadius="lg"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Error Loading Data
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                {error}
              </AlertDescription>
              <Button
                mt={4}
                colorScheme="blue"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </Alert>
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Sidebar />
      <Box ml="280px" p={8}>
        <Container maxW="container.xl">
          <VStack spacing={8} align="stretch">
            {/* Welcome Section */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                p={8}
                bg={bgColor}
                shadow="base"
                rounded="xl"
                border="1px"
                borderColor={borderColor}
              >
                <VStack spacing={4} align="stretch">
                  <Heading size="xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
                    Welcome back, {userProfile?.fullName || 'Student'}! 👋
                  </Heading>
                  <Text color="gray.500" fontSize="lg">
                    Let's make today productive and achieve your goals.
                  </Text>
                </VStack>
              </Box>
            </MotionBox>

            {/* Quick Stats */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <Stat
                  px={6}
                  py={4}
                  bg={bgColor}
                  shadow="base"
                  rounded="xl"
                  border="1px"
                  borderColor={borderColor}
                >
                  <StatLabel>Current Level</StatLabel>
                  <StatNumber>{userProgress?.level || 1}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    Keep going!
                  </StatHelpText>
                </Stat>

                <Stat
                  px={6}
                  py={4}
                  bg={bgColor}
                  shadow="base"
                  rounded="xl"
                  border="1px"
                  borderColor={borderColor}
                >
                  <StatLabel>Tasks Completed</StatLabel>
                  <StatNumber>{userProgress?.completedTasks || 0}</StatNumber>
                  <StatHelpText>Out of {userProgress?.totalTasks || 0} tasks</StatHelpText>
                </Stat>

                <Stat
                  px={6}
                  py={4}
                  bg={bgColor}
                  shadow="base"
                  rounded="xl"
                  border="1px"
                  borderColor={borderColor}
                >
                  <StatLabel>Study Streak</StatLabel>
                  <StatNumber>3 days</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    23.36%
                  </StatHelpText>
                </Stat>
              </SimpleGrid>
            </MotionBox>

            {/* Quick Actions */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Box
                p={6}
                bg={bgColor}
                shadow="base"
                rounded="xl"
                border="1px"
                borderColor={borderColor}
              >
                <VStack spacing={6} align="stretch">
                  <Heading size="md">Quick Actions</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
                    <Button
                      leftIcon={<FaBook />}
                      colorScheme="blue"
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/study-plan')}
                    >
                      View Study Plan
                    </Button>
                    <Button
                      leftIcon={<FaCalendarAlt />}
                      colorScheme="green"
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/schedule')}
                    >
                      Check Schedule
                    </Button>
                    <Button
                      leftIcon={<FaChartLine />}
                      colorScheme="purple"
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/progress')}
                    >
                      Track Progress
                    </Button>
                    <Button
                      leftIcon={<FaUser />}
                      colorScheme="orange"
                      variant="outline"
                      size="lg"
                      onClick={() => navigate('/profile')}
                    >
                      Update Profile
                    </Button>
                  </SimpleGrid>
                </VStack>
              </Box>
            </MotionBox>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 