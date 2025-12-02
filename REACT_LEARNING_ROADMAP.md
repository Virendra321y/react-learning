# React Learning Roadmap

## Phase 1: React Fundamentals (Week 1-2)

### 1.1 JSX & Basic Syntax
- [ ] Understand JSX and how it compiles to JavaScript
- [ ] JSX syntax rules and expressions
- [ ] Conditional rendering (if/else, ternary, &&)
- [ ] List rendering with `.map()`
- **Practice**: Create a simple todo list display

### 1.2 Components
- [ ] Functional Components basics
- [ ] Component props and prop types
- [ ] Props destructuring
- [ ] Default props
- [ ] PropTypes validation
- **Practice**: Build a reusable Card, Button, Header component

### 1.3 Component Composition
- [ ] Parent-child component relationships
- [ ] Component nesting
- [ ] Prop drilling concept
- **Practice**: Create a layout component with multiple children

---

## Phase 2: State & Hooks (Week 3-4)

### 2.1 useState Hook
- [ ] Understanding state in functional components
- [ ] Basic useState usage
- [ ] Multiple state variables
- [ ] State immutability
- [ ] Updating state based on previous state
- **Practice**: Build a counter app with increment/decrement

### 2.2 useEffect Hook
- [ ] Component lifecycle in functional components
- [ ] useEffect dependency array
- [ ] Running effects on mount/unmount
- [ ] Cleanup functions (subscriptions, timers)
- [ ] Multiple useEffect hooks
- **Practice**: Fetch data on component mount, manage timers

### 2.3 Other Essential Hooks
- [ ] useContext for prop drilling avoidance
- [ ] useRef for DOM access
- [ ] useReducer for complex state management
- **Practice**: Implement a theme switcher with useContext

---

## Phase 3: Forms & Input Handling (Week 5-6)

### 3.1 Form Basics
- [ ] Controlled components
- [ ] Uncontrolled components
- [ ] Input value binding
- [ ] onChange event handling
- [ ] Form submission handling
- **Practice**: Build a simple login form

### 3.2 Form Validation
- [ ] Client-side validation
- [ ] Real-time validation feedback
- [ ] Error message display
- [ ] Form field states (touched, dirty, pristine)
- [ ] Validation libraries (React Hook Form, Formik)
- **Practice**: Email, password, and custom validations

### 3.3 Advanced Form Handling
- [ ] Multi-step forms
- [ ] File uploads
- [ ] Dynamic form fields
- [ ] Form reset and initial values
- [ ] Form serialization
- **Practice**: Create a multi-step registration form

### 3.4 Popular Form Libraries
- [ ] **React Hook Form** - Modern, performant approach
- [ ] **Formik** - Complete form management solution
- [ ] Features comparison and use cases

---

## Phase 4: API Calls & Data Fetching (Week 7-8)

### 4.1 Basic API Calls
- [ ] Fetch API basics
- [ ] axios vs fetch
- [ ] GET requests
- [ ] POST, PUT, DELETE requests
- [ ] Request headers and authentication
- **Practice**: Fetch data from public API (JSONPlaceholder, OpenWeather)

### 4.2 Error Handling
- [ ] Try-catch in async functions
- [ ] Error status codes handling
- [ ] User-friendly error messages
- [ ] Retry logic
- [ ] Timeout handling
- **Practice**: Handle network errors gracefully

### 4.3 Loading States
- [ ] Loading spinners/skeleton screens
- [ ] Disable buttons during requests
- [ ] Show/hide loading indicators
- **Practice**: Implement loading UI for API calls

### 4.4 API Validation & Response Handling
- [ ] Validate API response structure
- [ ] Schema validation (Zod, Yup, Joi)
- [ ] Transform API responses
- [ ] Handle unexpected data formats
- [ ] Type safety with TypeScript (if using)
- **Practice**: Validate and transform complex API responses

---

## Phase 5: Custom Hooks (Week 9)

### 5.1 Creating Custom Hooks
- [ ] Hook naming conventions (use prefix)
- [ ] Extracting component logic into hooks
- [ ] Sharing stateful logic
- [ ] Hook rules and best practices
- **Practice**: Create useFetch custom hook

### 5.2 Common Custom Hooks
- [ ] **useFetch** - Handle API calls
- [ ] **useForm** - Form state management
- [ ] **useLocalStorage** - Persist data in localStorage
- [ ] **usePrevious** - Access previous props/state
- [ ] **useDebounce** - Debounce values
- [ ] **useThrottle** - Throttle functions
- **Practice**: Implement 3-4 custom hooks

### 5.3 Advanced Custom Hooks
- [ ] useCallback optimization
- [ ] useMemo optimization
- [ ] Custom hooks with TypeScript
- **Practice**: Performance-optimized custom hooks

---

## Phase 6: State Management (Week 10-11)

### 6.1 Context API
- [ ] createContext
- [ ] useContext hook
- [ ] Provider pattern
- [ ] Context for theme, auth, user data
- **Practice**: Implement global theme switcher

### 6.2 Redux (Optional but Recommended)
- [ ] Redux basics (actions, reducers, store)
- [ ] Redux Toolkit (modern approach)
- [ ] Selectors and subscriptions
- [ ] Middleware
- **Practice**: Manage complex application state

