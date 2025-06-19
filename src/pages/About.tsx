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
      name: "Maniharan",
      role: "Backend Developer",
      initials: "M",
      bio: "Builds robust backend systems and ensures data flows smoothly."
    },
    {
      name: "Rakesh",
      role: "Frontend Developer",
      initials: "R",
      bio: "Crafts interactive and responsive user interfaces."
    },
    {
      name: "Yadidya",
      role: "UI/UX Designer",
      initials: "Y",
      bio: "Designs intuitive and delightful user experiences."
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
                <h3 className="text-xl font-semibold mb-2">Real Time Project</h3>
                <p className="text-muted-foreground">A comprehensive full-stack application built as a real time project for practical learning and impact.</p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">By Students</h3>
                <p className="text-muted-foreground">Created by passionate IT students who understand the real challenges of academic life.</p>
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
          <div className="flex flex-wrap justify-center gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    {member.initials}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Powered By Modern Technologies</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techStack.map((tech, index) => (
              <span key={index} className={`px-4 py-2 rounded-full text-sm font-medium ${tech.color}`}>
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Future Roadmap */}
      <section className="py-20 bg-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Our Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roadmapItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    {item.icon}
                  </div>
                  <p className="text-lg font-medium">{item.feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions, feedback, or just want to say hello? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:katukojwalamaniharanchary@gmail.com" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Mail className="mr-2 h-5 w-5" /> Email Us
              </Button>
            </a>
            <a href="tel:+919550684413">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                📞 Call Us: +91 9550684413
              </Button>
            </a>
            <a href="https://www.linkedin.com/in/maniharanchary-katukojwala-22798a27a/" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-blue-700 text-blue-700 hover:bg-blue-50">
                <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} StudyPlanner. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Designed and built with passion by students, for students.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About; 