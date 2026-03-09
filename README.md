\# 💰 MoneyT — Personal Finance Analytics Platform



A full-stack personal finance platform that helps users track income and expenses, manage category budgets, and gain real-time financial insights through an analytics dashboard.



---



\## 📸 Screenshots



> \*\*Dashboard\*\*

!\[Dashboard](docs/screenshots/dashboard.png)



> \*\*Transactions\*\*

!\[Transactions](docs/screenshots/transactions.png)



> \*\*Budget Management\*\*

!\[Budget](docs/screenshots/budget.png)



---



\## ✨ Features



\- 🔐 \*\*JWT Authentication\*\* — Secure login and registration with Spring Security 6

\- 💸 \*\*Expense Tracking\*\* — Add, edit, delete expenses with category tagging and filters

\- 💵 \*\*Income Tracking\*\* — Track income sources with date-range and source filtering

\- 📊 \*\*Analytics Dashboard\*\* — Real-time stats including savings rate, daily average, and spending spikes

\- 📈 \*\*Predictive Analytics\*\* — Linear extrapolation engine for Safe Daily Allowance and projected monthly total

\- 🎯 \*\*Budget Management\*\* — Set category budgets, track overspend, and get alerts for categories nearing limit

\- 📉 \*\*Monthly Cash Flow Trends\*\* — Income vs expense bar/line chart across 12 months

\- 🔍 \*\*Server-side Pagination \& Filtering\*\* — Date range, category, and source filters with paginated results

\- 🐳 \*\*Dockerised\*\* — Full stack runs with a single `docker-compose up` command



---



\## 🛠 Tech Stack



\### Backend

| Technology | Version |

|---|---|

| Java | 21 |

| Spring Boot | 4.0.1 |

| Spring Security | 6 |

| Hibernate / JPA | via Spring Boot |

| PostgreSQL | 15 |

| JWT | stateless auth |

| Maven | build tool |



\### Frontend

| Technology | Version |

|---|---|

| Angular | 20 |

| TypeScript | latest |

| RxJS | latest |

| Chart.js | latest |

| Tailwind CSS | latest |



\### DevOps

| Technology | Purpose |

|---|---|

| Docker | containerisation |

| Docker Compose | multi-service orchestration |

| Git | version control |



---



\## 📁 Project Structure



```

moneyt/

├── backend/                        → Spring Boot 4 REST API

│   └── src/main/java/

│       ├── controller/             → REST endpoints

│       ├── service/                → Business logic

│       ├── repository/             → JPA repositories

│       ├── model/                  → JPA entities

│       ├── dto/                    → Request / Response DTOs

│       ├── security/               → JWT filter chain, Spring Security config

│       └── exception/              → Global exception handler (RFC 7807)

│

├── frontend/

│   └── src/app/

│       ├── core/            → Models, services, factories

│       ├── features/        → Dashboard, Transactions, Budget pages

│       └── shared/          → Stat card, Transaction list/form, Filter bar, Charts

**│**

├── docker-compose.yml

└── README.md

```



---



\## 🚀 Run Locally



\### Prerequisites



Make sure you have these installed:



| Tool | Version |

|---|---|

| Java | 21+ |

| Maven | 3.9+ |

| Node.js | 18+ |

| npm | 9+ |

| PostgreSQL | 15+ |

| Docker \*(optional)\* | latest |



---



\### Option A — Docker \*(Recommended)\*



> Runs frontend + backend + database in one command. No manual setup needed.



```bash

\# Clone the repo

git clone https://github.com/YOUR-USERNAME/moneyt.git

cd moneyt



\# Start everything

docker-compose up --build

```



| Service | URL |

|---|---|

| Frontend | http://localhost:4200 |

| Backend API | http://localhost:8080 |

| PostgreSQL | localhost:5432 |



To stop:

```bash

docker-compose down

```



---



\### Option B — Manual Setup



\*\*1. Clone the repo\*\*

```bash

git clone https://github.com/YOUR-USERNAME/moneyt.git

cd moneyt

```



\*\*2. Set up the database\*\*



Create a PostgreSQL database:

```sql

CREATE DATABASE moneyt;

```



\*\*3. Configure the backend\*\*

```bash

cd backend

cp src/main/resources/application.example.properties \\

&nbsp;  src/main/resources/application.properties

```



Open `application.properties` and fill in your values:

```properties

spring.datasource.url=jdbc:postgresql://localhost:5432/moneyt

spring.datasource.username=YOUR\_DB\_USER

spring.datasource.password=YOUR\_DB\_PASSWORD

jwt.secret=YOUR\_JWT\_SECRET\_KEY

jwt.expiration=86400000

```



\*\*4. Run the backend\*\*

```bash

\# From the backend/ folder

mvn spring-boot:run

```

API runs at `http://localhost:8080`



\*\*5. Run the frontend\*\*

```bash

\# Open a new terminal, from the frontend/ folder

cd ../frontend

npm install

ng serve

```

App runs at `http://localhost:4200`



---



\## 🔑 API Overview



| Method | Endpoint | Description | Auth |

|---|---|---|---|

| POST | `/api/auth/register` | Register new user | ❌ |

| POST | `/api/auth/login` | Login, returns JWT | ❌ |

| GET | `/api/expenses` | Get paginated expenses | ✅ |

| POST | `/api/expenses` | Create expense | ✅ |

| PUT | `/api/expenses/{id}` | Update expense | ✅ |

| DELETE | `/api/expenses/{id}` | Delete expense | ✅ |

| GET | `/api/income` | Get paginated income | ✅ |

| POST | `/api/income` | Create income | ✅ |

| GET | `/api/budget` | Get budgets by month | ✅ |

| POST | `/api/budget` | Create budget | ✅ |

| GET | `/api/dashboard/overview` | Full dashboard stats | ✅ |



> All protected endpoints require `Authorization: Bearer <token>` header.



---



\## 🧠 Key Technical Decisions



\*\*JWT Stateless Auth\*\* — No server-side session storage. Each request carries a self-contained token validated by a custom Spring Security filter chain.



\*\*N+1 Query Elimination\*\* — Custom JPQL aggregation queries replace lazy-loaded relationship chains, reducing dashboard database round-trips by \*\*80%\*\*.



\*\*Predictive Analytics Engine\*\* — Linear extrapolation on daily burn rates generates a forward-looking Safe Daily Allowance, not just a backward-looking average.



\*\*Reactive Frontend\*\* — RxJS BehaviorSubjects drive all data flows. Components subscribe once in `ngOnInit`, and `takeUntil(destroy$)` prevents memory leaks on navigation.



\*\*Server-side Pagination\*\* — All list endpoints accept `page` and `size` params. The frontend never fetches full datasets.



---



\## 🤝 Contributing



This is a portfolio project but PRs are welcome.



```bash

\# Fork the repo, then:

git checkout -b feature/your-feature

git commit -m "feat: your feature description"

git push origin feature/your-feature

\# Open a Pull Request

```



---









---



<div align="center">

&nbsp; Built with Java 21 · Spring Boot 4 · Angular 20 · PostgreSQL · Docker

</div>

