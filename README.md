# Oracle Earth - The AI Brain of Our Planet 🌍🧠

A futuristic full-stack AI web application that serves as a digital twin of Earth, providing real-time global intelligence for peace, sustainability, and security monitoring.

## 🚀 Features

### 🛡️ Peace & Conflict Intelligence
- AI-powered conflict probability analysis between countries
- Real-time monitoring using open-source news data (GDELT integration ready)
- Automated peace treaty generation when tensions rise
- Historical conflict pattern analysis

### 🌍 Environment Monitor
- Real-time environmental tracking (deforestation, CO₂ levels, glacier melts)
- AI-driven sustainability recommendations
- Climate change impact visualization
- Reforestation and corrective measure suggestions

### ⚠️ Counter-Terrorism Dashboard
- Advanced threat analysis and security intelligence
- Detection of countries/groups funding terrorism via open data
- Risk level assessment and monitoring
- Interactive threat visualization on global map

### 📈 Global Economy
- Economic indicators and market trends analysis
- AI-powered economic forecasting
- Trade balance and GDP monitoring
- Market sentiment analysis

### 🤖 AI Earth Chatbot
- Natural language interface powered by OpenRouter API
- Global intelligence Q&A system
- Context-aware responses using real-time data
- Multi-domain expertise (conflicts, environment, security, economy)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with better-sqlite3
- **AI Engine**: OpenRouter API (Claude, GPT, etc.)
- **Visualization**: Recharts, Lucide React icons
- **3D Visualization**: Ready for CesiumJS/Three.js integration

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oracle-earth
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Initialize the database**
   ```bash
   pnpm run db:migrate
   # or
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

The application uses SQLite with the following main tables:
- `conflicts` - Conflict probability data between countries
- `environment` - Environmental monitoring data
- `terrorism` - Counter-terrorism intelligence
- `economic` - Economic indicators by country
- `chat_history` - AI chatbot conversation history

## 🔧 Configuration

### OpenRouter API Setup
1. Sign up at [OpenRouter](https://openrouter.ai/)
2. Get your API key
3. Add it to your `.env.local` file
4. The app supports multiple AI models (Claude, GPT-4, etc.)

### Database Configuration
- SQLite database is created automatically
- No additional database setup required
- Data persists in `oracle-earth.db` file

## 📱 Pages & Features

### Home (`/`)
- Overview dashboard with global statistics
- Quick access to all intelligence modules
- Real-time global indicators

### Peace & Conflict (`/peace-conflict`)
- Conflict probability analyzer
- Peace treaty generator
- Active conflicts monitoring
- Historical tension analysis

### Environment Monitor (`/environment`)
- Environmental data visualization
- Climate change tracking
- Sustainability recommendations
- Regional environmental alerts

### Counter-Terrorism (`/counter-terrorism`)
- Threat level dashboard
- Organization risk assessment
- Funding source analysis
- Security recommendations

### Global Economy (`/economy`)
- Economic indicators dashboard
- Market trends visualization
- AI economic forecasting
- Trade balance monitoring

### AI Chatbot (`/chatbot`)
- Natural language interface
- Global intelligence Q&A
- Context-aware responses
- Conversation history

## 🔌 API Endpoints

### Conflicts
- `GET /api/conflicts` - Get all conflicts
- `POST /api/analyze-conflict` - Analyze conflict probability
- `POST /api/generate-treaty` - Generate peace treaty

### Environment
- `GET /api/environment` - Get environmental data
- `POST /api/analyze-environment` - Get AI recommendations

### Counter-Terrorism
- `GET /api/terrorism` - Get terrorism data
- `POST /api/analyze-terrorism` - Analyze threat levels

### Economy
- `GET /api/economy` - Get economic data
- `POST /api/economic-forecast` - Generate economic forecast

### Chat
- `POST /api/chat` - Chat with AI
- `GET /api/chat-history` - Get chat history

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- Compatible with any Node.js hosting platform
- Ensure SQLite support or migrate to PostgreSQL/MySQL
- Set environment variables appropriately

## 🔮 Future Enhancements

- **3D Earth Visualization**: Integration with CesiumJS or Three.js
- **Real-time Data Feeds**: GDELT, satellite imagery, news APIs
- **Advanced Analytics**: Machine learning models for prediction
- **Mobile App**: React Native companion app
- **Multi-language Support**: Internationalization
- **Advanced Security**: Enhanced authentication and authorization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenRouter for AI API services
- Next.js team for the amazing framework
- Tailwind CSS for styling utilities
- Lucide React for beautiful icons
- Recharts for data visualization

## 📞 Support

For support, email support@oracle-earth.com or join our Discord community.

---

**Oracle Earth** - Monitoring our planet with AI-powered intelligence for a peaceful and sustainable future. 🌍✨
