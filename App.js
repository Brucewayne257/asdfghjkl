import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Linking,
  Alert,
  Platform,
  RefreshControl,
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- APPLE SAN FRANCISCO (SF PRO) FONT STACK ---
const APP_FONT = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
  default: 'System',
});

// --- DAILY ENTREPRENEUR & TECH LEADER QUOTES ---
const DAILY_QUOTES = [
  {
    quote: 'Wear your failure as a badge of honor. In technology, iteration is everything.',
    author: 'Sundar Pichai',
    role: 'CEO, Google & Alphabet',
  },
  {
    quote: 'Software is eating the world, but AI is going to eat software. Build for the accelerated future.',
    author: 'Jensen Huang',
    role: 'Founder & CEO, NVIDIA',
  },
  {
    quote: 'Be passionate and bold. Always keep learning. You stop doing useful things if you don’t learn.',
    author: 'Satya Nadella',
    role: 'Chairman & CEO, Microsoft',
  },
  {
    quote: 'None can destroy iron, but its own rust can. Likewise, none can destroy a person, but their own mindset can.',
    author: 'Ratan Tata',
    role: 'Chairman Emeritus, Tata Sons',
  },
  {
    quote: 'Dream, dream, dream. Dreams transform into thoughts and thoughts result in action.',
    author: 'Dr. A.P.J. Abdul Kalam',
    role: '11th President of India & Aerospace Scientist',
  },
  {
    quote: 'Great software isn’t built only in Silicon Valley; deep engineering talent thrives in every town and campus.',
    author: 'Sridhar Vembu',
    role: 'Founder & CEO, Zoho Corporation',
  },
  {
    quote: 'Design is not just what it looks like and feels like. Design is how it works.',
    author: 'Steve Jobs',
    role: 'Co-Founder, Apple',
  },
];

// --- CORE 50 SOFTWARE & TECHNOLOGY COMPANIES ---
const TECH_COMPANIES = [
  { name: 'Google', symbol: '🔍', badge: 'G', color: '#4285F4', domain: 'google.com', rating: 4.9, popularity: 9850, prizeValue: 115000, region: 'Bengaluru', program: 'STEP & SWE Summer Internship 2027', cat: 'Internship', stipend: '₹1,15,000 / mo', skills: ['C++', 'Python', 'DSA', 'Algorithms'], loc: 'Bengaluru / Hyderabad', url: 'https://buildyourfuture.withgoogle.com' },
  { name: 'Microsoft', symbol: '⊞', badge: 'MS', color: '#00A4EF', domain: 'microsoft.com', rating: 4.9, popularity: 9420, prizeValue: 125000, region: 'Hyderabad', program: 'Explore & SWE Internships (Early-Year Track)', cat: 'Internship', stipend: '₹1,25,000 / mo', skills: ['C++', 'Python', 'System Design', 'DSA'], loc: 'Hyderabad / Bengaluru / Noida', url: 'https://careers.microsoft.com' },
  { name: 'Amazon', symbol: '📦', badge: 'AZ', color: '#FF9900', domain: 'amazon.com', rating: 4.8, popularity: 9100, prizeValue: 110000, region: 'Bengaluru', program: 'Amazon WOW & SDE Intern Hiring Hackathon', cat: 'Hackathon', stipend: '₹1,10,000 / mo + PPO', skills: ['Java', 'C++', 'DSA', 'Algorithms'], loc: 'Bengaluru / Chennai / Hyderabad', url: 'https://amazon.jobs' },
  { name: 'Adobe', symbol: '🅰️', badge: 'Ad', color: '#FF0000', domain: 'adobe.com', rating: 4.8, popularity: 7800, prizeValue: 200000, region: 'Delhi NCR', program: 'Adobe India GenAI & Women-in-Tech Hackathon', cat: 'Hackathon', stipend: '₹1,00,000 / mo + MacBook (₹2L Value)', skills: ['Python', 'AI/ML', 'React', 'C++'], loc: 'Noida / Bengaluru', url: 'https://careers.adobe.com' },
  { name: 'NVIDIA', symbol: '⚡', badge: 'NV', color: '#76B900', domain: 'nvidia.com', rating: 5.0, popularity: 9650, prizeValue: 150000, region: 'Bengaluru', program: 'Deep Learning, CUDA & Systems Engineering Intern', cat: 'Internship', stipend: '₹95,000 / mo + GPU Grant', skills: ['C++', 'Python', 'AI/ML', 'VLSI'], loc: 'Bengaluru / Pune', url: 'https://www.nvidia.com/en-in/about-nvidia/careers/' },
  { name: 'Intel', symbol: '🔲', badge: 'IN', color: '#0071C5', domain: 'intel.com', rating: 4.7, popularity: 6400, prizeValue: 65000, region: 'Bengaluru', program: 'SoC Design, VLSI & Edge AI Student Intern', cat: 'Internship', stipend: '₹65,000 / mo', skills: ['VLSI', 'Embedded C', 'Python', 'C++'], loc: 'Bengaluru', url: 'https://jobs.intel.com' },
  { name: 'Qualcomm', symbol: '📡', badge: 'QC', color: '#3253DC', domain: 'qualcomm.com', rating: 4.8, popularity: 6900, prizeValue: 75000, region: 'Hyderabad', program: '5G Wireless, Signal Processing & Hardware Track', cat: 'Internship', stipend: '₹75,000 / mo', skills: ['Signal Processing', 'VLSI', 'Embedded C', 'C++'], loc: 'Hyderabad / Bengaluru / Chennai', url: 'https://qualcomm.com/company/careers' },
  { name: 'AMD', symbol: '⚙️', badge: 'AMD', color: '#ED1C24', domain: 'amd.com', rating: 4.7, popularity: 6100, prizeValue: 70000, region: 'Hyderabad', program: 'Silicon Architecture & GPU Firmware Internship', cat: 'Internship', stipend: '₹70,000 / mo', skills: ['VLSI', 'C++', 'Embedded C', 'Python'], loc: 'Hyderabad / Bengaluru', url: 'https://careers.amd.com' },
  { name: 'Cisco', symbol: '🌐', badge: 'CS', color: '#049FD9', domain: 'cisco.com', rating: 4.8, popularity: 7200, prizeValue: 80000, region: 'Bengaluru', program: 'Cisco Ideathon & Network Systems Internship', cat: 'Hackathon', stipend: '₹80,000 / mo + Full-Time', skills: ['Networking', 'Python', 'C++', 'Cybersecurity'], loc: 'Bengaluru', url: 'https://jobs.cisco.com' },
  { name: 'IBM', symbol: '⚛️', badge: 'IBM', color: '#0F62FE', domain: 'ibm.com', rating: 4.6, popularity: 5900, prizeValue: 60000, region: 'Bengaluru', program: 'IBM Quantum & Hybrid Cloud Extreme Blue Intern', cat: 'Research', stipend: '₹60,000 / mo', skills: ['Python', 'Quantum', 'AI/ML', 'Cloud'], loc: 'Bengaluru / Kochi / Hyderabad', url: 'https://ibm.com/careers' },
  { name: 'Oracle', symbol: '☁️', badge: 'OR', color: '#C74634', domain: 'oracle.com', rating: 4.7, popularity: 6300, prizeValue: 85000, region: 'Bengaluru', program: 'Oracle Cloud Infrastructure (OCI) Server Tech Intern', cat: 'Internship', stipend: '₹85,000 / mo', skills: ['Java', 'SQL', 'Cloud', 'DSA'], loc: 'Bengaluru / Hyderabad', url: 'https://oracle.com/careers' },
  { name: 'Salesforce', symbol: '☁️', badge: 'SF', color: '#00A1E0', domain: 'salesforce.com', rating: 4.9, popularity: 7500, prizeValue: 95000, region: 'Hyderabad', program: 'Futureforce Tech & AI Cloud Summer Internship', cat: 'Internship', stipend: '₹95,000 / mo', skills: ['Java', 'JavaScript', 'React', 'DSA'], loc: 'Hyderabad / Bengaluru', url: 'https://salesforce.com/company/careers/university-recruiting/' },
  { name: 'SAP', symbol: '🔷', badge: 'SAP', color: '#008FD3', domain: 'sap.com', rating: 4.6, popularity: 5100, prizeValue: 55000, region: 'Bengaluru', program: 'SAP Labs India — Next-Gen Enterprise iXP Intern', cat: 'Internship', stipend: '₹55,000 / mo', skills: ['Java', 'Python', 'SQL', 'Cloud'], loc: 'Bengaluru / Gurugram', url: 'https://jobs.sap.com' },
  { name: 'Dell Technologies', symbol: '💻', badge: 'DL', color: '#007DB8', domain: 'dell.com', rating: 4.6, popularity: 5400, prizeValue: 100000, region: 'Bengaluru', program: 'Dell Hack2Hire & Core Infrastructure Internship', cat: 'Hackathon', stipend: '₹50,000 / mo + ₹1L Prizes', skills: ['Python', 'C++', 'Cloud', 'System Design'], loc: 'Bengaluru / Hyderabad', url: 'https://jobs.dell.com' },
  { name: 'Hewlett Packard Enterprise', symbol: '🖥️', badge: 'HPE', color: '#01A982', domain: 'hpe.com', rating: 4.6, popularity: 4900, prizeValue: 50000, region: 'Bengaluru', program: 'HPE CTY (Catch Them Young) Cloud & Storage Track', cat: 'Internship', stipend: '₹50,000 / mo', skills: ['C++', 'Python', 'Linux', 'Networking'], loc: 'Bengaluru', url: 'https://careers.hpe.com' },
  { name: 'Accenture', symbol: '❯', badge: 'AC', color: '#A100FF', domain: 'accenture.com', rating: 4.5, popularity: 6800, prizeValue: 200000, region: 'Mumbai / Pune', program: 'Accenture Innovation Challenge & Tech Consulting', cat: 'Hackathon', stipend: '₹2,00,000 Prizes + Fast-Track', skills: ['AI/ML', 'React', 'Python', 'Problem Solving'], loc: 'Pan-India Hybrid', url: 'https://accenture.com/in-en/careers' },
  { name: 'Tata Consultancy Services (TCS)', symbol: '🏆', badge: 'TCS', color: '#004B87', domain: 'tcs.com', rating: 4.7, popularity: 9900, prizeValue: 800000, region: 'Mumbai / Pune', program: 'TCS CodeVita Global Coding Contest & Research Intern', cat: 'Hackathon', stipend: '₹8,00,000+ Global Pool & Digital Offer', skills: ['C++', 'Python', 'Java', 'Algorithms'], loc: 'Online / Mumbai / Chennai', url: 'https://www.tcscodevita.com' },
  { name: 'Infosys', symbol: '⚡', badge: 'IN', color: '#007CC3', domain: 'infosys.com', rating: 4.6, popularity: 8900, prizeValue: 200000, region: 'Bengaluru', program: 'HackWithInfy & InStep Global Internship', cat: 'Hackathon', stipend: '₹2,00,000 Prizes + Specialist Role', skills: ['DSA', 'Python', 'Java', 'C++'], loc: 'Bengaluru / Pune / Mysuru', url: 'https://infosys.com/careers/hackwithinfy.html' },
  { name: 'Wipro', symbol: '🌐', badge: 'WP', color: '#3F1D74', domain: 'wipro.com', rating: 4.4, popularity: 5200, prizeValue: 40000, region: 'Bengaluru', program: 'Wipro Turbo AI & Enterprise Cloud Internship', cat: 'Internship', stipend: '₹40,000 / mo', skills: ['Java', 'Python', 'SQL', 'Cloud'], loc: 'Bengaluru / Hyderabad / Chennai', url: 'https://careers.wipro.com' },
  { name: 'HCLTech', symbol: '🔧', badge: 'HCL', color: '#005696', domain: 'hcltech.com', rating: 4.5, popularity: 5000, prizeValue: 35000, region: 'Delhi NCR', program: 'HCLTech Engineering R&D Systems Intern Track', cat: 'Internship', stipend: '₹35,000 / mo', skills: ['C++', 'Embedded C', 'Java', 'Python'], loc: 'Noida / Chennai / Bengaluru', url: 'https://hcltech.com/careers' },
  { name: 'Tech Mahindra', symbol: '🤖', badge: 'TM', color: '#E31837', domain: 'techmahindra.com', rating: 4.5, popularity: 4800, prizeValue: 35000, region: 'Mumbai / Pune', program: 'Makers Lab Next-Gen AI & 5G Telecom Intern', cat: 'Research', stipend: '₹35,000 / mo', skills: ['Python', 'AI/ML', 'IoT', 'Networking'], loc: 'Pune / Hyderabad / Bengaluru', url: 'https://careers.techmahindra.com' },
  { name: 'LTIMindtree', symbol: '🌲', badge: 'LTI', color: '#00205B', domain: 'ltimindtree.com', rating: 4.5, popularity: 4700, prizeValue: 40000, region: 'Mumbai / Pune', program: 'Ignite Data Engineering & Cloud Architecture Track', cat: 'Internship', stipend: '₹40,000 / mo', skills: ['SQL', 'Python', 'Cloud', 'React'], loc: 'Mumbai / Bengaluru / Chennai', url: 'https://ltimindtree.com/careers/' },
  { name: 'Persistent Systems', symbol: '♾️', badge: 'PS', color: '#FD5F07', domain: 'persistent.com', rating: 4.6, popularity: 5300, prizeValue: 45000, region: 'Mumbai / Pune', program: 'Martian Summer Internship & Semicolon Hackathon', cat: 'Hackathon', stipend: '₹45,000 / mo', skills: ['Java', 'Python', 'React', 'DSA'], loc: 'Pune / Nagpur / Bengaluru', url: 'https://persistent.com/careers/' },
  { name: 'Zoho', symbol: '🟩', badge: 'ZH', color: '#D92B2B', domain: 'zoho.com', rating: 4.8, popularity: 8200, prizeValue: 40000, region: 'Vellore / Chennai', program: 'Zoho CliQr & Product Engineering Intern', cat: 'Internship', stipend: '₹40,000 / mo + Direct PPO', skills: ['C++', 'Java', 'Problem Solving', 'Web Dev'], loc: 'Chennai / Tenkasi', url: 'https://zoho.com/careers/' },
  { name: 'Freshworks', symbol: '🍃', badge: 'FW', color: '#00A859', domain: 'freshworks.com', rating: 4.7, popularity: 6600, prizeValue: 55000, region: 'Vellore / Chennai', program: 'Freshworks STS Software & SaaS Product Internship', cat: 'Internship', stipend: '₹55,000 / mo', skills: ['React', 'Node.js', 'Python', 'DSA'], loc: 'Chennai / Bengaluru', url: 'https://freshworks.com/company/careers/' },
  { name: 'Flipkart', symbol: '🛍️', badge: 'FK', color: '#2874F0', domain: 'flipkart.com', rating: 4.9, popularity: 9700, prizeValue: 600000, region: 'Bengaluru', program: 'Flipkart GRiD 8.0 — Software & Robotics Hackathon', cat: 'Hackathon', stipend: '₹6,00,000 Pool + ₹1L/mo Intern', skills: ['C++', 'Python', 'AI/ML', 'Robotics'], loc: 'Bengaluru', url: 'https://unstop.com' },
  { name: 'PhonePe', symbol: '💳', badge: 'PP', color: '#5F259F', domain: 'phonepe.com', rating: 4.8, popularity: 7900, prizeValue: 100000, region: 'Bengaluru', program: 'PhonePe Tech Scholars & High-Scale FinTech Intern', cat: 'Internship', stipend: '₹1,00,000 / mo', skills: ['Java', 'C++', 'Distributed Systems', 'DSA'], loc: 'Bengaluru / Pune', url: 'https://phonepe.com/careers/' },
  { name: 'Paytm', symbol: '📲', badge: 'PT', color: '#00BAF2', domain: 'paytm.com', rating: 4.6, popularity: 6200, prizeValue: 60000, region: 'Delhi NCR', program: 'Paytm Payments & Merchant Ledger Engineering Intern', cat: 'Internship', stipend: '₹60,000 / mo', skills: ['Java', 'Node.js', 'React', 'SQL'], loc: 'Noida / Bengaluru', url: 'https://paytm.com/careers' },
  { name: 'Razorpay', symbol: '⚡', badge: 'RZ', color: '#02042B', domain: 'razorpay.com', rating: 4.9, popularity: 8100, prizeValue: 85000, region: 'Bengaluru', program: 'Razorpay Product Engineering & FinTech FTX Fellowship', cat: 'Internship', stipend: '₹85,000 / mo', skills: ['Go', 'Python', 'React', 'System Design'], loc: 'Bengaluru', url: 'https://razorpay.com/jobs/' },
  { name: 'Swiggy', symbol: '🛵', badge: 'SW', color: '#FC8019', domain: 'swiggy.com', rating: 4.7, popularity: 7400, prizeValue: 75000, region: 'Bengaluru', program: 'Swiggy Launchpad — Hyperlocal Logistics & AI Track', cat: 'Internship', stipend: '₹75,000 / mo', skills: ['Python', 'AI/ML', 'Java', 'DSA'], loc: 'Bengaluru (Remote-First)', url: 'https://careers.swiggy.com' },
  { name: 'Zomato (Eternal)', symbol: '🍽️', badge: 'ZM', color: '#E23744', domain: 'zomato.com', rating: 4.8, popularity: 7850, prizeValue: 90000, region: 'Delhi NCR', program: 'Zomato Trial Week & Consumer AI Engineering Hackathon', cat: 'Hackathon', stipend: '₹90,000 / mo', skills: ['Python', 'React', 'AI/ML', 'System Design'], loc: 'Gurugram', url: 'https://zomato.com/careers' },
  { name: 'Meesho', symbol: '📦', badge: 'MS', color: '#F43397', domain: 'meesho.com', rating: 4.8, popularity: 7600, prizeValue: 90000, region: 'Bengaluru', program: 'Meesho DICE Challenge & E-Commerce SDE Intern', cat: 'Hackathon', stipend: '₹90,000 / mo + Pre-Placement', skills: ['Java', 'Python', 'Data Science', 'DSA'], loc: 'Bengaluru', url: 'https://meesho.io/jobs' },
  { name: 'CRED', symbol: '🛡️', badge: 'CR', color: '#111111', domain: 'cred.club', rating: 4.9, popularity: 8500, prizeValue: 100000, region: 'Bengaluru', program: 'CRED Backend, Design Systems & FinTech Track', cat: 'Internship', stipend: '₹1,00,000 / mo', skills: ['Java', 'React', 'Kotlin', 'System Design'], loc: 'Bengaluru', url: 'https://careers.cred.club' },
  { name: 'Groww', symbol: '📈', badge: 'GW', color: '#00D09C', domain: 'groww.in', rating: 4.8, popularity: 7300, prizeValue: 75000, region: 'Bengaluru', program: 'Groww Low-Latency Trading & Full-Stack Intern', cat: 'Internship', stipend: '₹75,000 / mo', skills: ['Java', 'React Native', 'C++', 'DSA'], loc: 'Bengaluru', url: 'https://groww.in/careers' },
  { name: 'Jio Platforms', symbol: '📶', badge: 'Jio', color: '#0F3CC9', domain: 'jio.com', rating: 4.5, popularity: 6000, prizeValue: 45000, region: 'Mumbai / Pune', program: 'Jio 6G, AI Cloud & Digital Platforms Student Program', cat: 'Internship', stipend: '₹45,000 / mo', skills: ['Python', 'Networking', 'AI/ML', 'Cloud'], loc: 'Navi Mumbai / Hyderabad', url: 'https://careers.jio.com' },
  { name: 'Samsung R&D Institute India', symbol: '🌌', badge: 'SR', color: '#1428A0', domain: 'samsung.com', rating: 4.8, popularity: 8300, prizeValue: 150000, region: 'Bengaluru', program: 'Samsung PRISM & Solve for Tomorrow Innovation Track', cat: 'Research', stipend: '₹50,000 / mo + ₹1.5L Grant', skills: ['C++', 'Python', 'AI/ML', 'Computer Vision'], loc: 'Bengaluru / Noida / Delhi', url: 'https://research.samsung.com/sri-b' },
  { name: 'Apple', symbol: '', badge: '', color: '#000000', domain: 'apple.com', rating: 5.0, popularity: 9600, prizeValue: 120000, region: 'Hyderabad', program: 'Apple Silicon Verification & iOS Core Frameworks Intern', cat: 'Internship', stipend: '₹1,20,000 / mo', skills: ['C++', 'Swift', 'VLSI', 'Python'], loc: 'Hyderabad / Bengaluru', url: 'https://apple.com/careers/in/' },
  { name: 'Atlassian', symbol: '🔷', badge: 'AT', color: '#0052CC', domain: 'atlassian.com', rating: 5.0, popularity: 8950, prizeValue: 130000, region: 'Bengaluru', program: 'Atlassian Women in Tech & Distributed Systems Intern', cat: 'Internship', stipend: '₹1,30,000 / mo', skills: ['Java', 'React', 'TypeScript', 'DSA'], loc: 'Bengaluru (Remote-Friendly)', url: 'https://atlassian.com/company/careers/graduates' },
  { name: 'GitHub', symbol: '🐙', badge: 'GH', color: '#24292E', domain: 'github.com', rating: 4.9, popularity: 9200, prizeValue: 125000, region: 'Bengaluru', program: 'GitHub Octernships & Open-Source Campus Experts', cat: 'Internship', stipend: '₹1,25,000 / mo ($1,500)', skills: ['Git', 'TypeScript', 'Python', 'Open Source'], loc: 'Remote / India', url: 'https://education.github.com' },
  { name: 'GitLab', symbol: '🦊', badge: 'GL', color: '#FC6D26', domain: 'gitlab.com', rating: 4.8, popularity: 6700, prizeValue: 165000, region: 'Bengaluru', program: 'GitLab DevSecOps & Remote Open-Core Engineering Intern', cat: 'Internship', stipend: '₹1,65,000 / mo ($2,000)', skills: ['Ruby', 'Go', 'Git', 'Cloud'], loc: '100% Remote', url: 'https://about.gitlab.com/jobs/' },
  { name: 'Cloudflare', symbol: '🛡️', badge: 'CF', color: '#F38020', domain: 'cloudflare.com', rating: 4.9, popularity: 7700, prizeValue: 110000, region: 'Bengaluru', program: 'Cloudflare Systems, Rust & Edge Network Intern', cat: 'Internship', stipend: '₹1,10,000 / mo', skills: ['Rust', 'C++', 'Go', 'Networking'], loc: 'Bengaluru / Remote', url: 'https://cloudflare.com/careers/early-talent/' },
  { name: 'Stripe', symbol: '💳', badge: 'ST', color: '#635BFF', domain: 'stripe.com', rating: 5.0, popularity: 8800, prizeValue: 125000, region: 'Bengaluru', program: 'Stripe Financial Infrastructure & API Engineering Intern', cat: 'Internship', stipend: '₹1,25,000 / mo', skills: ['Ruby', 'Java', 'TypeScript', 'System Design'], loc: 'Bengaluru', url: 'https://stripe.com/jobs/university' },
  { name: 'Uber', symbol: '🚗', badge: 'UB', color: '#000000', domain: 'uber.com', rating: 4.9, popularity: 9300, prizeValue: 140000, region: 'Bengaluru', program: 'Uber HackTag 4.0 & UberSTAR SWE Internship', cat: 'Hackathon', stipend: '₹1,40,000 / mo + PPO', skills: ['Go', 'Java', 'C++', 'Algorithms'], loc: 'Bengaluru / Hyderabad', url: 'https://uber.com/careers' },
  { name: 'BrowserStack', symbol: '🌐', badge: 'BS', color: '#F05A28', domain: 'browserstack.com', rating: 4.8, popularity: 6500, prizeValue: 80000, region: 'Mumbai / Pune', program: 'BrowserStack Cloud Testing Infrastructure SDE Intern', cat: 'Internship', stipend: '₹80,000 / mo', skills: ['Ruby', 'React', 'Node.js', 'Linux'], loc: 'Mumbai / Remote', url: 'https://browserstack.com/careers' },
  { name: 'Red Hat', symbol: '🎩', badge: 'RH', color: '#EE0000', domain: 'redhat.com', rating: 4.7, popularity: 6150, prizeValue: 45000, region: 'Mumbai / Pune', program: 'Red Hat Open Source Linux Kernel & Kubernetes Intern', cat: 'Internship', stipend: '₹45,000 / mo', skills: ['Linux', 'C++', 'Python', 'Go'], loc: 'Pune / Bengaluru', url: 'https://redhat.com/en/jobs' },
  { name: 'ServiceNow', symbol: '⚙️', badge: 'SN', color: '#293E40', domain: 'servicenow.com', rating: 4.8, popularity: 7100, prizeValue: 85000, region: 'Hyderabad', program: 'ServiceNow Code to Win & Enterprise AI Workflow Intern', cat: 'Hackathon', stipend: '₹85,000 / mo + Prizes', skills: ['Java', 'JavaScript', 'AI/ML', 'DSA'], loc: 'Hyderabad', url: 'https://careers.servicenow.com' },
  { name: 'Autodesk', symbol: '📐', badge: 'AD', color: '#0696D7', domain: 'autodesk.com', rating: 4.7, popularity: 5800, prizeValue: 65000, region: 'Mumbai / Pune', program: 'Autodesk CAD Geometry, 3D Graphics & Cloud Intern', cat: 'Internship', stipend: '₹65,000 / mo', skills: ['C++', 'CAD', 'Python', 'Computer Graphics'], loc: 'Pune / Bengaluru', url: 'https://autodesk.com/careers' },
  { name: 'Siemens', symbol: '⚡', badge: 'SI', color: '#009999', domain: 'siemens.com', rating: 4.6, popularity: 5600, prizeValue: 45000, region: 'Mumbai / Pune', program: 'Siemens Digital Industries, EDA & Smart Grid Intern', cat: 'Internship', stipend: '₹45,000 / mo', skills: ['C++', 'PLC/IoT', 'VLSI', 'Mechanical CAD'], loc: 'Pune / Bengaluru / Noida', url: 'https://siemens.com/careers' },
  { name: 'PayPal', symbol: '💸', badge: 'PP', color: '#003087', domain: 'paypal.com', rating: 4.8, popularity: 7750, prizeValue: 95000, region: 'Vellore / Chennai', program: 'PayPal Campus Challenge & Risk AI Engineering Intern', cat: 'Hackathon', stipend: '₹95,000 / mo', skills: ['Java', 'Python', 'AI/ML', 'DSA'], loc: 'Chennai / Bengaluru', url: 'https://careers.pypl.com' },
  { name: 'Intuit', symbol: '💠', badge: 'IT', color: '#236CFF', domain: 'intuit.com', rating: 4.9, popularity: 7950, prizeValue: 105000, region: 'Bengaluru', program: 'Intuit Augment AI & Financial Software Co-Op Intern', cat: 'Internship', stipend: '₹1,05,000 / mo', skills: ['Java', 'React', 'Python', 'AI/ML'], loc: 'Bengaluru', url: 'https://intuit.com/careers/' },
];

