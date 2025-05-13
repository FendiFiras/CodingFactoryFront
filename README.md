
# Coding Factory by LearningHub

Coding Factory is a platform made for students who want to learn tech skills — like web, mobile, AI, or data.
It also helps them find internships, join events, and connect with others through a blog space.
The main goal is to reduce the gap between school learning and real work in tech.

#Esprit_school_of_engineering

---

## 🚀 Technologies Used

- **Backend**: Spring Boot (Java 17), Microservices (Eureka Server, API Gateway)
- **Frontend**: Angular 19
- **Database**: MySQL
- **Machine Learning**: XGBoost, PCA, K-Means
- **Tools**: Maven, Node.js, JWT, WebSocket, AI APIs (OpenAI Whisper, BERT/T5), Stripe API

---

## 📄 Prerequisites

- Java 17+
- Maven
- Node.js 18+ and Angular CLI
- MySQL Server

---

## 🛠️ Project Installation

### 1. Clone the Project

```bash
git clone https://github.com/FendiFiras/CodingFactoryFront.git
cd coding-factory
```

### 2. Backend Configuration (Spring Boot)

- Navigate to the `backend/` directory
- Edit `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/coding_factory_db
spring.datasource.username=root
spring.datasource.password=yourpassword
jwt.secret=your_jwt_secret
```

- Start the Eureka Server and API Gateway.
- Start each microservice with:

```bash
./mvnw spring-boot:run
```

### 3. Frontend Configuration (Angular)

- Navigate to the `frontend/` directory

```bash
npm install
ng serve --open
```

Frontend available at `http://localhost:4200/`.

---

## 🔄 Key Features

- **Secure Authentication** (JWT, OAuth2, 2FA, ReCaptcha)
- **Full CRUD Management** of students, trainers, companies, events, forums, claims
- **Real-Time Forums** (emojis, send position and audio)
- **Internship and Interview Management** (Calendar and Application Filters)
- **Online Payments** (Stripe API)
- **AI-Powered Recommendations** (internship matching)
- **Internship Success Prediction** (XGBoost Model)
- **Dynamic Events & Statistics**
- **Smart Claims Management System** (prioritization, chatbots)

---

## 📅 Advanced AI Modules

- **Cheat Detection** during quizzes
- **Video Transcription Generation**
- **Smart Matching for CVs and Internship Offers**
- **Personalized Recommendation System**

---

## 📂 Global Architecture

```
coding-factory
├── backend
│   ├── user-service
│   ├── auth-service
│   ├── training-service
│   ├── event-service
│   ├── forum-service
│   ├── pfe-service
│   ├── ai-service
│   ├── complaint-service
│   └── gateway-server
├── eureka-server
├── frontend (Angular)
└── README.md
```

---

## 💼 Project Team

- Ali Abdedaiem
- Adem Zitouni
- Achref Abdelaziz
- Firas Abidhiaf
- Montassar Blel
- Khalil Chekili

---

## 📅 Agile Planning

- **Sprint 0**: Analysis, architecture, backlog
- **Sprint 1**: Basic CRUD, security, API integrations
- **Sprint 2**: AI, WebSocket, advanced modules
- **Sprint 3**: Prediction and recommendation

---

## 🔗 Project Link

- [CodingFactoryFront Repository](https://github.com/FendiFiras/CodingFactoryFront)
-[CodingFactory](https://github.com/FendiFiras/CodingFactory/tree/Back)

---

## 💍 Acknowledgements

Thank you to Esprit School of Engineering for their support and guidance on this project!

#Esprit_school_of_engineering
