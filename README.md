# EcoCycle   Waste Management & Rewards Platform

## Overview
EcoCycle is a community-focused waste management platform that encourages sustainable practices through gamification and rewards. Users can log their waste disposal activities, track their environmental impact, earn EcoCoins, compete with others on a leaderboard, unlock achievements, and redeem their EcoCoins for cryptocurrencies while learning about environmental sustainability.

## Core Features

### Authentication
- Internet Identity integration for secure user login and logout
- Clear user feedback during authentication process
- Smooth transitions between authenticated and unauthenticated states
- User session management and persistent login state

### Settings Management
- Secure settings page or modal where authenticated users can view, enter, update, and remove their Gemini API key
- Default Gemini API key (`AIzaSyABa_hinTbT-zYeJsjpzU5HNZb05YE8zSQ`) pre-filled in the settings interface
- API key storage in frontend local storage with secure handling
- Clear instructions and feedback informing users that the Gemini API key is securely stored locally and is required for AI-powered waste recognition
- Validation and testing functionality for entered API keys
- Option to update or remove saved API keys with immediate effect on waste recognition feature

### Waste Logging
- Users can log waste disposal events with details such as waste type, quantity, and disposal method
- Support for different waste categories (recyclables, compostables, general waste, hazardous materials, electronics waste)
- Simple form interface for quick logging of disposal activities
- History view of all logged waste events

### AI-Powered Waste Recognition (Gemini Feature)
- Image upload functionality allowing users to take or upload photos of waste items
- Real Gemini 2.5 Flash API integration using the current saved API key (default or user-updated) for waste image analysis
- Smart waste type recommendations based on uploaded images using actual AI recognition
- Option to accept AI suggestions or manually override the recommended waste category
- Auto-fill capability for waste logging form based on AI recommendations
- Visual display of uploaded images and AI analysis results
- Always uses the latest API key saved in settings for all recognition requests
- Clear feedback when API key is required for AI features

### Enhanced Analytics Dashboard
- Visual charts and graphs showing personal waste disposal trends over time
- Breakdown of waste by category and disposal method, including electronics waste
- Environmental impact metrics (CO2 saved, materials recycled)
- Monthly and yearly summaries of waste management activities
- Personal progress timeline showing key milestones and achievements over time
- Motivational messages and progress encouragement based on user activity

### EcoCoin Rewards System
- Users earn EcoCoins for logging waste disposal events
- Different point values based on waste type and disposal method (higher rewards for recycling and composting, including electronics recycling)
- Display of current EcoCoin balance and earning history
- Simple token-based reward mechanism

### Cryptocurrency Redemption System
- Users can redeem EcoCoins for Ethereum and other cryptocurrencies
- Redemption interface with amount selection and current exchange rate display
- Real-time exchange rate information for supported cryptocurrencies
- Redemption request submission and status tracking
- Clear explanation of the simulated redemption process and manual steps required
- Redemption history showing past transactions and their status
- Minimum redemption thresholds and transaction fees display

### Achievements & Badges System
- Users unlock achievements and badges for reaching milestones
- Achievement categories include total waste logged, EcoCoins earned, consecutive logging streaks, and specific waste type targets (including electronics waste milestones)
- Visual badge display showing earned achievements
- Progress tracking toward next achievement milestones

### Educational Content
- Waste reduction tips and educational content section
- Rotating eco-tips and environmental facts
- Educational content about sustainable practices and environmental impact
- Tips tailored to different waste categories and disposal methods, including electronics waste disposal and recycling
- Information about proper electronics waste handling and e-waste recycling programs

### Leaderboard
- Community leaderboard showing top contributors based on EcoCoins earned
- Rankings updated based on user participation and sustainable practices
- Display of user rankings with usernames and total EcoCoins

### Social Sharing
- Users can generate shareable links for their achievements
- Shareable leaderboard status and personal milestones
- Links display achievement details and user progress

## Backend Data Storage
- User profiles and Internet Identity authentication data
- Default Gemini API key and user-updated API key preferences
- Waste logging records with timestamps, categories (including electronics waste), quantities, and disposal methods
- Uploaded waste images for AI analysis processing
- EcoCoin balances and transaction history
- Cryptocurrency redemption requests with status, amounts, exchange rates, and timestamps
- Redemption history and transaction records
- Achievement and badge data with unlock timestamps and progress tracking (including electronics waste achievements)
- Educational content library with tips and eco-facts, including electronics waste information
- Leaderboard rankings and user statistics
- Social sharing data and generated link information

## Backend Operations
- Handle Internet Identity authentication and user session management
- Store and manage default Gemini API key and user API key preferences
- Process waste logging submissions and calculate EcoCoin rewards for all waste categories including electronics
- Manage image uploads and process AI waste recognition requests using the current saved API key (default or user-updated)
- Make secure API calls to Gemini 2.5 Flash for waste image analysis using the appropriate API key
- Process AI recommendations and provide waste type suggestions
- Handle API key validation and error management for Gemini integration
- Update API key usage when users modify their settings
- Manage cryptocurrency redemption requests and status updates
- Fetch and store current cryptocurrency exchange rates
- Process redemption calculations and validate user balances
- Track achievement progress and unlock badges based on user milestones (including electronics waste targets)
- Generate analytics data for dashboard visualizations and progress timelines including electronics waste data
- Manage educational content rotation and delivery, including electronics waste content
- Update leaderboard rankings based on user activities
- Generate shareable links for achievements and leaderboard status
- Manage user accounts and reward balances

## User Interface
- Modern, visually engaging design with enhanced eco-friendly color scheme using greens, blues, and earth tones
- Improved layout with better spacing, typography, and visual hierarchy
- Integration of provided eco-themed assets (icons, logo, badges)
- Intuitive navigation between waste logging, enhanced dashboard, achievements, educational content, rewards, redemption, settings, and leaderboard sections
- Enhanced settings page or modal with pre-filled default Gemini API key and clear management interface
- Clear instructions and user guidance explaining that the Gemini API key is securely stored locally and required for AI-powered waste recognition
- Image upload interface integrated into waste logging page with camera and file upload options
- AI recommendation display with accept/override functionality
- Visual feedback for image analysis and AI suggestions using the current saved API key
- API key status indicators and validation feedback in settings
- Responsive design suitable for desktop and mobile devices
- Clear visual feedback for successful actions, reward earning, achievement unlocks, and redemption requests
- Enhanced use of color coding and visual elements to improve user engagement
- Motivational design elements and progress indicators throughout the interface
- Authentication state indicators and login/logout controls
- Redemption interface with clear exchange rate display and transaction status

## Content Language
- All application content and interface text in English