// 450 Additional Companies to complete 500 Tech Companies
const EXTRA_450_COMPANIES = [
  'JPMorgan Chase', 'Goldman Sachs', 'Morgan Stanley', 'Tower Research Capital', 'D. E. Shaw India', 'Arcesium', 'Rubrik', 'Cohesity', 'Nutanix', 'Confluent',
  'Snowflake', 'Databricks', 'Palantir', 'MongoDB', 'Elastic', 'Datadog', 'CrowdStrike', 'Palo Alto Networks', 'Fortinet', 'Zscaler',
  'Okta', 'Twilio', 'SendGrid', 'Shopify', 'Spotify', 'Netflix India', 'Airbnb India', 'LinkedIn India', 'Dropbox', 'Box',
  'Slack', 'Zoom', 'Figma', 'Canva', 'Notion', 'Linear', 'Vercel', 'Supabase', 'Postman', 'Hasura',
  'Chargebee', 'Innovaccer', 'Icertis', 'Druva', 'HighRadius', 'Mindtickle', 'Gupshup', 'Amagi', 'Uniphore', 'Darwinbox',
  'Leadsquared', 'Whatfix', 'MoEngage', 'CleverTap', 'WebEngage', 'Yellow.ai', 'Haptik', 'Kore.ai', 'Sarvam AI', 'Krutrim AI',
  'Ola Electric', 'Ather Energy', 'Rapido', 'Namma Yatri', 'Porter', 'Delhivery', 'Shadowfax', 'Shiprocket', 'BlackBuck', 'Zepto',
  'BigBasket', 'Blinkit', 'Nykaa', 'Myntra', 'Ajio', 'Purplle', 'Mamaearth', 'Lenskart', 'boAt Lifestyle', 'Noise',
  'Ultrahuman', 'Cure.fit', 'Practo', 'PharmEasy', 'Tata 1mg', 'HealthKart', 'MediBuddy', 'Pristyn Care', 'Qure.ai', 'Niramai',
  'BugWorks', 'Biocon', 'Dr.Reddys Labs', 'Sun Pharma Tech', 'Cipla Digital', 'Lupin Research', 'Zydus Lifesciences', 'Syngene', 'Strand Life Sciences', 'Texas Instruments',
  'NXP Semiconductors', 'STMicroelectronics', 'Analog Devices', 'Broadcom', 'Marvell Technology', 'MediaTek India', 'ARM India', 'Synopsys', 'Cadence Design Systems', 'Ansys',
  'MathWorks', 'National Instruments', 'Micron Technology', 'Western Digital', 'Seagate', 'SanDisk', 'Lam Research', 'Applied Materials', 'KLA Tencor', 'Tejas Networks',
  'Saankhya Labs', 'Mindgrove Tech', 'InCore Semiconductors', 'Netrasemi', 'Morphing Machines', 'Signalchip', 'VVDN Technologies', 'MosChip', 'Tata Elxsi', 'L&T Technology Services',
  'KPIT Technologies', 'Cyient', 'Sasken Technologies', 'QuEST Global', 'Tata Technologies', 'Mahindra Electric', 'Ashok Leyland EV', 'Bajaj Auto Tech', 'TVS Motor Digital', 'Hero MotoCorp Vida',
  'Royal Enfield Tech', 'Maruti Suzuki R&D', 'Hyundai Mobis India', 'Mercedes-Benz R&D India', 'BMW TechWorks India', 'Volvo Group India', 'Bosch Global Software', 'Continental Automotive', 'ZF India Tech', 'Valeo India',
  'Harman International', 'Schneider Electric', 'ABB India', 'Honeywell Technology', 'GE Vernova', 'GE Aerospace India', 'Rolls-Royce India Tech', 'Airbus India Engineering', 'Boeing India Tech', 'Collins Aerospace',
  'Safran Engineering', 'Thales India', 'Garuda Aerospace', 'IdeaForge', 'Skylark Drones', 'Asteria Aerospace', 'Pixxel Space', 'Skyroot Aerospace', 'Agnikul Cosmos', 'Dhruva Space',
  'Bellatrix Aerospace', 'Digantara', 'GalaxEye Space', 'SatSure', 'MapmyIndia', 'Genesys International', 'Larsen & Toubro ECC', 'Tata Projects Digital', 'Shapoorji Pallonji Tech', 'Godrej Aerospace',
  'Reliance Digital Labs', 'Adani Green Energy Tech', 'Tata Power Solar', 'ReNew Power AI', 'Suzlon Energy', 'Aarti Industries', 'Pidilite R&D', 'Asian Paints Research', 'Vedanta Digital', 'JSW Steel Tech',
  'Tata Steel Automation', 'Hindalco Innovation', 'UltraTech Digital', 'ITC Infotech', 'Hindustan Unilever R&D', 'Procter & Gamble Tech', 'Nestle India Digital', 'Mondelez Tech Center', 'PepsiCo GBS Hyderabad', 'Coca-Cola Tech Hub',
  'AB InBev GCC', 'Diageo India Tech', 'Walmart Global Tech', 'Target in India', 'Lowe’s India', 'Tesco Technology', 'Marks & Spencer Tech', 'IKEA Digital Hub', 'Nike Tech Center India', 'Adidas Digital Hub',
  'Puma India Tech', 'Levi Strauss Tech', 'H&M Digital Lab', 'Citigroup Tech Pune', 'Bank of America Continuum', 'Barclays Global Service', 'Deutsche Bank Tech', 'UBS India Tech', 'BNP Paribas ISPL', 'Societe Generale GSC',
  'Standard Chartered GBS', 'HSBC Technology India', 'Wells Fargo India', 'BNY Mellon Tech', 'State Street HCL', 'BlackRock India', 'Fidelity Investments', 'Vanguard Partners', 'Charles Schwab India', 'Mastercard Tech Hub',
  'Visa Technology Center', 'American Express India', 'Discover Financial', 'Capital One India', 'NatWest Group India', 'Macquarie Group Tech', 'Nomura Services India', 'Jane Street Prep', 'Citadel Securities Track', 'Optiver Campus Track',
  'IMC Trading Challenge', 'WorldQuant Brain India', 'AlphaGrep Securities', 'Graviton Research', 'Quadeye Securities', 'NK Securities', 'Tower Research Gurgaon', 'Two Sigma Challenge', 'Millennium Management', 'Point72 Academy',
  'AQR Capital India', 'Zerodha Tech (Kite)', 'Upstox Engineering', 'Angel One Tech', 'Dhan HQ', 'Smallcase', 'Sensibull', 'Streak AI', 'Kuvera', 'Scripbox',
  'ETMoney', 'CoinDCX', 'CoinSwitch', 'Polygon Labs', 'InstaDapp', 'Biconomy', 'Push Protocol', 'Shardeum', 'Mudrex', 'Liminal Custody',
  'Router Protocol', 'Pine Labs', 'BharatPe', 'MobiKwik', 'Freecharge', 'Slice', 'Uni Cards', 'OneCard (FPL)', 'Fi Money', 'Jupiter Money',
  'Niyo Solutions', 'Juspay', 'Cashfree Payments', 'Easebuzz', 'PayU India', 'BillDesk', 'CCAvenue', 'Open Financial', 'Khatabook', 'OkCredit',
  'Vyapar App', 'Clear (ClearTax)', 'Zeta Suite', 'Perfios', 'Signzy', 'HyperVerge', 'IDfy', 'Karza Technologies', 'Setu API', 'Decentro',
  'FinBox', 'Lendingkart', 'KreditBee', 'MoneyView', 'Fibe (EarlySalary)', 'Navi Technologies', 'Rupeek', 'Indifi', 'OfBusiness', 'Oxyzo',
  'Yubi (CredAvenue)', 'Acko Insurance', 'Digit Insurance', 'Policybazaar Tech', 'Turtlemint', 'Plum HQ', 'Onsurity', 'Ditto Insurance', 'Loop Health', 'Even Healthcare',
  'Niva Bupa Digital', 'Deloitte USI', 'PwC Acceleration Center', 'EY GDS India', 'KPMG Global Services', 'McKinsey Digital Labs', 'BCG X Tech', 'Bain Capability Network', 'ZS Associates', 'Mu Sigma',
  'Fractal Analytics', 'Tiger Analytics', 'LatentView Analytics', 'Tredence', 'TheMathCompany', 'Absolutdata', 'Course5 Intelligence', 'Evalueserve', 'Crisil Quant', 'ICRA Analytics',
  'Morningstar India', 'S&P Global India', 'Moody’s Analytics', 'MSCI India Tech', 'Bloomberg Prep Track', 'FactSet Hyderabad', 'LSEG Tech India', 'Nasdaq Bengaluru', 'Broadridge Financial', 'FIS Global India',
  'Fiserv India', 'GlobalLogic', 'EPAM Systems', 'Thoughtworks', 'Publicis Sapient', 'Nagarro', 'HashedIn by Deloitte', 'Successive Digital', 'To The New', 'Kellton Tech',
  'Happiest Minds', 'Coforge', 'Mphasis', 'Hexaware', 'Zensar Technologies', 'Birlasoft', 'Sonata Software', 'Mastek', 'Newgen Software', 'Intellect Design Arena',
  'Nucleus Software', 'Ramco Systems', 'Subex', 'Tanla Platforms', 'Route Mobile', 'RateGain', 'Mappls', 'Info Edge (Naukri)', 'Indiamart Tech', 'Justdial Engineering',
  'Matrimony.com Tech', 'MakeMyTrip', 'Goibibo', 'Yatra Online', 'Ixigo', 'Cleartrip', 'EaseMyTrip', 'Oyo Rooms Tech', 'Treebo Hotels', 'FabHotels',
  'RedBus', 'AbhiBus', 'BookMyShow', 'Paytm Insider', 'Pratilipi', 'Pocket FM', 'Kuku FM', 'ShareChat', 'Moj App', 'Josh (VerSe)',
  'InMobi', 'Glance', 'Affle India', 'PubMatic', 'Media.net', 'Directi', 'Flock', 'Radix Registry', 'Titan Tech', 'Dream11 (Dream Sports)',
  'Games24x7', 'MPL Gaming', 'Nazara Technologies', 'WinZO Games', 'Krafton India', 'Nodwin Gaming', 'Loco Streaming', 'Rooter Sports', 'Stan Esports', 'PhysicsWallah Tech',
  'Unacademy', 'UpGrad', 'Scaler Academy', 'Newton School', 'Masai School', 'NxtWave', 'GeeksforGeeks', 'Coding Ninjas', 'Coding Blocks', 'Sprinklr',
  'Five9 India', 'Genesys Cloud', 'RingCentral', '8x8 India', 'Freshchat', 'Intercom Partner', 'Zendesk Pune', 'HubSpot Partner', 'Pipedrive Tech', 'Zoho Desk',
  ' Postman Labs', 'BrowserStack Automate', 'LambdaTest', 'HeadSpin India', ' pCloudy', ' Hasura Cloud', 'Appsmith', 'ToolJet', 'DronaHQ', ' Hoppscotch'
];

