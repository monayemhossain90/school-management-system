# How It Works - Data Flow Guide

A comprehensive guide explaining how data flows through the MERN School Management System. This document is designed to be understandable by anyone, whether you're a developer, student, or just curious about how the system works.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [How Authentication Works](#how-authentication-works)
3. [How Students Are Managed (CRUD)](#how-students-are-managed-crud)
4. [How Attendance Tracking Works](#how-attendance-tracking-works)
5. [How Exam Results Are Updated](#how-exam-results-are-updated)
6. [How Notices Work](#how-notices-work)
7. [How Complaints Work](#how-complaints-work)
8. [Redux State Management Flow](#redux-state-management-flow)

---

## System Overview

The application follows a **3-tier architecture**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER (Browser)                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP Requests
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React - Port 3000)                         │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Pages     │───▶│   Redux     │───▶│   Axios     │───▶│   API Call  │  │
│  │ (Components)│    │   Store     │    │   Client    │    │             │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ HTTP (JSON)
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Express - Port 5000)                        │
│                                                                              │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Routes    │───▶│ Controllers │───▶│   Mongoose  │───▶│   Models    │  │
│  │ (route.js)  │    │  (Logic)    │    │   Queries   │    │  (Schemas)  │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ MongoDB Driver
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE (MongoDB Atlas)                             │
│                                                                              │
│    ┌────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│    │ admins │  │ students│  │ teachers│  │ sclasses│  │ subjects│  ...     │
│    └────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### How a Request Flows Through the System

1. **User clicks a button** (e.g., "Login") on the React frontend
2. **React component calls a Redux action** (e.g., `loginUser()`)
3. **Redux action uses Axios** to send HTTP request to backend
4. **Express router** receives the request and calls the appropriate controller
5. **Controller** processes the request and queries MongoDB via Mongoose
6. **MongoDB** returns data to the controller
7. **Controller** sends JSON response back to frontend
8. **Redux** updates the global state with the response
9. **React component** re-renders with new data

---

## How Authentication Works

Authentication is the process of verifying who a user is. Our system supports three user types: **Admin**, **Student**, and **Teacher**.

### Step-by-Step: Admin Login

```
USER ACTION: Admin enters email & password, clicks "Login"
```

#### Step 1: Frontend Captures Form Data

**File:** `frontend/src/pages/LoginPage.js`

```javascript
// When admin submits the login form
const handleSubmit = (event) => {
    event.preventDefault();
    
    // Get values from form inputs
    const email = event.target.email.value;      // e.g., "admin@school.com"
    const password = event.target.password.value; // e.g., "password123"
    
    // Package data for API
    const fields = { email, password };
    
    // Call Redux action to login
    dispatch(loginUser(fields, "Admin"));
};
```

#### Step 2: Redux Action Makes API Request

**File:** `frontend/src/redux/userRelated/userHandle.js`

```javascript
// loginUser action - sends credentials to backend
export const loginUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());  // Set loading state
    
    try {
        // Send POST request to backend
        // If role is "Admin", URL becomes: http://localhost:5000/AdminLogin
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/${role}Login`, fields);
        
        if (result.data.message) {
            dispatch(authError(result.data.message));  // Login failed
        } else {
            dispatch(authSuccess(result.data));        // Login successful
        }
    } catch (error) {
        dispatch(authError(error.message));
    }
};
```

#### Step 3: Express Router Receives Request

**File:** `backend/routes/route.js`

```javascript
// Route definition - maps POST /AdminLogin to adminLogIn function
router.post('/AdminLogin', adminLogIn);
```

#### Step 4: Controller Validates Credentials

**File:** `backend/controllers/admin-controller.js`

```javascript
const adminLogIn = async (req, res) => {
    // 1. Check if admin exists with this email
    let admin = await Admin.findOne({ email: req.body.email });
    
    if (admin) {
        // 2. Compare password with stored hash
        const validated = await bcrypt.compare(req.body.password, admin.password);
        
        if (validated) {
            // 3. Password matches - remove password from response for security
            admin.password = undefined;
            res.send(admin);  // Send admin data back
        } else {
            res.send({ message: "Invalid password" });
        }
    } else {
        res.send({ message: "User not found" });
    }
};
```

#### Step 5: Redux Updates State

**File:** `frontend/src/redux/userRelated/userSlice.js`

```javascript
// Redux slice - updates global state
authSuccess: (state, action) => {
    state.status = 'success';
    state.currentUser = action.payload;  // Store user data
    state.currentRole = action.payload.role;  // "Admin", "Student", or "Teacher"
    state.loading = false;
}
```

#### Step 6: User is Redirected

**File:** `frontend/src/pages/LoginPage.js`

```javascript
// useEffect watches for successful login
useEffect(() => {
    if (status === 'success') {
        // Redirect based on role
        if (currentRole === 'Admin') {
            navigate('/Admin/dashboard');
        } else if (currentRole === 'Student') {
            navigate('/Student/dashboard');
        } else if (currentRole === 'Teacher') {
            navigate('/Teacher/dashboard');
        }
    }
}, [status, currentRole]);
```

### Visual Flow: Authentication

```
┌──────────────────┐
│  Login Form      │
│  ┌────────────┐  │
│  │ Email      │  │
│  │ Password   │  │
│  │ [Login]    │──┼───────────────────────────────────────────────┐
│  └────────────┘  │                                               │
└──────────────────┘                                               │
                                                                   ▼
                                                    ┌──────────────────────────┐
                                                    │  dispatch(loginUser())   │
                                                    │  Redux Action            │
                                                    └─────────────┬────────────┘
                                                                  │
                                                                  ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                          POST /AdminLogin                                       │
│                          { email, password }                                    │
└────────────────────────────────────────────────────────────────────────────────┘
                                                                  │
                                                                  ▼
                                                    ┌──────────────────────────┐
                                                    │  adminLogIn()            │
                                                    │  Controller              │
                                                    └─────────────┬────────────┘
                                                                  │
                          ┌───────────────────────────────────────┼───────────────┐
                          │                                       │               │
                          ▼                                       ▼               ▼
               ┌─────────────────┐                    ┌─────────────────┐  ┌─────────────┐
               │ Admin.findOne() │                    │ bcrypt.compare()│  │   Response  │
               │ Find by email   │                    │ Validate pass   │  │   JSON      │
               └─────────────────┘                    └─────────────────┘  └─────────────┘
                                                                                  │
                                                                                  ▼
                                                    ┌──────────────────────────┐
                                                    │  authSuccess(userData)   │
                                                    │  Redux State Updated     │
                                                    └─────────────┬────────────┘
                                                                  │
                                                                  ▼
                                                    ┌──────────────────────────┐
                                                    │  navigate('/dashboard')  │
                                                    │  Redirect User           │
                                                    └──────────────────────────┘
```

---

## How Students Are Managed (CRUD)

CRUD stands for **C**reate, **R**ead, **U**pdate, **D**elete - the four basic operations for managing data.

### CREATE: Adding a New Student

```
USER ACTION: Admin fills student form and clicks "Add Student"
```

#### Frontend Flow

**File:** `frontend/src/pages/admin/studentRelated/AddStudent.js`

```javascript
// Form submission handler
const submitHandler = (event) => {
    event.preventDefault();
    
    // Collect form data
    const fields = { 
        name,           // "John Doe"
        rollNum,        // 101
        password,       // "student123"
        sclassName: classID,  // Reference to class
        adminID         // Reference to school/admin
    };
    
    // Dispatch Redux action
    dispatch(registerUser(fields, "Student"));
};
```

#### Redux Action

**File:** `frontend/src/redux/userRelated/userHandle.js`

```javascript
export const registerUser = (fields, role) => async (dispatch) => {
    dispatch(authRequest());
    
    try {
        // POST to /StudentReg endpoint
        const result = await axios.post(`${baseURL}/${role}Reg`, fields);
        dispatch(authSuccess(result.data));
    } catch (error) {
        dispatch(authError(error.message));
    }
};
```

#### Backend Controller

**File:** `backend/controllers/student_controller.js`

```javascript
const studentRegister = async (req, res) => {
    try {
        // 1. Hash the password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        // 2. Create new student object
        const student = new Student({
            ...req.body,
            school: req.body.adminID,
            password: hashedPass
        });

        // 3. Check if roll number already exists in this class
        const existingStudent = await Student.findOne({
            rollNum: req.body.rollNum,
            school: req.body.adminID,
            sclassName: req.body.sclassName,
        });

        if (existingStudent) {
            res.send({ message: 'Roll Number already exists' });
        } else {
            // 4. Save to database
            let result = await student.save();
            result.password = undefined;  // Don't send password back
            res.send(result);
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
```

### READ: Fetching Students List

```
USER ACTION: Admin navigates to "Students" page
```

#### Frontend Component Loads Data

**File:** `frontend/src/pages/admin/studentRelated/ShowStudents.js`

```javascript
// Called when component mounts
useEffect(() => {
    dispatch(getAllStudents(currentUser._id));  // Fetch all students for this admin
}, []);
```

#### Redux Action

**File:** `frontend/src/redux/studentRelated/studentHandle.js`

```javascript
export const getAllStudents = (id) => async (dispatch) => {
    dispatch(getRequest());  // Set loading state
    
    try {
        // GET request: /Students/{adminId}
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/Students/${id}`);
        
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));  // Store students in Redux
        }
    } catch (error) {
        dispatch(getError(error));
    }
};
```

#### Backend Controller

**File:** `backend/controllers/student_controller.js`

```javascript
const getStudents = async (req, res) => {
    try {
        // Find all students belonging to this school
        // Populate "sclassName" to get class details instead of just ID
        let students = await Student.find({ school: req.params.id })
            .populate("sclassName", "sclassName");
        
        if (students.length > 0) {
            // Remove passwords from response
            let modifiedStudents = students.map((student) => {
                return { ...student._doc, password: undefined };
            });
            res.send(modifiedStudents);
        } else {
            res.send({ message: "No students found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};
```

### UPDATE: Modifying Student Data

```
USER ACTION: Admin edits student info and saves
```

#### Frontend Submission

```javascript
// Dispatch update action with student ID and new data
dispatch(updateStudentFields(studentId, { name: newName, rollNum: newRollNum }));
```

#### Backend Controller

**File:** `backend/controllers/student_controller.js`

```javascript
const updateStudent = async (req, res) => {
    try {
        // Find student by ID and update with new data
        let result = await Student.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },  // Update with request body fields
            { new: true }        // Return updated document
        );

        result.password = undefined;
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};
```

### DELETE: Removing a Student

```
USER ACTION: Admin clicks delete button on student row
```

#### Frontend Handler

**File:** `frontend/src/pages/admin/studentRelated/ShowStudents.js`

```javascript
const deleteHandler = (studentId) => {
    // Dispatch delete action
    dispatch(deleteUser(studentId, "Student"));
    
    // Refresh the list after deletion
    dispatch(getAllStudents(currentUser._id));
};
```

#### Backend Controller

**File:** `backend/controllers/student_controller.js`

```javascript
const deleteStudent = async (req, res) => {
    try {
        // Find and delete student by ID
        const result = await Student.findByIdAndDelete(req.params.id);
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};
```

### Visual Flow: CRUD Operations

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CRUD OPERATIONS                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  CREATE                  READ                                        │
│  ┌─────────┐            ┌─────────┐                                 │
│  │ [Form]  │            │ List    │                                 │
│  │ Name    │            │ ┌─────┐ │                                 │
│  │ Roll    │            │ │John │ │                                 │
│  │ Class   │            │ │Jane │ │                                 │
│  │ [Save]  │            │ │Bob  │ │                                 │
│  └────┬────┘            │ └─────┘ │                                 │
│       │                 └────┬────┘                                 │
│       ▼                      ▼                                       │
│  POST /StudentReg      GET /Students/:id                            │
│       │                      │                                       │
│       ▼                      ▼                                       │
│  Student.save()        Student.find()                               │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  UPDATE                  DELETE                                      │
│  ┌─────────┐            ┌─────────┐                                 │
│  │ [Edit]  │            │ List    │                                 │
│  │ Name:   │            │ ┌─────────────────┐                       │
│  │ John ►  │            │ │John  [🗑 Delete]│                       │
│  │ Johnny  │            │ │Jane  [🗑 Delete]│                       │
│  │ [Save]  │            │ └─────────────────┘                       │
│  └────┬────┘            └────────┬──────────┘                       │
│       │                          │                                   │
│       ▼                          ▼                                   │
│  PUT /Student/:id        DELETE /Student/:id                        │
│       │                          │                                   │
│       ▼                          ▼                                   │
│  findByIdAndUpdate()     findByIdAndDelete()                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## How Attendance Tracking Works

Attendance is stored inside each student document as an array of attendance records.

### Recording Attendance

```
USER ACTION: Teacher selects students present/absent and submits
```

#### Data Structure

Each student has an `attendance` array embedded in their document:

```javascript
// Student document structure
{
    _id: "64c345...",
    name: "John Doe",
    attendance: [
        {
            date: "2024-01-15",
            status: "Present",
            subName: "64d456..."  // Reference to subject
        },
        {
            date: "2024-01-16",
            status: "Absent",
            subName: "64d456..."
        }
    ]
}
```

#### Backend: Adding Attendance

**File:** `backend/controllers/student_controller.js`

```javascript
const studentAttendance = async (req, res) => {
    const { subName, status, date } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        // Check if attendance already exists for this date and subject
        const existingAttendance = student.attendance.find(
            (a) => a.date.toDateString() === new Date(date).toDateString()
                && a.subName.toString() === subName
        );

        if (existingAttendance) {
            // Update existing record
            existingAttendance.status = status;
        } else {
            // Add new attendance record to array
            student.attendance.push({ date, status, subName });
        }

        // Save the updated student document
        const result = await student.save();
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};
```

### Calculating Attendance Percentage

**File:** `frontend/src/pages/student/ViewStdAttendance.js`

```javascript
// Calculate overall attendance percentage
const calculateOverallAttendancePercentage = (attendanceData) => {
    // Count total present days
    let totalPresent = 0;
    
    attendanceData.forEach((subject) => {
        subject.attendance.forEach((record) => {
            if (record.status === "Present") {
                totalPresent++;
            }
        });
    });
    
    // Calculate percentage
    const totalDays = attendanceData.reduce((sum, subj) => sum + subj.attendance.length, 0);
    return totalDays > 0 ? (totalPresent / totalDays) * 100 : 0;
};
```

---

## How Exam Results Are Updated

Exam results are stored in each student's `examResult` array.

### Data Structure

```javascript
// Student document
{
    _id: "64c345...",
    name: "John Doe",
    examResult: [
        {
            subName: "64d456...",  // Math subject ID
            marksObtained: 85
        },
        {
            subName: "64d567...",  // Science subject ID
            marksObtained: 92
        }
    ]
}
```

### Backend: Updating Marks

**File:** `backend/controllers/student_controller.js`

```javascript
const updateExamResult = async (req, res) => {
    const { subName, marksObtained } = req.body;

    try {
        const student = await Student.findById(req.params.id);

        // Check if result exists for this subject
        const existingResult = student.examResult.find(
            (result) => result.subName.toString() === subName
        );

        if (existingResult) {
            // Update existing mark
            existingResult.marksObtained = marksObtained;
        } else {
            // Add new subject result
            student.examResult.push({ subName, marksObtained });
        }

        const result = await student.save();
        res.send(result);
    } catch (error) {
        res.status(500).json(error);
    }
};
```

---

## How Notices Work

Notices are announcements posted by admins and visible to all users in the school.

### Creating a Notice

**File:** `backend/controllers/notice-controller.js`

```javascript
const noticeCreate = async (req, res) => {
    try {
        // Create new notice with school reference
        const notice = new Notice({
            ...req.body,
            school: req.body.adminID
        });
        
        const result = await notice.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};
```

### Fetching Notices (Role-Based)

**File:** `frontend/src/components/SeeNotice.js`

```javascript
useEffect(() => {
    if (currentRole === "Admin") {
        // Admin fetches by their own ID
        dispatch(getAllNotices(currentUser._id, "Notice"));
    } else {
        // Students/Teachers fetch by school ID
        dispatch(getAllNotices(currentUser.school._id, "Notice"));
    }
}, []);
```

---

## How Complaints Work

Students and teachers can submit complaints that admins can view.

### Submitting a Complaint

**File:** `backend/controllers/complain-controller.js`

```javascript
const complainCreate = async (req, res) => {
    try {
        const complain = new Complain(req.body);
        const result = await complain.save();
        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};
```

### Data Flow Diagram

```
┌───────────────────┐
│  Student/Teacher  │
│  Complaint Form   │
│  ┌─────────────┐  │
│  │ Complaint:  │  │
│  │ "AC broken" │  │
│  │ [Submit]    │──┼─────────────────────────────────────┐
│  └─────────────┘  │                                     │
└───────────────────┘                                     │
                                                          ▼
                                           POST /ComplainCreate
                                           {
                                             user: studentId,
                                             complaint: "AC broken",
                                             date: "2024-01-15",
                                             school: adminId
                                           }
                                                          │
                                                          ▼
                                           ┌──────────────────────┐
                                           │  Complain.save()     │
                                           │  MongoDB             │
                                           └──────────────────────┘
                                                          │
                                                          ▼
┌───────────────────┐                      ┌──────────────────────┐
│  Admin Dashboard  │◄─────────────────────│  GET /ComplainList   │
│  Complaints Tab   │                      │  Returns all         │
│  ┌─────────────┐  │                      │  complaints          │
│  │ AC broken   │  │                      └──────────────────────┘
│  │ Jan 15      │  │
│  └─────────────┘  │
└───────────────────┘
```

---

## Redux State Management Flow

Redux is the "brain" that keeps track of all data on the frontend.

### How Redux Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REDUX STORE                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                          STATE                                       │    │
│  │  {                                                                   │    │
│  │    user: { currentUser: {...}, currentRole: "Admin" },              │    │
│  │    student: { studentsList: [...], loading: false },                │    │
│  │    teacher: { teachersList: [...] },                                │    │
│  │    sclass: { sclassesList: [...] },                                 │    │
│  │    notice: { noticesList: [...] }                                   │    │
│  │  }                                                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ▲                                         │
│                                    │                                         │
│                              ┌─────┴─────┐                                   │
│                              │  REDUCERS │                                   │
│                              │  (Slices) │                                   │
│                              └─────▲─────┘                                   │
│                                    │                                         │
│                              ┌─────┴─────┐                                   │
│                              │  ACTIONS  │                                   │
│                              │ (Thunks)  │                                   │
│                              └─────▲─────┘                                   │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     │ dispatch(action)
                                     │
┌────────────────────────────────────┼────────────────────────────────────────┐
│                           REACT COMPONENTS                                   │
│                                    │                                         │
│  ┌─────────────────────────────────┴─────────────────────────────────────┐  │
│  │                                                                        │  │
│  │  // Access state with useSelector                                     │  │
│  │  const { studentsList } = useSelector((state) => state.student);     │  │
│  │                                                                        │  │
│  │  // Trigger actions with useDispatch                                  │  │
│  │  const dispatch = useDispatch();                                      │  │
│  │  dispatch(getAllStudents(adminId));                                   │  │
│  │                                                                        │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Redux Slice Example

**File:** `frontend/src/redux/studentRelated/studentSlice.js`

```javascript
const studentSlice = createSlice({
    name: 'student',
    initialState: {
        studentsList: [],
        loading: false,
        error: null
    },
    reducers: {
        // Action: Start loading
        getRequest: (state) => {
            state.loading = true;
        },
        
        // Action: Successfully loaded students
        getSuccess: (state, action) => {
            state.studentsList = action.payload;  // Store the data
            state.loading = false;
        },
        
        // Action: Error occurred
        getError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});
```

---

## Quick Reference: Function Mapping

| User Action | Frontend Function | API Endpoint | Backend Controller |
|-------------|-------------------|--------------|-------------------|
| Admin Login | `loginUser()` | POST `/AdminLogin` | `adminLogIn()` |
| Student Login | `loginUser()` | POST `/StudentLogin` | `studentLogIn()` |
| Register Student | `registerUser()` | POST `/StudentReg` | `studentRegister()` |
| Get All Students | `getAllStudents()` | GET `/Students/:id` | `getStudents()` |
| Update Student | `updateStudentFields()` | PUT `/Student/:id` | `updateStudent()` |
| Delete Student | `deleteUser()` | DELETE `/Student/:id` | `deleteStudent()` |
| Mark Attendance | `updateStudentFields()` | PUT `/StudentAttendance/:id` | `studentAttendance()` |
| Update Marks | `updateStudentFields()` | PUT `/UpdateExamResult/:id` | `updateExamResult()` |
| Create Notice | `createNotice()` | POST `/NoticeCreate` | `noticeCreate()` |
| Get Notices | `getAllNotices()` | GET `/NoticeList/:id` | `noticeList()` |
| Submit Complaint | `createComplaint()` | POST `/ComplainCreate` | `complainCreate()` |

---

## Summary

1. **User interacts** with React components (buttons, forms)
2. **Redux actions** are dispatched to handle the interaction
3. **Axios** sends HTTP requests to the Express backend
4. **Express routes** direct requests to appropriate controllers
5. **Controllers** process logic and query MongoDB via Mongoose
6. **MongoDB** stores/retrieves data in collections
7. **Response** flows back through the chain
8. **Redux state** is updated with new data
9. **React components** re-render to show updated information

This cycle repeats for every user interaction, creating a seamless, reactive user experience!
