# StockFlow - Inventory Management System

A modern, full-stack inventory management application built with the MERN stack.

## 🚀 Features

- **User Authentication** - Secure JWT-based login and registration
- **Inventory Management** - Full CRUD operations for inventory items
- **Real-time Search** - Instant search across item names and descriptions
- **Smart Filtering** - Filter by category and low stock alerts
- **Statistics Dashboard** - Live metrics on inventory value and stock levels
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- **Modern UI** - Neo-brutalist design with smooth animations

## 🛠️ Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Framer Motion** - Animations
- **CSS3** - Modern styling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd stockflow
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory-db
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
npm start
```
Backend will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

## 📱 Usage

1. **Register** - Create a new account with your name, email, and password
2. **Login** - Access your personalized inventory dashboard
3. **Add Items** - Click "Add Item" to create new inventory entries
4. **Search & Filter** - Use the search bar and filters to find specific items
5. **Edit/Delete** - Click on any item card to view, edit, or delete
6. **Monitor Stats** - View real-time statistics in the dashboard cards

## 🔐 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication with 30-day expiration
- Protected API routes with middleware
- Input validation on client and server
- User-specific data isolation
- CORS protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Inventory
- `GET /api/items` - Get all items (with optional filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item (protected)
- `PUT /api/items/:id` - Update item (protected)
- `DELETE /api/items/:id` - Delete item (protected)
- `GET /api/items/stats/summary` - Get statistics (protected)

## 📁 Project Structure

```
stockflow/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── Item.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── items.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🎨 Key Features Explained

### Dashboard Statistics
- **Total Items** - Count of all inventory items
- **Total Value** - Sum of (price × quantity) for all items
- **Low Stock** - Items below threshold
- **Out of Stock** - Items with zero quantity

### Search & Filter
- **Text Search** - Case-insensitive search in names and descriptions
- **Category Filter** - Filter by Electronics, Clothing, Food, Furniture, Books, Toys, Other
- **Low Stock Toggle** - Show only items below threshold

### Item Categories
- Electronics
- Clothing
- Food
- Furniture
- Books
- Toys
- Other

## 🚢 Deployment

### Backend
Recommended platforms:
- Heroku
- Railway
- Render
- AWS Elastic Beanstalk

### Frontend
Recommended platforms:
- Vercel
- Netlify
- AWS S3 + CloudFront

### Database
- MongoDB Atlas (free tier available)

## 🔮 Future Enhancements

- [ ] Image uploads for products
- [ ] Dark/light theme toggle
- [ ] Export to CSV
- [ ] Pagination for large inventories
- [ ] Charts and analytics
- [ ] Barcode scanner integration
- [ ] Email notifications for low stock
- [ ] Multi-user permissions
- [ ] Real-time updates with WebSockets

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 🧪 Testing

The application has been manually tested for:
- User registration and login
- CRUD operations on inventory items
- Search and filter functionality
- Responsive design across devices
- Error handling and validation
- Authentication and authorization


## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