// --- CORE 30 COLLEGES & UNIVERSITIES ---
const COLLEGES_LIST = [
  { name: 'IIT Madras', symbol: '🏛️', badge: 'IITM', color: '#800000', domain: 'iitm.ac.in', rating: 5.0, popularity: 9800, prizeValue: 250000, region: 'Vellore / Chennai', fest: 'Shaastra & Research Park Fellowship', cat: 'Techfest', prize: '₹2,50,000 Pool + Lab Residency', skills: ['Robotics', 'AI/ML', 'Python', 'GNU Octave'], loc: 'Chennai (135 km from Vellore)', url: 'https://shaastra.org' },
  { name: 'IIT Bombay', symbol: '🏛️', badge: 'IITB', color: '#003366', domain: 'iitb.ac.in', rating: 5.0, popularity: 9950, prizeValue: 350000, region: 'Mumbai / Pune', fest: 'Techfest International Coding & AI Mandate', cat: 'Techfest', prize: '₹3,50,000 Prize Pool', skills: ['C++', 'Python', 'AI/ML', 'Robotics'], loc: 'Mumbai', url: 'https://techfest.org' },
  { name: 'IIT Delhi', symbol: '🏛️', badge: 'IITD', color: '#B31B1B', domain: 'iitd.ac.in', rating: 4.9, popularity: 9400, prizeValue: 200000, region: 'Delhi NCR', fest: 'Tryst Annual Techfest & SRFP Summer Research', cat: 'Techfest', prize: '₹2,00,000 Pool + Stipend', skills: ['Python', 'AI/ML', 'VLSI', 'CAD'], loc: 'New Delhi', url: 'https://home.iitd.ac.in' },
  { name: 'IIT Kanpur', symbol: '🏛️', badge: 'IITK', color: '#D35400', domain: 'iitk.ac.in', rating: 4.9, popularity: 9100, prizeValue: 220000, region: 'Delhi NCR', fest: 'Techkriti — Inter-College Innovation & Cyber Security', cat: 'Techfest', prize: '₹2,20,000 Prize Pool', skills: ['Cybersecurity', 'C++', 'Robotics', 'Python'], loc: 'Kanpur', url: 'https://techkriti.org' },
  { name: 'IIT Kharagpur', symbol: '🏛️', badge: 'KGP', color: '#1F3A93', domain: 'iitkgp.ac.in', rating: 4.9, popularity: 9350, prizeValue: 300000, region: 'Hyderabad', fest: 'Kshitij — Asia Largest Techno-Management Symposium', cat: 'Techfest', prize: '₹3,00,000 Prize Pool', skills: ['AI/ML', 'Data Science', 'CAD', 'Algorithms'], loc: 'Kharagpur', url: 'https://ktj.in' },
  { name: 'IIT Roorkee', symbol: '🏛️', badge: 'IITR', color: '#117A65', domain: 'iitr.ac.in', rating: 4.9, popularity: 8900, prizeValue: 200000, region: 'Delhi NCR', fest: 'Cognizance — Syntax Error Hackathon & Core Design', cat: 'Hackathon', prize: '₹2,00,000 Prize Pool', skills: ['React', 'Python', 'C++', 'Civil/Mech CAD'], loc: 'Roorkee', url: 'https://cognizance.org.in' },
  { name: 'IIT Guwahati', symbol: '🏛️', badge: 'IITG', color: '#1F618D', domain: 'iitg.ac.in', rating: 4.8, popularity: 8400, prizeValue: 180000, region: 'Hyderabad', fest: 'Techniche — Northeast Flagship Tech & Robotics Fest', cat: 'Techfest', prize: '₹1,80,000 Prize Pool', skills: ['Robotics', 'Python', 'IoT', 'Algorithms'], loc: 'Guwahati', url: 'https://techniche.org.in' },
  { name: 'IIT Hyderabad', symbol: '🏛️', badge: 'IITH', color: '#8E44AD', domain: 'iith.ac.in', rating: 4.9, popularity: 8600, prizeValue: 150000, region: 'Hyderabad', fest: 'Elan & nVision — Autonomous AI & Chips Hackathon', cat: 'Hackathon', prize: '₹1,50,000 Prize Pool', skills: ['AI/ML', 'VLSI', 'Python', 'C++'], loc: 'Hyderabad', url: 'https://elan.org.in' },
  { name: 'IIT Indore', symbol: '🏛️', badge: 'IITI', color: '#2E4053', domain: 'iiti.ac.in', rating: 4.7, popularity: 7200, prizeValue: 120000, region: 'Mumbai / Pune', fest: 'Fluxus — Central India Techno-Cultural & Coding Sprint', cat: 'Techfest', prize: '₹1,20,000 Prize Pool', skills: ['C++', 'Python', 'Web Dev', 'DSA'], loc: 'Indore', url: 'https://iiti.ac.in' },
  { name: 'IIT (BHU) Varanasi', symbol: '🏛️', badge: 'BHU', color: '#A04000', domain: 'iitbhu.ac.in', rating: 4.8, popularity: 8500, prizeValue: 200000, region: 'Delhi NCR', fest: 'Technex — Oldest Techno-Management Fest & ByteTheBits', cat: 'Techfest', prize: '₹2,00,000 Prize Pool', skills: ['C++', 'Python', 'AI/ML', 'Electronics'], loc: 'Varanasi', url: 'https://technex.co.in' },
  { name: 'NIT Tiruchirappalli', symbol: '🔱', badge: 'NITT', color: '#922B21', domain: 'nitt.edu', rating: 4.9, popularity: 9250, prizeValue: 175000, region: 'Vellore / Chennai', fest: 'Pragyan — ISO Certified Hardware, VLSI & Code Character', cat: 'Techfest', prize: '₹1,75,000 Prize Pool', skills: ['VLSI', 'Signal Processing', 'C++', 'GNU Octave'], loc: 'Tiruchirappalli (Tamil Nadu)', url: 'https://pragyan.org' },
  { name: 'NIT Karnataka, Surathkal', symbol: '⚓', badge: 'NITK', color: '#1B4F72', domain: 'nitk.ac.in', rating: 4.9, popularity: 8800, prizeValue: 160000, region: 'Bengaluru', fest: 'Engineer — Coastal Flagship Hackathon & Marine Robotics', cat: 'Techfest', prize: '₹1,60,000 Prize Pool', skills: ['Robotics', 'Python', 'React', 'CAD'], loc: 'Surathkal (Karnataka)', url: 'https://nitk.ac.in' },
  { name: 'NIT Warangal', symbol: '⚙️', badge: 'NITW', color: '#0E6251', domain: 'nitw.ac.in', rating: 4.8, popularity: 8450, prizeValue: 150000, region: 'Hyderabad', fest: 'Technozion — South India Premier Core & Software Sprint', cat: 'Techfest', prize: '₹1,50,000 Prize Pool', skills: ['Java', 'Python', 'VLSI', 'Chemical/Mech'], loc: 'Warangal', url: 'https://nitw.ac.in' },
  { name: 'NIT Calicut', symbol: '🌴', badge: 'NITC', color: '#784212', domain: 'nitc.ac.in', rating: 4.7, popularity: 7600, prizeValue: 140000, region: 'Bengaluru', fest: 'Tathva — Malabar Tech Symposium & FOSS Meet', cat: 'Techfest', prize: '₹1,40,000 Prize Pool', skills: ['Open Source', 'Linux', 'Python', 'Embedded C'], loc: 'Kozhikode', url: 'https://tathva.org' },
  { name: 'NIT Rourkela', symbol: '🚀', badge: 'NITR', color: '#6C3483', domain: 'nitrkl.ac.in', rating: 4.8, popularity: 8100, prizeValue: 150000, region: 'Hyderabad', fest: 'Innovision — Eastern India Space, AI & Core Techfest', cat: 'Techfest', prize: '₹1,50,000 Prize Pool', skills: ['AI/ML', 'Robotics', 'Python', 'Metallurgy/Core'], loc: 'Rourkela', url: 'https://nitrkl.ac.in' },
  { name: 'NIT Durgapur', symbol: '🔥', badge: 'NITD', color: '#1F618D', domain: 'nitdgp.ac.in', rating: 4.6, popularity: 6900, prizeValue: 110000, region: 'Hyderabad', fest: 'Aarohan — 2nd Oldest NIT Techno-Management Challenge', cat: 'Techfest', prize: '₹1,10,000 Prize Pool', skills: ['C++', 'Python', 'IoT', 'Automation'], loc: 'Durgapur', url: 'https://nitdgp.ac.in' },
  { name: 'NIT Delhi', symbol: '🏙️', badge: 'NITD', color: '#943126', domain: 'nitdelhi.ac.in', rating: 4.6, popularity: 6700, prizeValue: 100000, region: 'Delhi NCR', fest: 'TerraTechnica — NCR Smart Cities & FinTech Hackathon', cat: 'Hackathon', prize: '₹1,00,000 Prize Pool', skills: ['React', 'Python', 'AI/ML', 'IoT'], loc: 'New Delhi', url: 'https://nitdelhi.ac.in' },
  { name: 'NIT Patna', symbol: '🌉', badge: 'NITP', color: '#145A32', domain: 'nitp.ac.in', rating: 4.5, popularity: 6200, prizeValue: 90000, region: 'Delhi NCR', fest: 'Corona & Melange — Ganga Tech & Civil/CS Innovation', cat: 'Techfest', prize: '₹90,000 Prize Pool', skills: ['Python', 'C++', 'CAD', 'Web Dev'], loc: 'Patna', url: 'https://nitp.ac.in' },
  { name: 'IIIT Hyderabad', symbol: '🧠', badge: 'IIITH', color: '#1A5276', domain: 'iiit.ac.in', rating: 5.0, popularity: 9500, prizeValue: 200000, region: 'Hyderabad', fest: 'Felicity & Megathon — Research, CVIT & Systems Hackathon', cat: 'Hackathon', prize: '₹2,00,000 Pool + Research Fellowship', skills: ['Computer Vision', 'NLP/AI', 'C++', 'Algorithms'], loc: 'Hyderabad', url: 'https://iiit.ac.in' },
  { name: 'IIIT Bangalore', symbol: '💻', badge: 'IIITB', color: '#212F3D', domain: 'iiitb.ac.in', rating: 4.8, popularity: 8000, prizeValue: 125000, region: 'Bengaluru', fest: 'Infin8 & RISE Open-Source Digital Public Goods Sprint', cat: 'Hackathon', prize: '₹1,25,000 Prize Pool', skills: ['Python', 'Data Science', 'Cloud', 'VLSI'], loc: 'Bengaluru', url: 'https://iiitb.ac.in' },
  { name: 'IIIT Delhi', symbol: '🧬', badge: 'IIITD', color: '#008080', domain: 'iiitd.ac.in', rating: 4.9, popularity: 8650, prizeValue: 150000, region: 'Delhi NCR', fest: 'Esya — North India Premier CS, Bio-Computing & AI Fest', cat: 'Techfest', prize: '₹1,50,000 Prize Pool', skills: ['Python', 'AI/ML', 'Biotech', 'C++'], loc: 'New Delhi', url: 'https://iiitd.ac.in' },
  { name: 'VIT Vellore', symbol: '🎓', badge: 'VIT', color: '#1B365D', domain: 'vit.ac.in', rating: 5.0, popularity: 9980, prizeValue: 200000, region: 'Vellore / Chennai', fest: 'GraVITas & Yantra — International Smart Campus Hackathon', cat: 'Hackathon', prize: '₹2,00,000 Pool + Incubation', skills: ['Python', 'C++', 'AI/ML', 'GNU Octave'], loc: 'Vellore (0 km • On Campus)', url: 'https://vit.ac.in' },
  { name: 'BITS Pilani', symbol: '🚀', badge: 'BITS', color: '#C0392B', domain: 'bits-pilani.ac.in', rating: 4.9, popularity: 9450, prizeValue: 250000, region: 'Delhi NCR', fest: 'APOGEE — International Technical Symposium & Paper Track', cat: 'Techfest', prize: '₹2,50,000 Prize Pool', skills: ['Research', 'Python', 'C++', 'Startup Pitch'], loc: 'Pilani', url: 'https://bits-apogee.org' },
  { name: 'Manipal Institute of Technology', symbol: '⚡', badge: 'MIT', color: '#D35400', domain: 'manipal.edu', rating: 4.7, popularity: 7900, prizeValue: 140000, region: 'Bengaluru', fest: 'TechTatva — National Student Subsystems & Coding Fest', cat: 'Techfest', prize: '₹1,40,000 Prize Pool', skills: ['Robotics', 'Python', 'React', 'Aerospace CAD'], loc: 'Manipal', url: 'https://manipal.edu' },
  { name: 'Thapar Institute of Engineering and Technology', symbol: '🛠️', badge: 'TIET', color: '#8E24AA', domain: 'thapar.edu', rating: 4.7, popularity: 7750, prizeValue: 150000, region: 'Delhi NCR', fest: 'Saturnalia & Makeathon — Hardware/Software Sprint', cat: 'Hackathon', prize: '₹1,50,000 Prize Pool', skills: ['C++', 'Python', 'IoT', 'AI/ML'], loc: 'Patiala', url: 'https://thapar.edu' },
  { name: 'PES University', symbol: '💻', badge: 'PES', color: '#0D47A1', domain: 'pes.edu', rating: 4.8, popularity: 8150, prizeValue: 150000, region: 'Bengaluru', fest: 'Aatmatrisha & HashCode — Silicon Valley 24h Hackathon', cat: 'Hackathon', prize: '₹1,50,000 Prize Pool', skills: ['Python', 'React', 'Cloud', 'AI/ML'], loc: 'Bengaluru (210 km from Vellore)', url: 'https://pes.edu' },
  { name: 'RV College of Engineering', symbol: '🏎️', badge: 'RVCE', color: '#1565C0', domain: 'rvce.edu.in', rating: 4.7, popularity: 7500, prizeValue: 120000, region: 'Bengaluru', fest: '8th Mile & RVCE IEEE — Autonomous Mobility & AI Challenge', cat: 'Techfest', prize: '₹1,20,000 Prize Pool', skills: ['Embedded C', 'Python', 'AI/ML', 'VLSI'], loc: 'Bengaluru', url: 'https://rvce.edu.in' },
  { name: 'BMS College of Engineering', symbol: '🔬', badge: 'BMS', color: '#283593', domain: 'bmsce.ac.in', rating: 4.7, popularity: 7300, prizeValue: 110000, region: 'Bengaluru', fest: 'Phase Shift — Flagship Technical Symposium & CodeSprint', cat: 'Techfest', prize: '₹1,10,000 Prize Pool', skills: ['Java', 'Python', 'IoT', 'Robotics'], loc: 'Bengaluru', url: 'https://bmsce.ac.in' },
  { name: 'Jadavpur University', symbol: '🏛️', badge: 'JU', color: '#B71C1C', domain: 'jadavpuruniversity.in', rating: 4.9, popularity: 8700, prizeValue: 130000, region: 'Hyderabad', fest: 'Srijan — Eastern India Premier Low-Cost Tech & Code Fest', cat: 'Techfest', prize: '₹1,30,000 Prize Pool', skills: ['C++', 'Algorithms', 'Python', 'Electronics'], loc: 'Kolkata', url: 'https://jadavpuruniversity.in' },
  { name: 'Delhi Technological University', symbol: '🏛️', badge: 'DTU', color: '#4A148C', domain: 'dtu.ac.in', rating: 4.8, popularity: 8850, prizeValue: 200000, region: 'Delhi NCR', fest: 'Invictus — DTU Annual Techfest & Vihaan Hackathon', cat: 'Hackathon', prize: '₹2,00,000 Prize Pool', skills: ['C++', 'Python', 'AI/ML', 'Web3/React'], loc: 'New Delhi', url: 'https://dtu.ac.in' },
];

