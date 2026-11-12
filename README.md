# 🚀 Kids Morning Launchpad (iPad Kiosk Check-In)

A dedicated, touch-first morning check-in and preparation station designed for an iPad mounted on the counter or entryway.

---

## 🌟 Tailored Kid Profiles

1. **Jessica (10 yrs · 5th Grade)**:
   - 💻 Pack Computer / Chromebook & charger
   - 📚 Homework folder & reading log
   - ✍️ Parent signature check (agendas / permission slips)
   - 🥪 Lunch decision (School Nutrislice vs Home packed)
   - 🏊‍♀️ Swim practice gear (Mon–Thu: Bag, Goggles, Equipment/Cap, Towel)

2. **Megan (8 yrs · 2nd Grade)**:
   - 💻 Pack Computer / Laptop
   - 📚 Homework folder
   - ✍️ Parent signature check
   - 🥪 Lunch decision (School Nutrislice vs Home packed)
   - 🏊‍♀️ Swim practice gear (Mon–Thu: Bag, Goggles, Equipment/Cap, Towel)

3. **Andrew (6 yrs · 1st Grade)**:
   - 📚 1st Grade take-home folder / library books
   - ✍️ Parent signatures / notes
   - 🥪 Lunch decision (School Nutrislice vs Home packed)
   - 🏊‍♂️ Swim practice gear (Mon–Thu: Bag, Goggles, Equipment/Cap, Towel)
   - 💧 Cold water bottle & morning routine

---

## 📱 How to Run on Your iPad

### 1. Start the Dev Server
In this directory:
```bash
npm run dev
```
Vite will host the app on your local network (port `3000`).

### 2. Open on the iPad
Make sure the iPad is connected to your home Wi-Fi, then open Safari and navigate to:
```
http://192.168.68.68:3000
```
*(Or your computer's local IP on port 3000)*

### 3. Install as a Full-Screen Kiosk App (No Safari address bar)
1. In iPad Safari, tap the **Share** button (the square with an arrow pointing up).
2. Tap **"Add to Home Screen"**.
3. Name it **"Launchpad"** and tap **Add**.
4. Tap the new 🚀 icon on the home screen. It will launch in full-screen standalone mode without browser bars!

---

## 🛠️ Key Features

- **Nutrislice Lunch Menu Selector**:
  - Parents can pre-load or customize daily Nutrislice entrees the night before.
  - Kids tap either **Home Lunch** (sandwich, bento, thermos) or **School Lunch** (selecting from today's cafeteria menu options).
- **Swim Day Detection (Mon–Thu)**:
  - Automatically activates the swim gear checklist Monday through Thursday.
  - On Friday or weekends, it marks swim practice as off.
- **Day Simulator**:
  - A quick selector at the top lets parents or kids test out any day of the week (e.g. check Friday's pizza menu on Thursday night).
- **Tactile Touch Feedback & Audio**:
  - Web Audio API synthesizes cheerful dings on checkboxes.
  - Full-screen confetti cannon and celebration chimes when a kid completes their morning check-in.
- **Local Persistence**:
  - All check-in states and customized menus are saved locally in `localStorage`.
