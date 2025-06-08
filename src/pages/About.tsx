import React from 'react';
import { Box, Text, Heading, VStack, Container, useColorModeValue, Icon, Divider, ListItem, List } from '@chakra-ui/react';
import Sidebar from '../components/Sidebar';
import { FaBook, FaBrain, FaChartLine, FaLaptopCode, FaComments, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { motion, useInView } from 'framer-motion';

const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionList = motion(List);
const MotionListItem = motion(ListItem);

const About = () => {
  const ref1 = React.useRef(null);
  const isInView1 = useInView(ref1, { once: true, amount: 0.5 });

  const ref2 = React.useRef(null);
  const isInView2 = useInView(ref2, { once: true, amount: 0.5 });

  const ref3 = React.useRef(null);
  const isInView3 = useInView(ref3, { once: true, amount: 0.5 });

  const ref4 = React.useRef(null);
  const isInView4 = useInView(ref4, { once: true, amount: 0.5 });

  const ref5 = React.useRef(null);
  const isInView5 = useInView(ref5, { once: true, amount: 0.5 });

  const fadeInVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Sidebar />
      <Box ml="280px" p={8}>
        <Container maxW="container.xl">
          <VStack spacing={10} align="stretch">

            {/* Header Section */}
            <MotionVStack
              ref={ref1}
              initial="hidden"
              animate={isInView1 ? "visible" : "hidden"}
              variants={fadeInVariants}
              align="start" spacing={4}
            >
              <MotionHeading size="xl" color={useColorModeValue('blue.600', 'blue.300')}>
                📚 About the Project – StudyPlanner
              </MotionHeading>
              <MotionText fontSize="lg" color={useColorModeValue('gray.700', 'gray.300')}>
                🌟 Our Vision
              </MotionText>
              <MotionText fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>
                At StudyPlanner, our mission is to empower students to take control of their learning through structured planning, consistency, and intelligent tracking. We believe that time management and discipline are just as important as the content we study — and the right tools can make all the difference.
              </MotionText>
            </MotionVStack>

            <Divider borderColor={useColorModeValue('gray.300', 'gray.600')} />

            {/* Why We Built This Section */}
            <MotionVStack
              ref={ref2}
              initial="hidden"
              animate={isInView2 ? "visible" : "hidden"}
              variants={fadeInVariants}
              align="start" spacing={4}
            >
              <MotionHeading size="lg" color={useColorModeValue('gray.700', 'gray.200')}>
                🧠 Why We Built This
              </MotionHeading>
              <MotionText fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>
                In today's fast-paced academic environment, many students:
              </MotionText>
              <MotionList spacing={2} pl={4}>
                <MotionListItem display="flex" alignItems="center">
                  <Icon as={FaTimesCircle} color="red.400" mr={2} />
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>Struggled to organize their subjects effectively</Text>
                </MotionListItem>
                <MotionListItem display="flex" alignItems="center">
                  <Icon as={FaTimesCircle} color="red.400" mr={2} />
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>Lost consistency due to a lack of visual progress tracking</Text>
                </MotionListItem>
                <MotionListItem display="flex" alignItems="center">
                  <Icon as={FaTimesCircle} color="red.400" mr={2} />
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>Relied on static to-do lists with no sense of streak or motivation</Text>
                </MotionListItem>
                <MotionListItem display="flex" alignItems="center">
                  <Icon as={FaTimesCircle} color="red.400" mr={2} />
                  <Text color={useColorModeValue('gray.600', 'gray.400')}>Wasted time manually planning instead of focusing on actual study</Text>
                </MotionListItem>
              </MotionList>
              <MotionText fontSize="md" color={useColorModeValue('gray.600', 'gray.400')} pt={2}>
                We've experienced these frustrations ourselves — which led us to build StudyPlanner as a real-time solution to real student problems.
              </MotionText>
            </MotionVStack>

            <Divider borderColor={useColorModeValue('gray.300', 'gray.600')} />

            {/* What StudyPlanner Solves Section */}
            <MotionVStack
              ref={ref3}
              initial="hidden"
              animate={isInView3 ? "visible" : "hidden"}
              variants={fadeInVariants}
              align="start" spacing={4}
            >
              <MotionHeading size="lg" color={useColorModeValue('gray.700', 'gray.200')}>
                🔍 What StudyPlanner Solves
              </MotionHeading>
              <MotionList spacing={3}>
                <MotionListItem display="flex" alignItems="flex-start">
                  <Icon as={FaCheckCircle} color="green.400" mr={3} mt={1} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>🗂️ Disorganized Study Plans</Text>
                    <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>→ Create structured plans by subject, difficulty, and category</Text>
                  </VStack>
                </MotionListItem>
                <MotionListItem display="flex" alignItems="flex-start">
                  <Icon as={FaCheckCircle} color="green.400" mr={3} mt={1} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>🧩 Lack of Daily Focus</Text>
                    <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>→ View and complete daily tasks using the integrated Daily Planner</Text>
                  </VStack>
                </MotionListItem>
                <MotionListItem display="flex" alignItems="flex-start">
                  <Icon as={FaCheckCircle} color="green.400" mr={3} mt={1} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>📊 No Progress Feedback</Text>
                    <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>→ Visual progress bars, estimated hours, and personalized streaks</Text>
                  </VStack>
                </MotionListItem>
                <MotionListItem display="flex" alignItems="flex-start">
                  <Icon as={FaCheckCircle} color="green.400" mr={3} mt={1} />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold" color={useColorModeValue('gray.800', 'white')}>🧠 No Retention of Habits</Text>
                    <Text fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>→ Motivation through streak tracking and performance analytics</Text>
                  </VStack>
                </MotionListItem>
              </MotionList>
            </MotionVStack>

            <Divider borderColor={useColorModeValue('gray.300', 'gray.600')} />

            {/* Built With Students in Mind Section */}
            <MotionVStack
              ref={ref4}
              initial="hidden"
              animate={isInView4 ? "visible" : "hidden"}
              variants={fadeInVariants}
              align="start" spacing={4}
            >
              <MotionHeading size="lg" color={useColorModeValue('gray.700', 'gray.200')}>
                🛠️ Built With Students in Mind
              </MotionHeading>
              <MotionText fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>
                StudyPlanner is not just a project — it's a companion for learners who want to stay productive without being overwhelmed. Whether you're preparing for competitive exams or managing a semester's workload, our tool gives you clarity, consistency, and confidence.
              </MotionText>
            </MotionVStack>

            <Divider borderColor={useColorModeValue('gray.300', 'gray.600')} />

            {/* Collaboration Section */}
            <MotionVStack
              ref={ref5}
              initial="hidden"
              animate={isInView5 ? "visible" : "hidden"}
              variants={fadeInVariants}
              align="start" spacing={4}
            >
              <MotionHeading size="lg" color={useColorModeValue('gray.700', 'gray.200')}>
                💬 Want to Collaborate or Learn More?
              </MotionHeading>
              <MotionText fontSize="md" color={useColorModeValue('gray.600', 'gray.400')}>
                We're always open to feedback, collaboration, or mentorship. Let's build a smarter learning experience together.
              </MotionText>
            </MotionVStack>

          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default About; 