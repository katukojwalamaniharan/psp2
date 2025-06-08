// import React from 'react';
// import { Box, Container, Heading, Text, Button, VStack, HStack, Icon, useColorModeValue, Center, Link, Divider } from '@chakra-ui/react';
// import { motion } from 'framer-motion';
// import { useNavigate } from 'react-router-dom';
// import { FaPlayCircle } from 'react-icons/fa';

// const MotionBox = motion(Box);
// const MotionHeading = motion(Heading);
// const MotionText = motion(Text);
// const MotionButton = motion(Button);

// const IntroPage = () => {
//   const navigate = useNavigate();

//   const handleGetStarted = () => {
//     navigate('/login'); // Navigate to the login page
//   };

//   const fadeIn = {
//     hidden: { opacity: 0, y: 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
//   };

//   return (
//     <Center minH="100vh" w="100vw" position="absolute" top="0" left="0" bg={useColorModeValue('gray.50', 'gray.900')}>
//       <Container maxW="container.md" py={20}>
//         <MotionBox
//           initial="hidden"
//           animate="visible"
//           variants={fadeIn}
//           textAlign="center"
//           p={8}
//           borderRadius="xl"
//           bg={useColorModeValue('white', 'gray.800')}
//           boxShadow="2xl"
//           borderWidth="1px"
//           borderColor={useColorModeValue('gray.100', 'gray.700')}
//         >
//           <VStack spacing={6}>
//             <MotionHeading size="3xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text" variants={fadeIn}>
//               Welcome to StudyPlanner
//             </MotionHeading>
//             <MotionText fontSize="xl" color="gray.500" variants={fadeIn} transition={{ delay: 0.2, duration: 0.8 }}>
//               Your smart companion for structured learning and productivity.
//             </MotionText>
//             <MotionText fontSize="lg" color="gray.600" maxW="lg" variants={fadeIn} transition={{ delay: 0.4, duration: 0.8 }}>
//               Organize subjects, track progress, manage daily schedules, and build consistent study habits with AI-powered insights.
//             </MotionText>

//             <MotionButton
//               size="lg"
//               height="60px"
//               width="200px"
//               colorScheme="blue"
//               bgGradient="linear(to-r, blue.500, purple.600)"
//               _hover={{ bgGradient: 'linear(to-r, blue.600, purple.700)' }}
//               leftIcon={<Icon as={FaPlayCircle} boxSize={6} />}
//               onClick={handleGetStarted}
//               variants={fadeIn}
//               transition={{ delay: 0.6, duration: 0.8 }}
//               boxShadow="xl"
//             >
//               Get Started
//             </MotionButton>

//           </VStack>
//         </MotionBox>
//       </Container>
//     </Center>
//   );
// };

// export default IntroPage; 
import React from 'react';
import { ArrowRight, BookOpen, Target, TrendingUp, Users, Calendar, Moon, Smartphone, Brain, Github, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const problems = [
    {
      before: "Unstructured study",
      after: "Organized subject plans",
      icon: <BookOpen className="h-6 w-6 text-blue-600" />
    },
    {
      before: "No tracking",
      after: "Progress bars and streaks",
      icon: <TrendingUp className="h-6 w-6 text-green-600" />
    },
    {
      before: "No daily focus",
      after: "Daily planner view",
      icon: <Target className="h-6 w-6 text-purple-600" />
    },
    {
      before: "No motivation",
      after: "Visual feedback and habit building",
      icon: <Users className="h-6 w-6 text-orange-600" />
    }
  ];

  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Frontend Developer",
      initials: "AC",
      bio: "Passionate about creating intuitive user interfaces and smooth user experiences."
    },
    {
      name: "Sarah Kumar",
      role: "Backend Developer", 
      initials: "SK",
      bio: "Specializes in scalable architecture and database optimization for student apps."
    },
    {
      name: "Jordan Smith",
      role: "UX Designer",
      initials: "JS",
      bio: "Focuses on user-centered design to make studying more engaging and productive."
    },
    {
      name: "Maya Patel",
      role: "Full-Stack Developer",
      initials: "MP",
      bio: "Bridges frontend and backend to create seamless learning experiences."
    }
  ];

  const techStack = [
    { name: "React", color: "bg-blue-100 text-blue-800" },
    { name: "TypeScript", color: "bg-blue-100 text-blue-800" },
    { name: "Firebase", color: "bg-yellow-100 text-yellow-800" },
    { name: "TailwindCSS", color: "bg-cyan-100 text-cyan-800" },
    { name: "Recharts", color: "bg-green-100 text-green-800" },
    { name: "React Query", color: "bg-red-100 text-red-800" },
    { name: "Vite", color: "bg-purple-100 text-purple-800" }
  ];

  const roadmapItems = [
    { feature: "Calendar sync", icon: <Calendar className="h-5 w-5" /> },
    { feature: "Dark mode", icon: <Moon className="h-5 w-5" /> },
    { feature: "Mobile version", icon: <Smartphone className="h-5 w-5" /> },
    { feature: "AI-powered suggestions", icon: <Brain className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8 animate-scale-in">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              StudyPlanner
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Empowering students through structured learning and habit tracking
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Our Vision</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            We believe every student deserves the tools to succeed. StudyPlanner was born from our own struggles with 
            disorganization, lack of motivation, and the absence of proper tracking systems. We're here to transform 
            chaotic study routines into structured, motivating, and measurable learning experiences.
          </p>
        </div>
      </section>

      {/* What StudyPlanner Solves */}
      <section className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">What StudyPlanner Solves</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {problems.map((problem, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    {problem.icon}
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground line-through">{problem.before}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                        <span className="font-semibold text-primary">{problem.after}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About the Project */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">About the Project</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Final Year Project</h3>
                <p className="text-muted-foreground">A comprehensive full-stack application built as our Computer Science Engineering capstone project.</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">By Students</h3>
                <p className="text-muted-foreground">Created by passionate CSE students who understand the real challenges of academic life.</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">For Students</h3>
                <p className="text-muted-foreground">Designed to help students stay productive, consistent, and motivated in their learning journey.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet the Team */}
      <section className="py-20 bg-white/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">
                    {member.initials}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <span
                key={index}
                className={`px-4 py-2 rounded-full font-medium transition-transform hover:scale-105 ${tech.color}`}
              >
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Future Roadmap */}
      <section className="py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmapItems.map((item, index) => (
              <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mr-4">
                  {item.icon}
                </div>
                <span className="font-medium">{item.feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Footer */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Get In Touch</h2>
          <p className="text-xl mb-8 opacity-90">
            Made with 💙 by students for students
          </p>
          <div className="flex justify-center space-x-6">
            <Button variant="secondary" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
            <Button variant="secondary" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Linkedin className="mr-2 h-5 w-5" />
              LinkedIn
            </Button>
            <Button variant="secondary" size="lg" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              <Mail className="mr-2 h-5 w-5" />
              Contact
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