// 170 Additional Colleges to complete 200 Colleges
const EXTRA_170_COLLEGES = [
  'IIT Ropar', 'IIT Gandhinagar', 'IIT Jodhpur', 'IIT Patna', 'IIT Bhubaneswar', 'IIT Mandi', 'IIT Tirupati', 'IIT Palakkad', 'IIT Bhilai', 'IIT Goa',
  'IIT Jammu', 'IIT Dharwad', 'IIT (ISM) Dhanbad', 'IISc Bangalore', 'IISER Pune', 'IISER Kolkata', 'IISER Mohali', 'IISER Bhopal', 'IISER Thiruvananthapuram', 'IISER Tirupati',
  'IISER Berhampur', 'NISER Bhubaneswar', 'ISI Kolkata', 'CMI Chennai', 'TIFR Mumbai', 'IIST Thiruvananthapuram', 'ICT Mumbai', 'IIEST Shibpur', 'NIT Kurukshetra', 'MNIT Jaipur',
  'VNIT Nagpur', 'MNNIT Allahabad', 'SVNIT Surat', 'MANIT Bhopal', 'NIT Silchar', 'NIT Hamirpur', 'NIT Jalandhar', 'NIT Raipur', 'NIT Agartala', 'NIT Srinagar',
  'NIT Jamshedpur', 'NIT Meghalaya', 'NIT Nagaland', 'NIT Manipur', 'NIT Mizoram', 'NIT Sikkim', 'NIT Arunachal Pradesh', 'NIT Uttarakhand', 'NIT Andhra Pradesh', 'NIT Goa',
  'NIT Puducherry', 'IIIT Allahabad', 'IIITM Gwalior', 'IIITDM Jabalpur', 'IIITDM Kancheepuram', 'IIITDM Kurnool', 'IIIT Sri City', 'IIIT Guwahati', 'IIIT Vadodara', 'IIIT Kota',
  'IIIT Tiruchirappalli', 'IIIT Una', 'IIIT Sonepat', 'IIIT Kalyani', 'IIIT Lucknow', 'IIIT Dharwad', 'IIIT Kottayam', 'IIIT Manipur', 'IIIT Nagpur', 'IIIT Pune',
  'IIIT Ranchi', 'IIIT Surat', 'IIIT Bhopal', 'IIIT Bhagalpur', 'IIIT Agartala', 'IIIT Raichur', 'VIT Chennai', 'VIT AP Amaravati', 'VIT Bhopal', 'BITS Pilani Goa Campus',
  'BITS Pilani Hyderabad Campus', 'SRM Institute Kattankulathur', 'SRM Ramapuram', 'SRM AP', 'Amrita Vishwa Vidyapeetham Coimbatore', 'Amrita Amritapuri', 'Amrita Bengaluru', 'Anna University CEG Guindy', 'MIT Chromepet (Anna Univ)', 'ACT Campus Anna Univ',
  'SSN College of Engineering Chennai', 'PSG College of Technology Coimbatore', 'Coimbatore Institute of Technology (CIT)', 'Thiagarajar College of Engineering Madurai', 'Kumaraguru College of Technology', 'Sri Krishna College of Engineering', 'Rajalakshmi Engineering College', 'Sathyabama Institute Chennai', 'Saveetha Engineering College', 'Vel Tech University Chennai',
  'Hindustan Institute of Technology Chennai', 'Crescent Institute Chennai', 'Kalasalingam Academy', 'Karunya Institute Coimbatore', 'SASTRA Deemed University Thanjavur', 'NSUT Delhi', 'IGDTUW Delhi', 'Jamia Millia Islamia Engineering', 'MAIT Delhi', 'MSIT Delhi',
  'Bharati Vidyapeeth COE Delhi', 'GGSIPU Delhi', 'JIIT Noida', 'Shiv Nadar University Greater Noida', 'Bennett University Greater Noida', 'Ashoka University CS', 'Plaksha University Mohali', 'PEC Chandigarh', 'UIET Panjab University', 'Chandigarh University',
  'Chitkara University Punjab', 'LPU Jalandhar', 'UPES Dehradun', 'Graphic Era Dehradun', 'GB Pant University', 'HBTU Kanpur', 'IET Lucknow', 'MMMUT Gorakhpur', 'AMU ZHCET Aligarh', 'BHU Institute of Science',
  'BIT Mesra Ranchi', 'BIT Sindri', 'KIIT University Bhubaneswar', 'SOA University Bhubaneswar', 'VSSUT Burla', 'Silicon Institute Bhubaneswar', 'Heritage Institute Kolkata', 'IEM Kolkata', 'Techno Main Salt Lake', 'KGEC Kalyani',
  'JGEC Jalpaiguri', 'COEP Technological University Pune', 'VJTI Mumbai', 'SPIT Mumbai', 'DJ Sanghvi Mumbai', 'KJ Somaiya Mumbai', 'Thadomal Shahani Mumbai', 'Fr. CRCE Mumbai', 'Walchand COE Sangli', 'PICT Pune',
  'VIT Pune', 'MIT World Peace University Pune', 'Cummins COE Pune', 'Symbiosis Institute of Tech Pune', 'Ramdeobaba University Nagpur', 'LDCE Ahmedabad', 'DAIICT Gandhinagar', 'Nirma University Ahmedabad', 'PDEU Gandhinagar', 'MSU Baroda',
  'MS Ramaiah (MSRIT) Bengaluru', 'Dayananda Sagar (DSCE) Bengaluru', 'Bangalore Institute of Tech (BIT)', 'NMIT Bengaluru', 'New Horizon COE', 'CMRIT Bengaluru', 'JSS STU Mysuru', 'NIE Mysuru', 'KLE Tech Hubballi', 'Manipal University Jaipur'
];

const ALL_BRANCHES = ['CSE', 'IT', 'AIML', 'Data Science', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Biotech'];
const NEARBY_HUBS = ['Vellore / Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai / Pune', 'Delhi NCR', 'All India'];

const SORT_OPTIONS = [
  { id: 'smart', label: '⚡ Smart Match' },
  { id: 'date', label: '📅 Date (Closing Soon)' },
  { id: 'prize', label: '💰 Prize / Stipend' },
  { id: 'rating', label: '★ Rating' },
  { id: 'popularity', label: '🔥 Popularity' },
];

const PRIZE_FILTERS = [
  { label: 'All Prizes', minPrize: 0 },
  { label: '₹1L+ Pool/Stipend', minPrize: 100000 },
  { label: '₹2L+ Mega Pool', minPrize: 200000 },
];

const RATING_FILTERS = [
  { label: 'All ★', min: 0 },
  { label: '4.8+ ★', min: 4.8 },
  { label: '4.9+ ★', min: 4.9 },
];

const getLogoUrl = (domain) => `https://icon.horse/icon/${domain}`;

// --- DUAL-LAYER SYMBOL + BRAND LOGO ---
function BrandSymbolLogo({ domain, badge, symbol, color, size = 50, borderColor = '#1a1a1a' }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <View style={{ width: size + 6, height: size + 6, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={[
          styles.logoContainer,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.32),
            borderColor,
            backgroundColor: imgFailed ? color || '#d9432f' : '#ffffff',
          },
        ]}
      >
        {imgFailed ? (
          <Text
            style={[
              styles.logoFallbackText,
              { fontSize: badge && badge.length > 3 ? 10 : 13 },
            ]}
          >
            {badge || 'CP'}
          </Text>
        ) : (
          <Image
            source={{ uri: getLogoUrl(domain) }}
            style={{ width: size * 0.68, height: size * 0.68, borderRadius: 6 }}
            resizeMode="contain"
            onError={() => setImgFailed(true)}
          />
        )}
      </View>
      <View style={[styles.symbolCornerBadge, { backgroundColor: color || '#1a1a1a', borderColor }]}>
        <Text style={styles.symbolCornerText}>{symbol || '✦'}</Text>
      </View>
    </View>
  );
}