### 6.3 State Management Alternatives
- [ ] Zustand - Lightweight alternative
- [ ] Recoil - Facebook's state management
- [ ] MobX - Reactive programming

---

## Phase 7: API Validation Best Practices (Week 12)

### 7.1 Request Validation
- [ ] Validate input before sending
- [ ] Sanitize user inputs
- [ ] Rate limiting client-side
- [ ] CSRF protection awareness

### 7.2 Response Validation
- [ ] Zod schema validation
```javascript
const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});
```
- [ ] Type-safe responses
- [ ] Handling missing/extra fields
- [ ] Nested object validation

### 7.3 Error Handling Patterns
- [ ] Creating custom error boundaries
- [ ] Axios interceptors for errors
- [ ] Centralized error handling
- [ ] Logging and monitoring
- **Practice**: Implement error boundary component

---

## Phase 8: Complete Form & API Project (Week 13)

### 8.1 Project: User Management App
Build an application that combines all learned concepts:

**Features to Implement:**
1. **User List Page**
   - Fetch users from API
   - Display in table/list
   - Loading and error states
   - Pagination/infinite scroll

2. **Create User Form**
   - Form with validation
   - Submit to API
   - Success/error feedback
   - Form reset after submit

3. **Edit User Form**
   - Pre-populate form with existing data
   - Update API call
   - Validation

4. **Delete User**
   - Confirmation dialog
   - Delete API call
   - Optimistic updates

5. **Search & Filter**
   - Debounced search
   - Filter options
   - Apply multiple filters

6. **Form Validation**
   - Email format
   - Password strength
   - Name requirements
   - Custom validation rules

7. **API Integration**
   - Handle all HTTP methods
   - Error handling
   - Loading states
   - Authentication headers

---

## Learning Resources

### Documentation
- [React Official Docs](https://react.dev)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Formik Docs](https://formik.org/)
- [Zod Validation](https://zod.dev)

### Practice APIs
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Free fake API
- [OpenWeather API](https://openweathermap.org/api)
- [REST Countries API](https://restcountries.com/)
- [GitHub API](https://docs.github.com/en/rest)

### Tools & Libraries
- **Form Libraries**: React Hook Form, Formik
- **Validation**: Zod, Yup, Joi
- **HTTP Client**: Axios, Fetch API
- **State**: Redux Toolkit, Zustand, Context API

---

## Timeline & Milestones

| Week | Phase | Target |
|------|-------|--------|
| 1-2 | Fundamentals | Build basic component library |
| 3-4 | Hooks | Create counter & data fetcher |
| 5-6 | Forms | Build login & validation forms |
| 7-8 | API Calls | Fetch data with error handling |
| 9 | Custom Hooks | Create reusable hook utilities |
| 10-11 | State Mgmt | Implement global state |
| 12 | API Validation | Handle edge cases & errors |
| 13 | Capstone | Complete user management app |

---

## Practical Exercises

### Beginner
1. ✅ Create a counter with useState
2. ✅ Build a todo list with add/delete
3. ✅ Fetch and display posts from JSONPlaceholder
4. ✅ Create a form with basic validation

### Intermediate
1. ✅ Build custom useFetch hook
2. ✅ Create context-based theme switcher
3. ✅ Implement search with debouncing
4. ✅ Multi-step form wizard

### Advanced
1. ✅ API with full CRUD operations
2. ✅ Complex form validation with custom rules
3. ✅ Error boundary error handling
4. ✅ Optimistic updates
5. ✅ Pagination with API integration

---

## Checklist & Progress Tracking

Use this section to track your progress:

### Phase 1: Fundamentals
- [ ] JSX Syntax
- [ ] Functional Components
- [ ] Props & PropTypes
- [ ] Component Composition

### Phase 2: Hooks
- [ ] useState Hook
- [ ] useEffect Hook
- [ ] useContext Hook
- [ ] useRef & useReducer

### Phase 3: Forms
- [ ] Controlled Components
- [ ] Form Validation
- [ ] React Hook Form
- [ ] Multi-step Forms

### Phase 4: API Calls
- [ ] Fetch API
- [ ] Axios
- [ ] Error Handling
- [ ] Loading States

### Phase 5: Custom Hooks
- [ ] useFetch Hook
- [ ] useForm Hook
- [ ] useLocalStorage Hook
- [ ] useDebounce Hook

### Phase 6: State Management
- [ ] Context API
- [ ] Redux Toolkit
- [ ] Global State

### Phase 7: API Validation
- [ ] Request Validation
- [ ] Response Validation
- [ ] Error Boundaries
- [ ] Interceptors

### Phase 8: Capstone Project
- [ ] User Management App Complete

---

## Quick Start Commands

```bash
# Create new React project
npm create vite@latest my-app -- --template react

# Navigate to project
cd my-app

# Install dependencies
npm install

# Install additional packages
npm install axios react-hook-form zod zustand

# Start development server
npm run dev

# Build for production
npm run build
```

---

**Last Updated**: December 1, 2025  
**Status**: Ready to start learning! 🚀
