
## Construction Management System

The Construction Management System provides a user-friendly interface tailored for small to medium-scale construction companies. It is a full-stack web application built using **Laravel** and **React.js**, enabling teams to manage tasks, equipment, documents, costs, and communication efficiently.

---

###  Features

- **User Management** – Manage user roles, permissions, and access control.
- **Equipment Management** – Track equipment usage, availability, and maintenance.
- **Task Management** – Assign and monitor project tasks and schedules.
- **Financial and Cost Tracking** – Monitor budgets, expenses, and change orders.
- **Documents and Images** – Upload, share, and manage project-related files.
- **Quality Control** – Assign inspections, track results, and ensure project standards.
- **Real-time Messaging and Notifications** – Communicate instantly with team members and receive real-time updates using WebSockets.

---

### 🛠 Tech Stack

- **Backend:** Laravel 10
- **Frontend:** React.js, Tailwind CSS
- **Database:** MySQL

---

##  Installation Guide

> The project has two main folders: `frontend/` and `backend/`.

### 1. Clone the Repository

```bash
git clone https://github.com/achinthash/Construction-Management-System.git
cd Construction-Management-System
```



 
### 2. Setting up the Backend


- Download the ZIP file from the **‘Developed files of the system’** folder and extract it.

- Open a terminal, navigate to the extracted backend folder, and run:

```bash
composer install
```

- Copy `.env.example` to a new `.env` file:

```bash
cp .env.example .env
```

- Generate an application key:

```bash
php artisan key:generate
```

 

#### 2. Mail Configuration

  

Open `.env` and configure the following mail settings:

```plaintext

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com # Replace with your actual email
MAIL_PASSWORD=your_password # Replace with your actual password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"

```

  
#### 3. Database Configuration

  
- In `.env`, configure database settings as follows:

```plaintext

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=construction_management_system
DB_USERNAME=your_username # Replace with your actual username
DB_PASSWORD=your_password # Replace with your actual password

```

---

### 4.  Broadcast Configuration (Laravel WebSockets / Pusher)

To enable real-time messaging and notifications, set up your broadcasting configuration in the Laravel backend.

In your `.env` file inside the `backend/` directory, add or update the following:

```env
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-app-key
PUSHER_APP_SECRET=your-app-secret
PUSHER_HOST=127.0.0.1
PUSHER_PORT=6001
PUSHER_SCHEME=http
PUSHER_APP_CLUSTER=mt1

```
- Create a new database named `construction_management_system` in MySQL.

- Run the migrations to set up tables:

```bash
php artisan migrate
```
- Seed the database with initial data:

```bash
php artisan db:seed
```
- Start the Laravel development server:

```bash
php artisan serve
```

The Back End server should now be running at [http://127.0.0.1:8000](http://127.0.0.1:8000).


### 3. Setting up the Frontend

cd ../frontend

- Install Node dependencies

```bash
npm install
```

-  Start the development server

```bash
npm run dev
```

The Front End server should now be running at [http://127.0.0.1:3000]