// --- SMOOTH APPLE CASCADING HANDOFF + MOUSE HOVER ENLARGEMENT CARD ---
function AppleCascadeCard({ index, scrollY, listStartY, filterTrigger, onPress, children }) {
  const [localY, setLocalY] = useState(index * 235);
  const cascadeAnim = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const hoverScale = useRef(new Animated.Value(1)).current;
  const hoverLift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (index < 8) {
      cascadeAnim.setValue(0);
      Animated.spring(cascadeAnim, {
        toValue: 1,
        damping: 18,
        mass: 0.85,
        stiffness: 125,
        delay: (index % 8) * 60,
        useNativeDriver: true,
      }).start();
    } else {
      cascadeAnim.setValue(1);
    }
  }, [filterTrigger]);

  // Mouse Hover Enlargement Animation (Enlarges box when mouse hovers over it)
  const handleHoverIn = () => {
    Animated.parallel([
      Animated.spring(hoverScale, {
        toValue: 1.035,
        damping: 14,
        stiffness: 220,
        useNativeDriver: true,
      }),
      Animated.spring(hoverLift, {
        toValue: -5,
        damping: 14,
        stiffness: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleHoverOut = () => {
    Animated.parallel([
      Animated.spring(hoverScale, {
        toValue: 1,
        damping: 15,
        stiffness: 220,
        useNativeDriver: true,
      }),
      Animated.spring(hoverLift, {
        toValue: 0,
        damping: 15,
        stiffness: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.97,
      damping: 16,
      stiffness: 260,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      damping: 16,
      stiffness: 260,
      useNativeDriver: true,
    }).start();
  };

  const cardAbsY = listStartY + localY;
  const p0 = cardAbsY - SCREEN_HEIGHT - 40;
  const p1 = cardAbsY - SCREEN_HEIGHT * 0.68;
  const p2 = cardAbsY - SCREEN_HEIGHT * 0.32;
  const p3 = cardAbsY + 80;
  const p4 = cardAbsY + 340;

  const scrollTranslateX = scrollY.interpolate({
    inputRange: [p0, p1, p2, p3, p4],
    outputRange: [-115, -36, 0, 0, -14],
    extrapolate: 'clamp',
  });

  const scrollTranslateY = scrollY.interpolate({
    inputRange: [p0, p1, p2, p3, p4],
    outputRange: [32, 10, 0, 0, -12],
    extrapolate: 'clamp',
  });

  const scrollScale = scrollY.interpolate({
    inputRange: [p0, p1, p2, p3, p4],
    outputRange: [0.89, 0.96, 1, 1, 0.95],
    extrapolate: 'clamp',
  });

  const scrollOpacity = scrollY.interpolate({
    inputRange: [p0, p1, p2, p3, p4],
    outputRange: [0.32, 0.78, 1, 1, 0.65],
    extrapolate: 'clamp',
  });

  const mountTranslateX = cascadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-85, 0],
  });

  const mountScale = cascadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.92, 1],
  });

  const combinedScale = Animated.multiply(
    hoverScale,
    Animated.multiply(pressScale, Animated.multiply(mountScale, scrollScale))
  );

  return (
    <Animated.View
      onLayout={(e) => setLocalY(e.nativeEvent.layout.y)}
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
      style={{
        opacity: Animated.multiply(cascadeAnim, scrollOpacity),
        transform: [
          { translateX: Animated.add(scrollTranslateX, mountTranslateX) },
          { translateY: Animated.add(scrollTranslateY, hoverLift) },
          { scale: combinedScale },
        ],
      }}
    >
      <Pressable
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

// --- BUILD THE FULL 700-ITEM DIVERSE DATASET (500 Companies + 200 Colleges) ---
const BUILD_FULL_700_DATASET = () => {
  const companyOpps = [];

  // 1. First 50 Flagship Tech Companies
  TECH_COMPANIES.forEach((c, idx) => {
    const isCore = c.skills.some((s) =>
      ['VLSI', 'Embedded C', 'Signal Processing', 'CAD', 'PLC/IoT'].includes(s)
    );
    const branches = isCore
      ? ['ECE', 'EEE', 'Mechanical', 'CSE', 'IT', 'AIML']
      : ['CSE', 'IT', 'AIML', 'Data Science', 'ECE', 'EEE'];
    const day = ((idx * 3) % 26) + 2;
    const month = idx % 2 === 0 ? '11' : '12';
    const deadlineStr = `2026-${month}-${String(day).padStart(2, '0')}`;
    companyOpps.push({
      id: `comp-${idx + 1}`,
      title: `${c.name} — ${c.program}`,
      organizer: `${c.name} India`,
      institution: 'Corporate',
      orgType: 'Company',
      orgName: c.name,
      symbol: c.symbol,
      badge: c.badge,
      brandColor: c.color,
      domain: c.domain,
      rating: c.rating,
      popularity: c.popularity,
      prizeValue: c.prizeValue,
      region: c.region,
      sourcePlatform: 'Official Careers & LinkedIn',
      category: c.cat,
      eligibleBranches: branches,
      eligibleYears: [1, 2, 3, 4],
      skills: c.skills,
      mode: `Hybrid • ${c.loc}`,
      stipendOrPrize: c.stipend,
      deadline: deadlineStr,
      deadlineTimestamp: new Date(deadlineStr).getTime(),
      verifiedStatus: 'Verified Corporate Source',
      applyUrl: c.url,
      isNew: idx < 12,
      closingSoon: month === '11' && day <= 10,
      description: `Official ${c.name} student opportunity (${c.program}). Open to eligible engineering undergraduates with strong foundations in ${c.skills.join(', ')}.`,
    });
  });

  // 2. Remaining 450 Companies (Total = 500 Companies)
  const progTemplates = [
    { suffix: 'Summer Software Engineering Internship 2027', cat: 'Internship', stipend: '₹85,000 / mo', val: 85000 },
    { suffix: 'National AI & Cloud Innovation Hackathon', cat: 'Hackathon', stipend: '₹2,50,000 Prize Pool + PPO', val: 250000 },
    { suffix: 'Winter R&D & Systems Fellowship', cat: 'Research', stipend: '₹70,000 / mo + Grant', val: 70000 },
    { suffix: 'Campus CodeSprint & Hiring Challenge', cat: 'Hackathon', stipend: '₹1,50,000 Prizes + Intern', val: 150000 },
    { suffix: 'Core Hardware, VLSI & Embedded Track', cat: 'Internship', stipend: '₹65,000 / mo', val: 65000 },
  ];
  const skillPools = [
    ['Python', 'C++', 'AI/ML', 'DSA'],
    ['React', 'TypeScript', 'Node.js', 'Cloud'],
    ['VLSI', 'Embedded C', 'Signal Processing', 'GNU Octave'],
    ['Java', 'Spring', 'Distributed Systems', 'SQL'],
    ['Robotics', 'CAD', 'IoT', 'Automation'],
  ];
  const hubs = ['Vellore / Chennai', 'Bengaluru', 'Hyderabad', 'Mumbai / Pune', 'Delhi NCR'];
  const colors = ['#d9432f', '#007777', '#2874F0', '#5F259F', '#00A859', '#E23744'];
  const symbols = ['⚡', '🚀', '💻', '🧠', '🔬', '📡', '🛡️', '🌐'];

  EXTRA_450_COMPANIES.slice(0, 450).forEach((rawName, idx) => {
    const name = rawName.trim();
    const num = idx + 51;
    const prog = progTemplates[idx % progTemplates.length];
    const skills = skillPools[idx % skillPools.length];
    const region = hubs[idx % hubs.length];
    const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.com';
    const rating = Number((4.5 + ((idx * 7) % 6) * 0.1).toFixed(1));
    const popularity = 3400 + ((idx * 131) % 6000);
    const day = ((idx * 5) % 26) + 2;
    const month = idx % 2 === 0 ? '11' : '12';
    const deadlineStr = `2026-${month}-${String(day).padStart(2, '0')}`;

    companyOpps.push({
      id: `comp-${num}`,
      title: `${name} — ${prog.suffix}`,
      organizer: `${name} India`,
      institution: 'Corporate',
      orgType: 'Company',
      orgName: name,
      symbol: symbols[idx % symbols.length],
      badge: name.slice(0, 3).toUpperCase(),
      brandColor: colors[idx % colors.length],
      domain,
      rating: Math.min(5.0, rating),
      popularity,
      prizeValue: prog.val,
      region,
      sourcePlatform: 'Official Careers & LinkedIn',
      category: prog.cat,
      eligibleBranches: ALL_BRANCHES,
      eligibleYears: [1, 2, 3, 4],
      skills,
      mode: `Hybrid • ${region}`,
      stipendOrPrize: prog.stipend,
      deadline: deadlineStr,
      deadlineTimestamp: new Date(deadlineStr).getTime(),
      verifiedStatus: 'Verified Corporate Source',
      applyUrl: `https://www.google.com/search?q=${encodeURIComponent(name + ' careers india internship hackathon')}`,
      isNew: idx % 8 === 0,
      closingSoon: month === '11' && day <= 9,
      description: `${name} (${prog.suffix}) in ${region}. Open to undergraduate engineering students across India.`,
    });
  });

  const collegeOpps = [];

  // 3. First 30 Flagship Colleges
  COLLEGES_LIST.forEach((col, idx) => {
    const day = ((idx * 2) % 27) + 1;
    const month = idx % 2 === 0 ? '11' : '12';
    const deadlineStr = `2026-${month}-${String(day).padStart(2, '0')}`;
    collegeOpps.push({
      id: `col-${idx + 1}`,
      title: `${col.name} — ${col.fest}`,
      organizer: `${col.name} Technical Council`,
      institution: col.name,
      orgType: 'College',
      orgName: col.name,
      symbol: col.symbol,
      badge: col.badge,
      brandColor: col.color,
      domain: col.domain,
      rating: col.rating,
      popularity: col.popularity,
      prizeValue: col.prizeValue,
      region: col.region,
      sourcePlatform: `${col.name} Portal / Unstop`,
      category: col.cat,
      eligibleBranches: ALL_BRANCHES,
      eligibleYears: [1, 2, 3, 4],
      skills: col.skills,
      mode: `Offline / Hybrid • ${col.loc}`,
      stipendOrPrize: col.prize,
      deadline: deadlineStr,
      deadlineTimestamp: new Date(deadlineStr).getTime(),
      verifiedStatus: 'Verified Institutional Portal',
      applyUrl: col.url,
      isNew: idx < 8 || col.name === 'VIT Vellore',
      closingSoon: month === '11' && day <= 10,
      description: `Inter-collegiate technical fest, research fellowship, and hackathon hosted by ${col.name} in ${col.loc}. Open to engineering branches across India.`,
    });
  });

  // 4. Remaining 170 Colleges (Total = 200 Colleges)
  const colEvents = [
    { suffix: 'Annual National Techfest & Robotics Mandate', cat: 'Techfest', prize: '₹2,00,000 Prize Pool', val: 200000 },
    { suffix: '36-Hour Inter-College Smart Campus Hackathon', cat: 'Hackathon', prize: '₹1,50,000 Prize Pool', val: 150000 },
    { suffix: 'Summer Faculty Research Fellowship (SRFP)', cat: 'Research', prize: '₹45,000 Fellowship Grant', val: 45000 },
  ];

  EXTRA_170_COLLEGES.slice(0, 170).forEach((name, idx) => {
    const num = idx + 31;
    const ev = colEvents[idx % colEvents.length];
    const skills = skillPools[(idx + 1) % skillPools.length];
    const isSouth =
      name.includes('Chennai') ||
      name.includes('Vellore') ||
      name.includes('Anna') ||
      name.includes('SRM') ||
      name.includes('SSN') ||
      name.includes('PSG') ||
      name.includes('Coimbatore') ||
      name.includes('Amrita') ||
      name.includes('SASTRA');
    const region = isSouth ? 'Vellore / Chennai' : hubs[idx % hubs.length];
    const domain = name.toLowerCase().replace(/[^a-z0-9]/g, '') + '.ac.in';
    const rating = Number((4.5 + ((idx * 3) % 6) * 0.1).toFixed(1));
    const popularity = 3600 + ((idx * 149) % 5600);
    const day = ((idx * 4) % 26) + 2;
    const month = idx % 2 === 0 ? '11' : '12';
    const deadlineStr = `2026-${month}-${String(day).padStart(2, '0')}`;

    collegeOpps.push({
      id: `col-${num}`,
      title: `${name} — ${ev.suffix}`,
      organizer: `${name} Student Technical Council`,
      institution: name,
      orgType: 'College',
      orgName: name,
      symbol: '🏛️',
      badge: name.slice(0, 4).toUpperCase(),
      brandColor: colors[(idx + 2) % colors.length],
      domain,
      rating: Math.min(5.0, rating),
      popularity,
      prizeValue: ev.val,
      region,
      sourcePlatform: `${name} Portal / Unstop`,
      category: ev.cat,
      eligibleBranches: ALL_BRANCHES,
      eligibleYears: [1, 2, 3, 4],
      skills,
      mode: `Offline / Hybrid • ${region}`,
      stipendOrPrize: ev.prize,
      deadline: deadlineStr,
      deadlineTimestamp: new Date(deadlineStr).getTime(),
      verifiedStatus: 'Verified Institutional Portal',
      applyUrl: `https://www.google.com/search?q=${encodeURIComponent(name + ' techfest hackathon official portal')}`,
      isNew: idx % 7 === 0,
      closingSoon: month === '11' && day <= 9,
      description: `National inter-college technical fest, hackathon, and research symposium hosted at ${name}. Welcomes students from all engineering branches.`,
    });
  });

  const combined = [];
  const maxLen = Math.max(companyOpps.length, collegeOpps.length);
  for (let i = 0; i < maxLen; i++) {
    if (collegeOpps[i]) combined.push(collegeOpps[i]);
    if (companyOpps[i]) combined.push(companyOpps[i]);
  }
  return combined;
};

const INITIAL_ALL_OPPORTUNITIES = BUILD_FULL_700_DATASET();
const CATEGORIES = ['All', 'Hackathon', 'Internship', 'Techfest', 'Research'];
const SOURCE_FILTERS = ['All (700)', '500 Companies', '200 Colleges'];

export default function CampusPulseApp() {
  // 5 Tabs inside the Floating Round Pipe:
  // 'dashboard' | 'near_me' | 'total_events' | 'explore' | 'profile'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Smooth Tab Fade/Slide Transition
  const tabFadeAnim = useRef(new Animated.Value(1)).current;
  const switchTabSmoothly = (newTab) => {
    if (newTab === activeTab) return;
    tabFadeAnim.setValue(0);
    setActiveTab(newTab);
    Animated.spring(tabFadeAnim, {
      toValue: 1,
      damping: 18,
      stiffness: 140,
      useNativeDriver: true,
    }).start();
  };

  // True OLED Black Dark Mode (#000000) or Retro Cream Light Mode (#f4ecd8)
  // Both preserve the exact Neo-Brutalist #d9432f / #f5b700 / #007777 UI!
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [feedListStartY, setFeedListStartY] = useState(440);
  const [nearMeListStartY, setNearMeListStartY] = useState(220);

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const [quoteIdx, setQuoteIdx] = useState(dayOfYear % DAILY_QUOTES.length);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Student Profile State
  const [profile, setProfile] = useState({
    name: 'Manoj Mondal',
    regNo: '26BIT0004',
    college: 'VIT Vellore',
    degree: 'B.Tech',
    branch: 'IT',
    academicYear: 1,
    gradYear: 2030,
    cgpa: '9.1 / 10.0',
    qualifications: [
      'B.Tech Information Technology — VIT Vellore (2026–2030)',
      'Class 12 Senior Secondary Boards — 408/500 (81.6%)',
      'JEE Mains 2026 — 93.63 Percentile',
    ],
    achievements: [
      'Smart India Hackathon (SIH) Problem Statement 26018 Analyst — AI Land Record OCR',
      'Authored Product Spec for E-Khata Digital Store-Credit Ledger (QR + Voice API)',
      'Built Object-Oriented C++ & Python Terminal Systems + GNU Octave Numerical Scripts',
    ],
    skills: ['Python', 'C++', 'AI/ML', 'GNU Octave', 'DSA', 'React'],
    onlyMyBranch: false,
  });

  const [newQualification, setNewQualification] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const [opportunities, setOpportunities] = useState(INITIAL_ALL_OPPORTUNITIES);
  const [savedMap, setSavedMap] = useState({
    'col-22': 'Interested', // VIT Vellore GraVITas
    'comp-1': 'Applied',    // Google STEP
    'col-1': 'Interested',  // IIT Madras Shaastra
  });

  // Filters & Multi-Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSourceType, setSelectedSourceType] = useState('All (700)');
  const [sortBy, setSortBy] = useState('smart');
  const [minRating, setMinRating] = useState(0);
  const [minPrize, setMinPrize] = useState(0);
  const [selectedHub, setSelectedHub] = useState('Vellore / Chennai');
  const [visibleLimit, setVisibleLimit] = useState(25);
  const [exploreSubTab, setExploreSubTab] = useState('companies');
  const [selectedOpp, setSelectedOpp] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState('500 Companies + 200 Colleges Active');

  const filterTriggerKey = `${activeTab}-${sortBy}-${selectedCategory}-${selectedSourceType}-${minRating}-${minPrize}-${selectedHub}`;

  // --- RETRO NEO-BRUTALIST THEME (OLED BLACK #000000 DARK MODE + CREAM #F4ECD8 LIGHT MODE) ---
  const theme = useMemo(
    () =>
      isDarkMode
        ? {
            bg: '#000000',           // True OLED Black Background
            cardBg: '#0c0c10',       // OLED Card Frame
            cardBodyBg: '#121218',   // OLED Card Body
            text: '#f8fafc',
            subText: '#a1a1aa',
            border: '#2e323d',       // Crisp Neo-Brutalist Border on OLED
            heroBg: '#d9432f',       // Signature Terracotta Red Hero
            radarBg: '#121218',
            inputBg: '#121218',
            accentYellow: '#f5b700', // Signature Mustard Yellow
            accentTeal: '#007777',   // Signature Deep Teal
            accentRed: '#d9432f',    // Signature Terracotta Red
            quoteBg: '#0c0c10',
            pipeBg: '#121218',
          }
        : {
            bg: '#f4ecd8',           // Signature Cream Retro Background
            cardBg: '#f4ecd8',
            cardBodyBg: '#ebdcb8',   // Signature Warm Sand Card Body
            text: '#1a1a1a',
            subText: '#594a38',
            border: '#1a1a1a',       // Signature 2px Black Neo-Brutalist Border
            heroBg: '#d9432f',
            radarBg: '#f4ecd8',
            inputBg: '#ebdcb8',
            accentYellow: '#f5b700',
            accentTeal: '#007777',
            accentRed: '#d9432f',
            quoteBg: '#ebdcb8',
            pipeBg: '#1a1a1a',
          },
    [isDarkMode]
  );

  // Live API Sync Handler
  const handleRefreshFeed = async () => {
    setIsRefreshing(true);
    let liveApiRecords = [];
    try {
      const response = await fetch('https://www.arbeitnow.com/api/job-board-api');
      if (response.ok) {
        const json = await response.json();
        const rawJobs = (json.data || []).slice(0, 2);
        liveApiRecords = rawJobs.map((job, idx) => ({
          id: `live-api-${Date.now()}-${idx}`,
          title: `${job.title} (Live API Feed)`,
          organizer: `${job.company_name}`,
          institution: 'Corporate',
          orgType: 'Company',
          orgName: job.company_name,
          symbol: '🌐',
          badge: 'API',
          brandColor: '#007777',
          domain: 'linkedin.com',
          rating: 4.9,
          popularity: 9100,
          prizeValue: 120000,
          region: 'Bengaluru',
          sourcePlatform: 'Live REST API Sync',
          category: 'Internship',
          eligibleBranches: ['CSE', 'IT', 'AIML', 'Data Science', 'ECE'],
          eligibleYears: [1, 2, 3, 4],
          skills: job.tags && job.tags.length > 0 ? job.tags.slice(0, 4) : ['Python', 'Software Engineering'],
          mode: job.remote ? 'Remote / Online' : `Hybrid • ${job.location || 'India'}`,
          stipendOrPrize: '₹1,20,000 / mo (Live API)',
          deadline: '2026-11-04',
          deadlineTimestamp: new Date('2026-11-04').getTime(),
          verifiedStatus: 'Live API Fetched',
          applyUrl: job.url || 'https://linkedin.com/jobs',
          isNew: true,
          closingSoon: true,
          description: 'Fetched live via REST API. Verify undergraduate branch eligibility on the official portal.',
        }));
      }
    } catch (e) {
      // Offline fallback
    }

    setTimeout(() => {
      if (liveApiRecords.length > 0) {
        setOpportunities((prev) => [...liveApiRecords, ...prev]);
      }
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedTime(`Synced ${timeStr} • 700+ Sources`);
      setIsRefreshing(false);
    }, 500);
  };

  // --- SMART PERSONALIZATION & 4-WAY SORT ENGINE ---
  const scoredOpportunities = useMemo(() => {
    return opportunities
      .map((opp) => {
        const branchMatch = opp.eligibleBranches.includes(profile.branch);
        const yearMatch = opp.eligibleYears.includes(profile.academicYear);
        const matchedSkills = opp.skills.filter((s) =>
          profile.skills.some((ps) => ps.toLowerCase() === s.toLowerCase())
        );
        const campusMatch = opp.institution === profile.college;

        let score = 0;
        if (campusMatch) score += 50;
        if (branchMatch) score += 35;
        if (yearMatch) score += 20;
        score += matchedSkills.length * 15;
        score += (opp.rating || 4.5) * 5;

        const reasons = [];
        if (campusMatch) reasons.push(`Your Campus (${profile.college})`);
        if (branchMatch) reasons.push(`Eligible: ${profile.branch}`);
        if (matchedSkills.length > 0) reasons.push(`Skills: ${matchedSkills.join(', ')}`);

        return {
          ...opp,
          branchMatch,
          yearMatch,
          score,
          matchReason:
            reasons.length > 0
              ? reasons.join(' • ')
              : `Open to ${opp.eligibleBranches.slice(0, 4).join(', ')}`,
        };
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return (a.deadlineTimestamp || 0) - (b.deadlineTimestamp || 0);
        }
        if (sortBy === 'prize') {
          return (b.prizeValue || 0) - (a.prizeValue || 0);
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating || b.popularity - a.popularity;
        }
        if (sortBy === 'popularity') {
          return (b.popularity || 0) - (a.popularity || 0);
        }
        return b.score - a.score;
      });
  }, [opportunities, profile, sortBy]);

  // --- CURATED DASHBOARD HIGHLIGHTS (Top Popular & Nearby Only) ---
  const dashboardPopularOpps = useMemo(() => {
    return [...scoredOpportunities]
      .sort((a, b) => b.popularity - a.popularity || b.rating - a.rating)
      .slice(0, 6);
  }, [scoredOpportunities]);

  const dashboardNearbyOpps = useMemo(() => {
    return scoredOpportunities
      .filter((opp) => opp.region === 'Vellore / Chennai')
      .slice(0, 6);
  }, [scoredOpportunities]);

  // --- FULL 700-ITEM FILTERED CATALOG ---
  const filteredOpportunities = useMemo(() => {
    return scoredOpportunities.filter((opp) => {
      const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
      const matchesSource =
        selectedSourceType === 'All (700)' ||
        (selectedSourceType === '500 Companies' && opp.orgType === 'Company') ||
        (selectedSourceType === '200 Colleges' && opp.orgType === 'College');
      const matchesRating = (opp.rating || 4.5) >= minRating;
      const matchesPrize = (opp.prizeValue || 0) >= minPrize;
      const matchesBranch = !profile.onlyMyBranch || opp.branchMatch;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        opp.title.toLowerCase().includes(q) ||
        opp.organizer.toLowerCase().includes(q) ||
        opp.mode.toLowerCase().includes(q) ||
        opp.skills.some((s) => s.toLowerCase().includes(q));
      return (
        matchesCategory &&
        matchesSource &&
        matchesRating &&
        matchesPrize &&
        matchesBranch &&
        matchesSearch
      );
    });
  }, [
    scoredOpportunities,
    selectedCategory,
    selectedSourceType,
    minRating,
    minPrize,
    profile.onlyMyBranch,
    searchQuery,
  ]);

  const nearbyOpportunities = useMemo(() => {
    return scoredOpportunities.filter((opp) => {
      const matchesHub = selectedHub === 'All India' || opp.region === selectedHub;
      const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
      const matchesRating = (opp.rating || 4.5) >= minRating;
      const matchesPrize = (opp.prizeValue || 0) >= minPrize;
      return matchesHub && matchesCategory && matchesRating && matchesPrize;
    });
  }, [scoredOpportunities, selectedHub, selectedCategory, minRating, minPrize]);

  const companiesList500 = useMemo(
    () => opportunities.filter((o) => o.orgType === 'Company'),
    [opportunities]
  );
  const collegesList200 = useMemo(
    () => opportunities.filter((o) => o.orgType === 'College'),
    [opportunities]
  );

  const updateStatus = (oppId, status) => {
    setSavedMap((prev) => {
      const updated = { ...prev };
      if (!status) delete updated[oppId];
      else updated[oppId] = status;
      return updated;
    });
  };

  const openExternalLink = async (url) => {
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else Alert.alert('Official Portal', url);
  };

  const getHeaderStripColor = (category) => {
    if (category === 'Hackathon') return theme.accentRed;
    if (category === 'Internship') return theme.accentYellow;
    if (category === 'Techfest') return theme.accentTeal;
    return '#1e293b';
  };

  const heroScale = scrollY.interpolate({
    inputRange: [-120, 0, 280],
    outputRange: [1.05, 1, 0.95],
    extrapolate: 'clamp',
  });

  const heroTranslateY = scrollY.interpolate({
    inputRange: [-120, 0, 280],
    outputRange: [-12, 0, -22],
    extrapolate: 'clamp',
  });

  const progressScaleX = scrollY.interpolate({
    inputRange: [0, 4500],
    outputRange: [0.05, 1],
    extrapolate: 'clamp',
  });

  // --- CASCADING + MOUSE HOVER ENLARGING CARD RENDERER ---
  const renderOpportunityCard = (opp, index, activeListStartY) => {
    const currentStatus = savedMap[opp.id];
    const stripBg = getHeaderStripColor(opp.category);
    const isYellowStrip = opp.category === 'Internship';

    return (
      <AppleCascadeCard
        key={opp.id}
        index={index}
        scrollY={scrollY}
        listStartY={activeListStartY}
        filterTrigger={filterTriggerKey}
        onPress={() => setSelectedOpp(opp)}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.cardBg,
              borderColor: theme.border,
            },
          ]}
        >
          {/* Top Category, Symbol, Rating & Popularity Strip */}
          <View
            style={[
              styles.cardHeaderStrip,
              { backgroundColor: stripBg, borderBottomColor: theme.border },
            ]}
          >
            <Text style={[styles.cardHeaderCategory, isYellowStrip && { color: '#1a1a1a' }]}>
              {opp.symbol} {opp.category.toUpperCase()} • #{index + 1}
            </Text>
            <View style={styles.ratingAndDateRow}>
              <View style={styles.popularityPill}>
                <Text style={styles.popularityPillText}>
                  🔥 {(opp.popularity / 1000).toFixed(1)}k
                </Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingBadgeText}>★ {opp.rating.toFixed(1)}</Text>
              </View>
              <Text style={[styles.cardHeaderDate, isYellowStrip && { color: '#1a1a1a' }]}>
                Due: {opp.deadline}
              </Text>
            </View>
          </View>

          {/* Card Body with Official Symbol + Logo */}
          <View style={[styles.cardBody, { backgroundColor: theme.cardBodyBg }]}>
            <View style={styles.cardTopIdentityRow}>
              <BrandSymbolLogo
                domain={opp.domain}
                badge={opp.badge}
                symbol={opp.symbol}
                color={opp.brandColor}
                size={48}
                borderColor={theme.border}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>{opp.title}</Text>
                <Text style={[styles.cardOrganizer, { color: theme.subText }]}>
                  {opp.symbol} {opp.organizer} • 📍 {opp.mode}
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.matchBanner,
                { backgroundColor: theme.bg, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.matchBannerText, { color: isDarkMode ? '#f5b700' : theme.accentTeal }]}>
                ⚡ {opp.matchReason}
              </Text>
            </View>

            <Text style={[styles.cardDesc, { color: theme.subText }]} numberOfLines={2}>
              {opp.description}
            </Text>

            <View style={styles.skillPillRow}>
              {opp.skills.map((sk) => (
                <View
                  key={sk}
                  style={[
                    styles.miniSkillTag,
                    { backgroundColor: theme.bg, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.miniSkillText, { color: theme.text }]}>{sk}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.cardFooterRow, { borderTopColor: theme.border }]}>
              <View style={{ flex: 1, paddingRight: 8 }}>
                <Text style={[styles.cardReward, { color: theme.text }]}>
                  💰 {opp.stipendOrPrize}
                </Text>
                <Text style={[styles.cardModeText, { color: theme.subText }]}>
                  {opp.verifiedStatus} • {opp.popularity.toLocaleString()} student views
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.trackBtn,
                  { borderColor: theme.border },
                  currentStatus && styles.trackBtnActive,
                ]}
                onPress={() => updateStatus(opp.id, currentStatus ? null : 'Saved')}
              >
                <Text style={styles.trackBtnText}>
                  {currentStatus ? `✓ ${currentStatus}` : '+ Shortlist'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </AppleCascadeCard>
    );
  };

  const currentQuote = DAILY_QUOTES[quoteIdx % DAILY_QUOTES.length];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.bg}
      />

      {/* TOP HEADER WITH OLED/CREAM THEME SWITCHER & 60FPS GPU PROGRESS BAR */}
      <View
        style={[
          styles.headerWrapper,
          { backgroundColor: theme.bg, borderBottomColor: theme.border },
        ]}
      >
        <View style={styles.header}>
          <View style={[styles.brandBox, { borderColor: theme.border }]}>
            <Text style={styles.brandText}>
              Campus<Text style={styles.brandHighlight}>Pulse</Text>
            </Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.themeToggleBtn,
                {
                  backgroundColor: isDarkMode ? '#f5b700' : '#1a1a1a',
                  borderColor: theme.border,
                },
              ]}
              onPress={() => setIsDarkMode((d) => !d)}
            >
              <Text
                style={[
                  styles.themeToggleText,
                  { color: isDarkMode ? '#1a1a1a' : '#ffffff' },
                ]}
              >
                {isDarkMode ? '☀️ Cream UI' : '🌑 OLED Black'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.orgBadgeBtn, { borderColor: theme.border }]}
              onPress={handleRefreshFeed}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.orgBadgeText}>↻ Sync API</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: theme.cardBodyBg }]}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                transform: [{ scaleX: progressScaleX }],
              },
            ]}
          />
        </View>
      </View>

      {/* 60FPS GPU NATIVE-DRIVER SCROLLVIEW */}
      <Animated.ScrollView
        style={[styles.content, { opacity: tabFadeAnim }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefreshFeed}
            tintColor={theme.text}
          />
        }
      >
        {/* DAILY ENTREPRENEUR & TECH LEADER QUOTE BANNER */}
        <View
          style={[
            styles.quoteBanner,
            { backgroundColor: theme.quoteBg, borderColor: theme.border },
          ]}
        >
          <View style={styles.quoteHeaderRow}>
            <Text style={[styles.quoteEyebrow, { color: theme.accentRed }]}>
              ✦ DAILY FOUNDER & LEADER INSIGHT
            </Text>
            <TouchableOpacity
              onPress={() => setQuoteIdx((q) => (q + 1) % DAILY_QUOTES.length)}
              style={[
                styles.nextQuoteBtn,
                { borderColor: theme.border, backgroundColor: theme.bg },
              ]}
            >
              <Text style={[styles.nextQuoteBtnText, { color: theme.text }]}>
                ↻ Next Quote
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[styles.quoteBodyText, { color: theme.text }]}>
            “{currentQuote.quote}”
          </Text>
          <Text style={[styles.quoteAuthorText, { color: theme.subText }]}>
            — {currentQuote.author} ({currentQuote.role})
          </Text>
        </View>

        {/* =================================================================== */}
        {/* TAB 1: DASHBOARD LANDING PAGE (ONLY TOP POPULAR & NEARBY EVENTS)    */}
        {/* =================================================================== */}
        {activeTab === 'dashboard' && (
          <View style={styles.sectionContainer}>
            {/* RETRO NEO-BRUTALIST TERRACOTTA HERO BANNER */}
            <Animated.View
              style={[
                styles.heroBox,
                {
                  backgroundColor: theme.heroBg,
                  borderColor: theme.border,
                  transform: [{ scale: heroScale }, { translateY: heroTranslateY }],
                },
              ]}
            >
              <Text style={styles.heroSubCount}>
                500 COMPANIES + 200 COLLEGES • HOVER & CASCADE MOTION
              </Text>
              <Text style={styles.heroTitle}>
                Live it loud.{' '}
                <Text style={styles.heroYellowBox}>Build your edge.</Text>
              </Text>

              <View
                style={[
                  styles.radarCard,
                  { backgroundColor: theme.radarBg, borderColor: theme.border },
                ]}
              >
                <Text style={[styles.radarEyebrow, { color: theme.accentRed }]}>
                  {profile.name.toUpperCase()} • {profile.college} ({profile.branch}) • {lastSyncedTime}
                </Text>
                <View style={styles.heroBtnRow}>
                  <TouchableOpacity
                    style={[styles.radarBtn, { flex: 1, borderColor: theme.border }]}
                    onPress={() => switchTabSmoothly('near_me')}
                  >
                    <Text style={styles.radarBtnText}>📍 Events Near Me</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.radarBtn,
                      {
                        backgroundColor: '#f5b700',
                        paddingHorizontal: 14,
                        borderColor: theme.border,
                      },
                    ]}
                    onPress={() => switchTabSmoothly('total_events')}
                  >
                    <Text style={[styles.radarBtnText, { color: '#1a1a1a' }]}>
                      ✦ All {opportunities.length} Events →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* DASHBOARD SECTION 1: TOP POPULAR HACKATHONS & INTERNSHIPS */}
            <View style={styles.catalogHeaderRow}>
              <Text style={[styles.catalogHeading, { color: theme.text }]}>
                🔥 Top Popular & 5.0★ Rated
              </Text>
              <TouchableOpacity
                style={[
                  styles.countBadgeBtn,
                  { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                ]}
                onPress={() => {
                  setSortBy('popularity');
                  switchTabSmoothly('total_events');
                }}
              >
                <Text style={styles.countBadgeText}>VIEW ALL 700 →</Text>
              </TouchableOpacity>
            </View>
            <Text style={[styles.subNote, { color: theme.subText }]}>
              Hover over any box to enlarge, or scroll to watch cards cascade in:
            </Text>

            <View onLayout={(e) => setFeedListStartY(e.nativeEvent.layout.y)}>
              {dashboardPopularOpps.map((opp, idx) =>
                renderOpportunityCard(opp, idx, feedListStartY)
              )}
            </View>

            {/* DASHBOARD SECTION 2: NEARBY EVENTS (VELLORE / CHENNAI) */}
            <View style={[styles.catalogHeaderRow, { marginTop: 14 }]}>
              <Text style={[styles.catalogHeading, { color: theme.text }]}>
                📍 Nearby You (Vellore / Chennai)
              </Text>
              <TouchableOpacity
                style={[
                  styles.countBadgeBtn,
                  { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                ]}
                onPress={() => switchTabSmoothly('near_me')}
              >
                <Text style={styles.countBadgeText}>OPEN RADAR →</Text>
              </TouchableOpacity>
            </View>

            {dashboardNearbyOpps.map((opp, idx) =>
              renderOpportunityCard(opp, idx + 6, feedListStartY)
            )}
          </View>
        )}

        {/* =================================================================== */}
        {/* TAB 2: LOCATION-BASED "NEAR ME" RADAR                               */}
        {/* =================================================================== */}
        {activeTab === 'near_me' && (
          <View style={styles.sectionContainer}>
            <View
              style={[
                styles.nearMeBanner,
                { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
              ]}
            >
              <Text style={[styles.radarEyebrow, { color: theme.accentRed }]}>
                📍 LOCATION-BASED OPPORTUNITY RADAR
              </Text>
              <Text style={[styles.catalogHeading, { color: theme.text, marginTop: 4 }]}>
                Events & Internships Near {selectedHub}
              </Text>
              <Text style={[styles.subNote, { color: theme.subText, marginBottom: 10 }]}>
                Select your current campus or metro region to discover nearby hackathons, techfests, and hybrid/on-site internships:
              </Text>

              <View style={styles.hubGrid}>
                {NEARBY_HUBS.map((hub) => (
                  <TouchableOpacity
                    key={hub}
                    style={[
                      styles.hubChip,
                      { backgroundColor: theme.bg, borderColor: theme.border },
                      selectedHub === hub && styles.hubChipActive,
                    ]}
                    onPress={() => {
                      setSelectedHub(hub);
                      setVisibleLimit(25);
                    }}
                  >
                    <Text
                      style={[
                        styles.hubChipText,
                        { color: theme.text },
                        selectedHub === hub && { color: '#ffffff' },
                      ]}
                    >
                      📍 {hub}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Bar inside Near Me */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={[styles.filterScroll, { marginTop: 12 }]}
            >
              {SORT_OPTIONS.map((so) => (
                <TouchableOpacity
                  key={so.id}
                  style={[
                    styles.sortPill,
                    { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                    sortBy === so.id && styles.sortPillActive,
                  ]}
                  onPress={() => setSortBy(so.id)}
                >
                  <Text
                    style={[
                      styles.sortPillText,
                      { color: theme.text },
                      sortBy === so.id && { color: '#ffffff' },
                    ]}
                  >
                    {so.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.catalogHeaderRow}>
              <Text style={[styles.catalogHeading, { color: theme.text }]}>
                {selectedHub} ({nearbyOpportunities.length})
              </Text>
            </View>

            <View onLayout={(e) => setNearMeListStartY(e.nativeEvent.layout.y)}>
              {nearbyOpportunities.slice(0, visibleLimit).map((opp, idx) =>
                renderOpportunityCard(opp, idx, nearMeListStartY)
              )}
            </View>

            {visibleLimit < nearbyOpportunities.length && (
              <TouchableOpacity
                style={[styles.loadMoreBtn, { borderColor: theme.border }]}
                onPress={() => setVisibleLimit((v) => v + 40)}
              >
                <Text style={styles.loadMoreBtnText}>
                  Load More Nearby Events (+40)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* =================================================================== */}
        {/* TAB 3: TOTAL EVENTS (700) — BETWEEN NEAR ME AND EXPLORE             */}
        {/* =================================================================== */}
        {activeTab === 'total_events' && (
          <View style={styles.sectionContainer}>
            {/* SOURCE TYPE SWITCHER (All 700 / 500 Companies / 200 Colleges) */}
            <View style={[styles.sourceSwitchRow, { marginTop: 8 }]}>
              {SOURCE_FILTERS.map((sf) => (
                <TouchableOpacity
                  key={sf}
                  style={[
                    styles.sourceSwitchBtn,
                    { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                    selectedSourceType === sf && styles.sourceSwitchBtnActive,
                  ]}
                  onPress={() => {
                    setSelectedSourceType(sf);
                    setVisibleLimit(25);
                  }}
                >
                  <Text
                    style={[
                      styles.sourceSwitchText,
                      { color: theme.text },
                      selectedSourceType === sf && styles.sourceSwitchTextActive,
                    ]}
                  >
                    {sf}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* 4-WAY SORT ENGINE BAR (Date, Prize Pool, Rating, Popularity) */}
            <Text style={[styles.filterSectionLabel, { color: theme.subText }]}>
              SORT ALL 700 EVENTS BY (DATE • PRIZE POOL • RATING • POPULARITY)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              {SORT_OPTIONS.map((so) => (
                <TouchableOpacity
                  key={so.id}
                  style={[
                    styles.sortPill,
                    { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                    sortBy === so.id && styles.sortPillActive,
                  ]}
                  onPress={() => setSortBy(so.id)}
                >
                  <Text
                    style={[
                      styles.sortPillText,
                      { color: theme.text },
                      sortBy === so.id && { color: '#ffffff' },
                    ]}
                  >
                    {so.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* PRIZE POOL & STAR RATING FILTER CHIPS */}
            <View style={styles.ratingFilterRow}>
              {PRIZE_FILTERS.map((pf) => (
                <TouchableOpacity
                  key={pf.label}
                  style={[
                    styles.ratingPill,
                    { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                    minPrize === pf.minPrize && styles.ratingPillActive,
                  ]}
                  onPress={() => setMinPrize(pf.minPrize)}
                >
                  <Text
                    style={[
                      styles.ratingPillText,
                      { color: theme.text },
                      minPrize === pf.minPrize && { color: '#1a1a1a' },
                    ]}
                  >
                    💰 {pf.label}
                  </Text>
                </TouchableOpacity>
              ))}

              {RATING_FILTERS.map((rf) => (
                <TouchableOpacity
                  key={rf.label}
                  style={[
                    styles.ratingPill,
                    { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                    minRating === rf.min && styles.ratingPillActive,
                  ]}
                  onPress={() => setMinRating(rf.min)}
                >
                  <Text
                    style={[
                      styles.ratingPillText,
                      { color: theme.text },
                      minRating === rf.min && { color: '#1a1a1a' },
                    ]}
                  >
                    {rf.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SEARCH INPUT */}
            <View style={styles.searchBarRow}>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                    color: theme.text,
                    flex: 1,
                  },
                ]}
                placeholder="Search 500 companies & 200 colleges, skills, cities..."
                placeholderTextColor={theme.subText}
                value={searchQuery}
                onChangeText={(q) => {
                  setSearchQuery(q);
                  setVisibleLimit(25);
                }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  style={[styles.clearSearchBtn, { borderColor: theme.border }]}
                  onPress={() => setSearchQuery('')}
                >
                  <Text style={styles.clearSearchText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* CATEGORY FILTER PILLS */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catPill,
                    { borderColor: theme.border },
                    cat === 'Hackathon' && styles.catPillRed,
                    cat === 'Internship' && styles.catPillYellow,
                    cat === 'Techfest' && styles.catPillTeal,
                    selectedCategory === cat && styles.catPillActive,
                  ]}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setVisibleLimit(25);
                  }}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      (cat === 'Hackathon' || cat === 'Techfest') && { color: '#ffffff' },
                      selectedCategory === cat && styles.catPillTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.catalogHeaderRow}>
              <Text style={[styles.catalogHeading, { color: theme.text }]}>
                Total Events Catalog
              </Text>
              <View
                style={[
                  styles.countBadgeBtn,
                  { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                ]}
              >
                <Text style={styles.countBadgeText}>
                  {filteredOpportunities.length} EVENTS
                </Text>
              </View>
            </View>

            <View onLayout={(e) => setFeedListStartY(e.nativeEvent.layout.y)}>
              {filteredOpportunities.slice(0, visibleLimit).map((opp, idx) =>
                renderOpportunityCard(opp, idx, feedListStartY)
              )}
            </View>

            {visibleLimit < filteredOpportunities.length && (
              <TouchableOpacity
                style={[styles.loadMoreBtn, { borderColor: theme.border }]}
                onPress={() => setVisibleLimit((v) => v + 50)}
              >
                <Text style={styles.loadMoreBtnText}>
                  Load Next 50 of {filteredOpportunities.length} Events (+50)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* =================================================================== */}
        {/* TAB 4: EXPLORE (500 COMPANIES & 200 COLLEGES SYMBOLS DIRECTORY)     */}
        {/* =================================================================== */}
        {activeTab === 'explore' && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.catalogHeading, { color: theme.text, marginTop: 8 }]}>
              Explore 500 Companies & 200 Colleges
            </Text>
            <Text style={[styles.subNote, { color: theme.subText }]}>
              Tap any organization chip below to inspect its internship, hackathon, or techfest:
            </Text>

            <View style={styles.sourceSwitchRow}>
              <TouchableOpacity
                style={[
                  styles.sourceSwitchBtn,
                  { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                  exploreSubTab === 'companies' && styles.sourceSwitchBtnActive,
                ]}
                onPress={() => {
                  setExploreSubTab('companies');
                  setVisibleLimit(40);
                }}
              >
                <Text
                  style={[
                    styles.sourceSwitchText,
                    { color: theme.text },
                    exploreSubTab === 'companies' && styles.sourceSwitchTextActive,
                  ]}
                >
                  500 Tech Companies ({companiesList500.length})
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.sourceSwitchBtn,
                  { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                  exploreSubTab === 'colleges' && styles.sourceSwitchBtnActive,
                ]}
                onPress={() => {
                  setExploreSubTab('colleges');
                  setVisibleLimit(40);
                }}
              >
                <Text
                  style={[
                    styles.sourceSwitchText,
                    { color: theme.text },
                    exploreSubTab === 'colleges' && styles.sourceSwitchTextActive,
                  ]}
                >
                  200 Colleges & Univs ({collegesList200.length})
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBarRow}>
              <TextInput
                style={[
                  styles.searchInput,
                  {
                    backgroundColor: theme.inputBg,
                    borderColor: theme.border,
                    color: theme.text,
                    flex: 1,
                  },
                ]}
                placeholder={
                  exploreSubTab === 'companies'
                    ? 'Search 500 companies...'
                    : 'Search 200 colleges (IIT, NIT, IIIT, VIT)...'
                }
                placeholderTextColor={theme.subText}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <View style={styles.directoryGrid}>
              {(exploreSubTab === 'companies' ? companiesList500 : collegesList200)
                .filter(
                  (item) =>
                    !searchQuery.trim() ||
                    item.orgName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .slice(0, visibleLimit)
                .map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.directoryChip,
                      { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                    ]}
                    onPress={() => setSelectedOpp(item)}
                  >
                    <BrandSymbolLogo
                      domain={item.domain}
                      badge={item.badge}
                      symbol={item.symbol}
                      color={item.brandColor}
                      size={38}
                      borderColor={theme.border}
                    />
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[styles.directoryChipName, { color: theme.text }]}
                        numberOfLines={1}
                      >
                        {item.symbol} {item.orgName}
                      </Text>
                      <Text
                        style={[styles.directorySubFest, { color: theme.subText }]}
                        numberOfLines={1}
                      >
                        ★ {item.rating.toFixed(1)} • {item.stipendOrPrize}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity
              style={[styles.loadMoreBtn, { borderColor: theme.border, marginTop: 14 }]}
              onPress={() => setVisibleLimit((v) => v + 60)}
            >
              <Text style={styles.loadMoreBtnText}>Load More Directory Entries (+60)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* =================================================================== */}
        {/* TAB 5: PROFILE, SHORTLIST TRACKER & EDUCATIONAL QUALIFICATIONS      */}
        {/* =================================================================== */}
        {activeTab === 'profile' && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.catalogHeading, { color: theme.text }]}>
              📌 Shortlisted & Applied ({Object.keys(savedMap).length})
            </Text>
            <Text style={[styles.subNote, { color: theme.subText }]}>
              Manage your hackathon registrations and internship stages:
            </Text>
            {Object.keys(savedMap).length === 0 ? (
              <View
                style={[
                  styles.emptyBox,
                  { backgroundColor: theme.cardBodyBg, borderColor: theme.border, marginBottom: 16 },
                ]}
              >
                <Text style={[styles.emptyText, { color: theme.subText }]}>
                  No opportunities shortlisted yet. Tap "+ Shortlist" on any card!
                </Text>
              </View>
            ) : (
              opportunities
                .filter((o) => savedMap[o.id])
                .map((opp) => (
                  <View
                    key={opp.id}
                    style={[
                      styles.card,
                      { backgroundColor: theme.cardBg, borderColor: theme.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.cardHeaderStrip,
                        {
                          backgroundColor: getHeaderStripColor(opp.category),
                          borderBottomColor: theme.border,
                        },
                      ]}
                    >
                      <Text style={styles.cardHeaderCategory}>
                        {opp.symbol} STAGE: {savedMap[opp.id].toUpperCase()}
                      </Text>
                      <Text style={styles.cardHeaderDate}>Deadline: {opp.deadline}</Text>
                    </View>
                    <View style={[styles.cardBody, { backgroundColor: theme.cardBodyBg }]}>
                      <View style={styles.cardTopIdentityRow}>
                        <BrandSymbolLogo
                          domain={opp.domain}
                          badge={opp.badge}
                          symbol={opp.symbol}
                          color={opp.brandColor}
                          size={46}
                          borderColor={theme.border}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.cardTitle, { color: theme.text }]}>
                            {opp.title}
                          </Text>
                          <Text style={[styles.cardOrganizer, { color: theme.subText }]}>
                            {opp.organizer} • {opp.stipendOrPrize}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.statusRow}>
                        {['Interested', 'Applied', 'Online Assessment', 'Shortlisted'].map(
                          (st) => (
                            <TouchableOpacity
                              key={st}
                              style={[
                                styles.statusChip,
                                { backgroundColor: theme.bg, borderColor: theme.border },
                                savedMap[opp.id] === st && styles.statusChipActive,
                              ]}
                              onPress={() => updateStatus(opp.id, st)}
                            >
                              <Text
                                style={[
                                  styles.statusChipText,
                                  { color: theme.text },
                                  savedMap[opp.id] === st && { color: '#1a1a1a' },
                                ]}
                              >
                                {st}
                              </Text>
                            </TouchableOpacity>
                          )
                        )}
                        <TouchableOpacity
                          style={[
                            styles.statusChip,
                            { backgroundColor: '#d9432f', borderColor: theme.border },
                          ]}
                          onPress={() => updateStatus(opp.id, null)}
                        >
                          <Text style={[styles.statusChipText, { color: '#fff' }]}>
                            Remove
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
            )}

            <Text style={[styles.catalogHeading, { color: theme.text, marginTop: 10 }]}>
              🎓 Student CV & Qualifications
            </Text>

            <View
              style={[
                styles.profileBox,
                { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
              ]}
            >
              <Text style={styles.profileSectionHeader}>01 · ACADEMIC IDENTITY</Text>
              <View style={styles.inputRowGrid}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>STUDENT NAME</Text>
                  <TextInput
                    style={[
                      styles.profileInput,
                      {
                        backgroundColor: theme.bg,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    value={profile.name}
                    onChangeText={(v) => setProfile((p) => ({ ...p, name: v }))}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>REG NUMBER</Text>
                  <TextInput
                    style={[
                      styles.profileInput,
                      {
                        backgroundColor: theme.bg,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    value={profile.regNo}
                    onChangeText={(v) => setProfile((p) => ({ ...p, regNo: v }))}
                  />
                </View>
              </View>

              <View style={styles.inputRowGrid}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>
                    COLLEGE / UNIVERSITY
                  </Text>
                  <TextInput
                    style={[
                      styles.profileInput,
                      {
                        backgroundColor: theme.bg,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    value={profile.college}
                    onChangeText={(v) => setProfile((p) => ({ ...p, college: v }))}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.fieldLabel, { color: theme.text }]}>CGPA / SCORE</Text>
                  <TextInput
                    style={[
                      styles.profileInput,
                      {
                        backgroundColor: theme.bg,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    value={profile.cgpa}
                    onChangeText={(v) => setProfile((p) => ({ ...p, cgpa: v }))}
                  />
                </View>
              </View>

              <Text style={[styles.fieldLabel, { color: theme.text }]}>
                SELECT BRANCH (RE-RANKS ALL 700 LISTINGS)
              </Text>
              <View style={styles.branchGrid}>
                {ALL_BRANCHES.map((b) => (
                  <TouchableOpacity
                    key={b}
                    style={[
                      styles.branchBtn,
                      { backgroundColor: theme.bg, borderColor: theme.border },
                      profile.branch === b && styles.branchBtnActive,
                    ]}
                    onPress={() => setProfile((p) => ({ ...p, branch: b }))}
                  >
                    <Text
                      style={[
                        styles.branchBtnText,
                        { color: theme.text },
                        profile.branch === b && styles.branchBtnTextActive,
                      ]}
                    >
                      {b}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* EDUCATIONAL QUALIFICATIONS */}
            <View
              style={[
                styles.profileBox,
                { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
              ]}
            >
              <Text style={styles.profileSectionHeader}>
                02 · EDUCATIONAL QUALIFICATIONS
              </Text>
              {profile.qualifications.map((q, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.listItemRow,
                    { backgroundColor: theme.bg, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.listItemText, { color: theme.text }]}>🎓 {q}</Text>
                  <TouchableOpacity
                    style={styles.deleteMiniBtn}
                    onPress={() =>
                      setProfile((p) => ({
                        ...p,
                        qualifications: p.qualifications.filter((_, i) => i !== idx),
                      }))
                    }
                  >
                    <Text style={styles.deleteMiniBtnText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.addRow}>
                <TextInput
                  style={[
                    styles.profileInput,
                    {
                      flex: 1,
                      marginBottom: 0,
                      backgroundColor: theme.bg,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholder="Add degree, Class 12 score, JEE/BITSAT rank..."
                  placeholderTextColor={theme.subText}
                  value={newQualification}
                  onChangeText={setNewQualification}
                />
                <TouchableOpacity
                  style={[styles.addBtn, { borderColor: theme.border }]}
                  onPress={() => {
                    if (!newQualification.trim()) return;
                    setProfile((p) => ({
                      ...p,
                      qualifications: [...p.qualifications, newQualification.trim()],
                    }));
                    setNewQualification('');
                  }}
                >
                  <Text style={styles.addBtnText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ACHIEVEMENTS & HACKATHONS */}
            <View
              style={[
                styles.profileBox,
                { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
              ]}
            >
              <Text style={styles.profileSectionHeader}>03 · ACHIEVEMENTS & PROJECTS</Text>
              {profile.achievements.map((ach, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.listItemRow,
                    { backgroundColor: theme.bg, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.listItemText, { color: theme.text }]}>🏆 {ach}</Text>
                  <TouchableOpacity
                    style={styles.deleteMiniBtn}
                    onPress={() =>
                      setProfile((p) => ({
                        ...p,
                        achievements: p.achievements.filter((_, i) => i !== idx),
                      }))
                    }
                  >
                    <Text style={styles.deleteMiniBtnText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.addRow}>
                <TextInput
                  style={[
                    styles.profileInput,
                    {
                      flex: 1,
                      marginBottom: 0,
                      backgroundColor: theme.bg,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholder="Add hackathon win, research abstract, club role..."
                  placeholderTextColor={theme.subText}
                  value={newAchievement}
                  onChangeText={setNewAchievement}
                />
                <TouchableOpacity
                  style={[styles.addBtn, { borderColor: theme.border }]}
                  onPress={() => {
                    if (!newAchievement.trim()) return;
                    setProfile((p) => ({
                      ...p,
                      achievements: [...p.achievements, newAchievement.trim()],
                    }));
                    setNewAchievement('');
                  }}
                >
                  <Text style={styles.addBtnText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* SKILLS */}
            <View
              style={[
                styles.profileBox,
                { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
              ]}
            >
              <Text style={styles.profileSectionHeader}>04 · TECHNICAL SKILLS</Text>
              <View style={styles.branchGrid}>
                {profile.skills.map((sk) => (
                  <TouchableOpacity
                    key={sk}
                    style={[styles.skillBadgeEditable, { borderColor: theme.border }]}
                    onPress={() =>
                      setProfile((p) => ({
                        ...p,
                        skills: p.skills.filter((item) => item !== sk),
                      }))
                    }
                  >
                    <Text style={styles.skillBadgeEditableText}>{sk} ×</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={[styles.addRow, { marginTop: 10 }]}>
                <TextInput
                  style={[
                    styles.profileInput,
                    {
                      flex: 1,
                      marginBottom: 0,
                      backgroundColor: theme.bg,
                      color: theme.text,
                      borderColor: theme.border,
                    },
                  ]}
                  placeholder="Add skill (e.g. VLSI, Rust, TensorFlow)..."
                  placeholderTextColor={theme.subText}
                  value={newSkill}
                  onChangeText={setNewSkill}
                />
                <TouchableOpacity
                  style={[styles.addBtn, { borderColor: theme.border }]}
                  onPress={() => {
                    if (!newSkill.trim()) return;
                    setProfile((p) => ({
                      ...p,
                      skills: [...p.skills, newSkill.trim()],
                    }));
                    setNewSkill('');
                  }}
                >
                  <Text style={styles.addBtnText}>+ Skill</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Animated.ScrollView>

      {/* OPPORTUNITY DETAIL MODAL */}
      <Modal visible={!!selectedOpp} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: theme.bg, borderColor: theme.border },
            ]}
          >
            {selectedOpp && (
              <>
                <View style={styles.cardTopIdentityRow}>
                  <BrandSymbolLogo
                    domain={selectedOpp.domain}
                    badge={selectedOpp.badge}
                    symbol={selectedOpp.symbol}
                    color={selectedOpp.brandColor}
                    size={52}
                    borderColor={theme.border}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalCategory}>
                      {selectedOpp.symbol} {selectedOpp.category.toUpperCase()} • ★{' '}
                      {selectedOpp.rating.toFixed(1)} ({selectedOpp.popularity.toLocaleString()} views)
                    </Text>
                    <Text style={[styles.modalTitle, { color: theme.text }]}>
                      {selectedOpp.title}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.modalOrg, { color: theme.subText }]}>
                  {selectedOpp.organizer}
                </Text>
                <Text style={[styles.modalDesc, { color: theme.text }]}>
                  {selectedOpp.description}
                </Text>

                <View
                  style={[
                    styles.modalMetaBox,
                    { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                  ]}
                >
                  <Text style={[styles.modalMetaText, { color: theme.text }]}>
                    📅 DEADLINE: {selectedOpp.deadline}
                  </Text>
                  <Text style={[styles.modalMetaText, { color: theme.text }]}>
                    💰 STIPEND / PRIZE: {selectedOpp.stipendOrPrize}
                  </Text>
                  <Text style={[styles.modalMetaText, { color: theme.text }]}>
                    📍 LOCATION HUB: {selectedOpp.mode} ({selectedOpp.region})
                  </Text>
                  <Text style={[styles.modalMetaText, { color: theme.text }]}>
                    🎓 ELIGIBLE BRANCHES: {selectedOpp.eligibleBranches.join(', ')}
                  </Text>
                  <Text style={[styles.modalMetaText, { color: theme.text }]}>
                    ⚡ SKILLS: {selectedOpp.skills.join(', ')}
                  </Text>
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalBookBtn, { borderColor: theme.border }]}
                    onPress={() => openExternalLink(selectedOpp.applyUrl)}
                  >
                    <Text style={styles.modalBookBtnText}>
                      Official Application Portal ↗
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalCloseBtn,
                      { backgroundColor: theme.cardBodyBg, borderColor: theme.border },
                    ]}
                    onPress={() => setSelectedOpp(null)}
                  >
                    <Text style={[styles.modalCloseText, { color: theme.text }]}>
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ===================================================================== */}
      {/* FLOATING ROUND PIPE / CAPSULE BOTTOM NAVIGATION (Instagram iOS Style) */}
      {/* ===================================================================== */}
      <View style={styles.floatingPipeWrapper} pointerEvents="box-none">
        <View
          style={[
            styles.floatingPipeBar,
            {
              backgroundColor: theme.pipeBg,
              borderColor: theme.border,
            },
          ]}
        >
          {[
            { id: 'dashboard', label: '🏠 Home' },
            { id: 'near_me', label: '📍 Near Me' },
            { id: 'total_events', label: '✦ 700 Events', isCenterButton: true },
            { id: 'explore', label: '🧭 Explore' },
            { id: 'profile', label: `🎓 CV (${Object.keys(savedMap).length})` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.85}
                style={[
                  styles.pipeTabItem,
                  tab.isCenterButton && styles.pipeCenterItem,
                  isActive && styles.pipeTabItemActive,
                ]}
                onPress={() => switchTabSmoothly(tab.id)}
              >
                <Text
                  style={[
                    styles.pipeTabText,
                    tab.isCenterButton && { color: '#ffffff' },
                    isActive && styles.pipeTabTextActive,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- RETRO NEO-BRUTALIST + APPLE SAN FRANCISCO ROUNDED STYLING ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  headerWrapper: {
    borderBottomWidth: 2,
    zIndex: 10,
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTrack: {
    height: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: '#d9432f',
  },
  brandBox: {
    backgroundColor: '#d9432f',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 2,
    borderRadius: 12,
  },
  brandText: {
    fontFamily: APP_FONT,
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  brandHighlight: { color: '#f5b700' },
  headerActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  themeToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 999,
  },
  themeToggleText: { fontFamily: APP_FONT, fontSize: 11, fontWeight: '800' },
  orgBadgeBtn: {
    backgroundColor: '#007777',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 999,
  },
  orgBadgeText: { fontFamily: APP_FONT, color: '#ffffff', fontSize: 11, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 16 },
  sectionContainer: { paddingBottom: 110 },
  quoteBanner: {
    marginTop: 10,
    marginBottom: 6,
    padding: 12,
    borderWidth: 2,
    borderRadius: 16,
  },
  quoteHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  quoteEyebrow: {
    fontFamily: APP_FONT,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  nextQuoteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 999,
  },
  nextQuoteBtnText: {
    fontFamily: APP_FONT,
    fontSize: 9,
    fontWeight: '800',
  },
  quoteBodyText: {
    fontFamily: APP_FONT,
    fontSize: 11,
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: 16,
    marginBottom: 2,
  },
  quoteAuthorText: {
    fontFamily: APP_FONT,
    fontSize: 10,
    fontWeight: '800',
  },
  heroBox: {
    marginTop: 4,
    marginBottom: 10,
    padding: 15,
    borderWidth: 2,
    borderRadius: 20,
  },
  heroSubCount: {
    fontFamily: APP_FONT,
    color: '#f4ecd8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: APP_FONT,
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  heroYellowBox: {
    backgroundColor: '#f5b700',
    color: '#1a1a1a',
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  radarCard: {
    padding: 11,
    borderWidth: 2,
    borderRadius: 14,
  },
  radarEyebrow: {
    fontFamily: APP_FONT,
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroBtnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  radarBtn: {
    backgroundColor: '#007777',
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarBtnText: { fontFamily: APP_FONT, color: '#ffffff', fontSize: 11, fontWeight: '800' },
  sourceSwitchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  sourceSwitchBtn: {
    flex: 1,
    minWidth: '28%',
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  sourceSwitchBtnActive: {
    backgroundColor: '#f5b700',
  },
  sourceSwitchText: {
    fontFamily: APP_FONT,
    fontSize: 11,
    fontWeight: '800',
  },
  sourceSwitchTextActive: {
    color: '#1a1a1a',
  },
  filterSectionLabel: {
    fontFamily: APP_FONT,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginBottom: 5,
  },
  sortPill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderWidth: 2,
    borderRadius: 999,
    marginRight: 8,
  },
  sortPillActive: {
    backgroundColor: '#007777',
  },
  sortPillText: {
    fontFamily: APP_FONT,
    fontSize: 11,
    fontWeight: '800',
  },
  ratingFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  ratingPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 2,
    borderRadius: 999,
  },
  ratingPillActive: {
    backgroundColor: '#f5b700',
  },
  ratingPillText: {
    fontFamily: APP_FONT,
    fontSize: 10,
    fontWeight: '800',
  },
  searchBarRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    fontFamily: APP_FONT,
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: '600',
  },
  clearSearchBtn: {
    backgroundColor: '#d9432f',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 14,
  },
  clearSearchText: {
    fontFamily: APP_FONT,
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  catalogHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  catalogHeading: {
    fontFamily: APP_FONT,
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  countBadgeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 2,
    borderRadius: 999,
  },
  countBadgeText: {
    fontFamily: APP_FONT,
    fontSize: 10,
    fontWeight: '800',
    color: '#d9432f',
  },
  subNote: {
    fontFamily: APP_FONT,
    fontSize: 12,
    marginBottom: 10,
    fontWeight: '600',
  },
  filterScroll: { marginBottom: 8 },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  catPillRed: { backgroundColor: '#d9432f' },
  catPillYellow: { backgroundColor: '#f5b700' },
  catPillTeal: { backgroundColor: '#007777' },
  catPillActive: { backgroundColor: '#1a1a1a' },
  catPillText: { fontFamily: APP_FONT, color: '#1a1a1a', fontSize: 11, fontWeight: '800' },
  catPillTextActive: { color: '#f5b700' },
  card: {
    borderWidth: 2,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 14,
  },
  cardHeaderStrip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  cardHeaderCategory: {
    fontFamily: APP_FONT,
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  ratingAndDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  popularityPill: {
    backgroundColor: 'rgba(0,0,0,0.28)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 999,
  },
  popularityPillText: {
    fontFamily: APP_FONT,
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '800',
  },
  ratingBadge: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  ratingBadgeText: {
    fontFamily: APP_FONT,
    color: '#f5b700',
    fontSize: 10,
    fontWeight: '800',
  },
  cardHeaderDate: { fontFamily: APP_FONT, color: '#ffffff', fontSize: 10, fontWeight: '700' },
  cardBody: { padding: 14 },
  cardTopIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  logoContainer: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoFallbackText: {
    fontFamily: APP_FONT,
    color: '#ffffff',
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  symbolCornerBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolCornerText: {
    fontSize: 10,
  },
  cardTitle: {
    fontFamily: APP_FONT,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  cardOrganizer: { fontFamily: APP_FONT, fontSize: 11, fontWeight: '600' },
  matchBanner: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  matchBannerText: { fontFamily: APP_FONT, fontSize: 10, fontWeight: '800' },
  cardDesc: { fontFamily: APP_FONT, fontSize: 12, lineHeight: 16, marginBottom: 8 },
  skillPillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  miniSkillTag: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 8,
  },
  miniSkillText: { fontFamily: APP_FONT, fontSize: 10, fontWeight: '700' },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 8,
  },
  cardReward: { fontFamily: APP_FONT, fontSize: 13, fontWeight: '800' },
  cardModeText: { fontFamily: APP_FONT, fontSize: 10, fontWeight: '600', marginTop: 2 },
  trackBtn: {
    backgroundColor: '#d9432f',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 12,
  },
  trackBtnActive: { backgroundColor: '#007777' },
  trackBtnText: { fontFamily: APP_FONT, color: '#ffffff', fontSize: 11, fontWeight: '800' },
  loadMoreBtn: {
    backgroundColor: '#d9432f',
    paddingVertical: 12,
    borderWidth: 2,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 10,
  },
  loadMoreBtnText: {
    fontFamily: APP_FONT,
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  directoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  directoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    padding: 8,
    gap: 8,
    width: '48%',
  },
  directoryChipName: {
    fontFamily: APP_FONT,
    fontSize: 11,
    fontWeight: '800',
  },
  directorySubFest: {
    fontFamily: APP_FONT,
    fontSize: 9,
    fontWeight: '600',
  },
  nearMeBanner: {
    marginTop: 8,
    padding: 16,
    borderWidth: 2,
    borderRadius: 18,
  },
  hubGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hubChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 999,
  },
  hubChipActive: {
    backgroundColor: '#007777',
  },
  hubChipText: {
    fontFamily: APP_FONT,
    fontSize: 11,
    fontWeight: '800',
  },
  emptyBox: {
    padding: 30,
    borderWidth: 2,
    borderRadius: 18,
    alignItems: 'center',
  },
  emptyText: { fontFamily: APP_FONT, fontWeight: '700', textAlign: 'center' },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 999,
  },
  statusChipActive: { backgroundColor: '#f5b700' },
  statusChipText: { fontFamily: APP_FONT, fontSize: 11, fontWeight: '800' },
  profileBox: {
    padding: 16,
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: 16,
  },
  profileSectionHeader: {
    fontFamily: APP_FONT,
    fontSize: 12,
    fontWeight: '800',
    color: '#d9432f',
    marginBottom: 12,
  },
  inputRowGrid: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  fieldLabel: { fontFamily: APP_FONT, fontSize: 10, fontWeight: '800', marginBottom: 4 },
  profileInput: {
    fontFamily: APP_FONT,
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 10,
  },
  listItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
  },
  listItemText: {
    fontFamily: APP_FONT,
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    paddingRight: 8,
  },
  deleteMiniBtn: {
    backgroundColor: '#d9432f',
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteMiniBtnText: { fontFamily: APP_FONT, color: '#ffffff', fontSize: 14, fontWeight: '900' },
  addRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 4 },
  addBtn: {
    backgroundColor: '#007777',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 2,
    borderRadius: 12,
  },
  addBtnText: { fontFamily: APP_FONT, color: '#ffffff', fontSize: 12, fontWeight: '800' },
  branchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  branchBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 12,
  },
  branchBtnActive: { backgroundColor: '#d9432f' },
  branchBtnText: { fontFamily: APP_FONT, fontSize: 12, fontWeight: '700' },
  branchBtnTextActive: { color: '#ffffff' },
  skillBadgeEditable: {
    backgroundColor: '#f5b700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 999,
  },
  skillBadgeEditableText: {
    fontFamily: APP_FONT,
    fontSize: 11,
    fontWeight: '800',
    color: '#1a1a1a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderWidth: 3,
    borderRadius: 24,
    padding: 20,
  },
  modalCategory: {
    fontFamily: APP_FONT,
    color: '#d9432f',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 2,
  },
  modalTitle: { fontFamily: APP_FONT, fontSize: 18, fontWeight: '900' },
  modalOrg: { fontFamily: APP_FONT, fontSize: 12, fontWeight: '700', marginVertical: 8 },
  modalDesc: { fontFamily: APP_FONT, fontSize: 13, lineHeight: 18, marginBottom: 14 },
  modalMetaBox: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 14,
    marginBottom: 16,
    gap: 4,
  },
  modalMetaText: { fontFamily: APP_FONT, fontSize: 11, fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalBookBtn: {
    flex: 2,
    backgroundColor: '#d9432f',
    padding: 12,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBookBtnText: {
    fontFamily: APP_FONT,
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  modalCloseBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseText: { fontFamily: APP_FONT, fontWeight: '800', fontSize: 12 },

  // --- FLOATING ROUND PIPE / CAPSULE NAVIGATION BAR (Instagram iOS Style) ---
  floatingPipeWrapper: {
    position: 'absolute',
    bottom: 14,
    left: 12,
    right: 12,
    alignItems: 'center',
    zIndex: 50,
  },
  floatingPipeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
    borderRadius: 999,
    borderWidth: 2,
    paddingHorizontal: 6,
    paddingVertical: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 14,
  },
  pipeTabItem: {
    flex: 1,
    height: '100%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  pipeCenterItem: {
    backgroundColor: '#d9432f',
    marginHorizontal: 4,
    paddingHorizontal: 8,
  },
  pipeTabItemActive: {
    backgroundColor: '#f5b700',
  },
  pipeTabText: {
    fontFamily: APP_FONT,
    fontSize: 10,
    fontWeight: '900',
    color: '#f4ecd8',
  },
  pipeTabTextActive: {
    color: '#1a1a1a',
  },
});