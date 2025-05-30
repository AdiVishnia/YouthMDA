# YouthMDA - אפליקציית מגן דוד אדום נוער 🚑

<div dir="rtl">

## תיאור הפרויקט
אפליקציית מגן דוד אדום נוער היא פלטפורמה דיגיטלית המיועדת למתנדבי הנוער של מד"א. האפליקציה מספקת כלים חיוניים, מידע ומשאבים לשיפור היכולות והמעורבות של מתנדבי הנוער.

### תכונות עיקריות
1. **יYouthMDA-AIי עוזר אישי חכם** - עם AI מובנה, המערכת יודעת לענות על שאלות בנושא מגן דוד אדום, תרגולים רפואיים ונהלי חירום ברמה מתקדמת ומדויקת.
2. **רשימת בדיקת אמבולנס** - כלי עזר מסודר ומקיף המאפשר מעבר על ציוד ואביזרים לפני כל משמרת.
3. **טבלת מדדים תקינים** - טבלה דינמית עם ערכים לפי קבוצות גיל, ממילודים ועד מבוגרים.
4. **כלי עזר חיוניים** - טיימר ומטרונום מובנים למדידת דופק וטיפול במטופלים.
5. **עמוד להכנסת מדדים של מטופל בשטח** - ממשק אינטואיטיבי לתיעוד בזמן אמת עם תצוגה ויזואלית של נתונים.
6. **ניהול נתונים אישיים** - פרופיל אישי המכיל מידע כגון שם, גיל, תחנה, מייל, מין, הכשרה, שנות התנדבות ועוד.
7. **דף הרשמה והתחברות**
   - **הרשמה**: עמוד ידידותי ליצירת פרופיל אישי עם הזנת פרטים אישיים כגון שם, גיל, תחנה ותאריך תחילת ההתנדבות.
   - **התחברות**: עמוד התחברות מאובטח עם אפשרות שחזור סיסמה במקרה הצורך.
8. **הרצף שלי** - סימון משמרות שבוצעו לשמירה על רצף שבועי, מעודד התמדה והעלאת משמרות.
9. **חנות מד"א** - חנות להצגת פריטי לבוש ואביזרים לפי שעות התנדבות נדרשות, להגברת תחושת השייכות והמוטיבציה.

האפליקציה היא המקום המרכזי שלכם לקבל מידע, לתרגל ולשפר את הכישורים הרפואיים בצורה נוחה וזמינה, תוך שמירה על חוויית שימוש פשוטה וידידותית.

</div>

## Project Description (English)

YouthMDA is a digital platform designed for MDA (Magen David Adom) youth volunteers. The application provides essential tools, information, and resources to enhance the capabilities and engagement of youth volunteers.

### Key Features
* **YouthMDA-AI Smart Assistant** - AI-powered system that answers questions about MDA, medical training, and emergency protocols.
* **Ambulance Checklist** - A structured tool to verify equipment and supplies before every shift.
* **Vital Signs Table** - A detailed, dynamic table with normal values classified by age groups.
* **Essential Tools** - Built-in timer and metronome to assist with accurate timing and treatment.
* **Patient Data Entry** - A dedicated interface for real-time recording of patient vitals with visual display.
* **Personal Data Management** - Profile page with details such as name, station, email, age, gender, training, and volunteer history.
* **Registration & Login**
   - **Registration**: User-friendly form for entering personal information and creating an account.
   - **Login**: Secure login interface with password recovery option.
* **My Streak** - Tracks volunteer shifts to maintain weekly continuity and encourage active participation.
* **MDA Store** - Allows users to view clothing items and see how many volunteering hours are needed to acquire them, boosting motivation and engagement.

### Technologies Used
* React Native
* Firebase
* Expo
* Node.js

### System Requirements
* iOS version 12.0 or higher
* Android version 8.0 or higher
* Internet connection

### Installation

#### Option 1: Local Installation
```bash
# Clone the repository
git clone https://github.com/AdiVishnia/YouthMDA.git

# Navigate to project directory
cd YouthMDA

# Install dependencies
npm install

# Start the application
expo start
```

#### Option 2: Docker Installation
```bash
# Pull the Docker image
docker pull adivishnia/youthmda:latest

# Run the container
docker run -p 19000:19000 -p 19001:19001 -p 19002:19002 adivishnia/youthmda:latest

# Or using docker-compose
docker-compose up
```

The application will be available at:
- Expo DevTools: http://localhost:19002
- Expo Client: exp://localhost:19000

### Development with Docker
If you want to develop using Docker:

```bash
# Build the development image
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

### License
This project is licensed under the MIT License - see the LICENSE file for details.

### Contact
* Developer: Adi Vishnia
* Email: adi.vishnia@gmail.com
* GitHub: [@AdiVishnia](https://github.com/AdiVishnia)

---
<div dir="rtl">

### צור קשר
* מפתח: עדי וישניה
* אימייל: adi.vishnia@gmail.com
* GitHub: [@AdiVishnia](https://github.com/AdiVishnia)

</div>

# YouthMDA Docker Setup

This repository contains the Docker configuration for running the YouthMDA application.

## Quick Start

### Prerequisites
- Docker installed on your system
- Docker Compose installed on your system

### Running the Application

1. Pull the Docker image:
```bash
docker pull adivishnia/youthmda:latest
```

2. Run the container:
```bash
docker run -p 19000:19000 -p 19001:19001 -p 19002:19002 adivishnia/youthmda:latest
```

Or using docker-compose:
```bash
docker-compose up
```

### Accessing the Application

Once running, you can access the application through:
- Expo DevTools: http://localhost:19002
- Expo Client: exp://localhost:19000

### Development

To develop using Docker:

```bash
# Build the development image
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

## Ports

The application uses the following ports:
- 19000: Expo Client
- 19001: Expo DevTools
- 19002: Expo Web Interface

## Environment Variables

- `NODE_ENV`: Set to 'development' by default

## Contributing

Feel free to submit issues and enhancement requests!

