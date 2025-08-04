# Testing Guide

This document provides comprehensive testing instructions for the Website Idea Generator project, covering both automated and manual testing approaches.

## 🤖 Automated Testing

### Frontend Testing

#### Unit Tests (Jest + Testing Library)
```bash
# Run all unit tests
cd frontend
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### E2E Tests (Playwright)
```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI mode
npm run test:e2e:ui

# Run specific test file
npx playwright test homepage.spec.ts
```

### Backend Testing

#### Unit Tests (Jest)
```bash
# Run all unit tests
cd backend
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:cov

# Run tests with debugging
npm run test:debug
```

#### E2E Tests
```bash
# Run end-to-end tests
npm run test:e2e
```

### Docker Testing
```bash
# Test with Docker containers
docker-compose -f docker-compose.dev.yml up -d

# Run tests inside containers
docker-compose exec frontend npm test
docker-compose exec backend npm test
```

## 🧪 Manual Testing

### 1. Homepage Testing

#### Test Cases:
- [ ] **Page Load**: Homepage loads without errors
- [ ] **Title Display**: "Website Idea Generator" title is visible
- [ ] **Animated Suggestions**: Rotating prompt suggestions appear
- [ ] **Input Field**: Prompt input field is functional
- [ ] **Responsive Design**: Layout adapts to different screen sizes

#### Steps:
1. Navigate to `http://localhost:3000`
2. Verify page loads completely
3. Check that animated suggestions rotate every few seconds
4. Click on the input field and verify it focuses
5. Type a test prompt and verify text appears
6. Resize browser window to test responsiveness

### 2. Builder Workspace Testing

#### Test Cases:
- [ ] **Workspace Transition**: Smooth transition from homepage to workspace
- [ ] **Sidebar Display**: Prompt history sidebar is visible
- [ ] **Section Generation**: Prompts generate website sections
- [ ] **Preview Mode**: Toggle between sections and preview modes
- [ ] **Copy Functionality**: Copy all sections to clipboard
- [ ] **Delete Prompts**: Delete prompts from history

#### Steps:
1. Enter a prompt: "Create a modern bakery website"
2. Submit the prompt and wait for sections to generate
3. Verify 3 sections appear: Hero, About, Contact
4. Click "Preview" button and verify seamless website preview
5. Click "Copy All" and verify success toast appears
6. Test prompt history by creating multiple prompts
7. Delete a prompt and verify it's removed from sidebar

### 3. API Testing

#### Test Cases:
- [ ] **Generate Sections**: POST `/api/prompts/generate`
- [ ] **Get History**: GET `/api/prompts/history`
- [ ] **Get Prompt**: GET `/api/prompts/:id`
- [ ] **Delete Prompt**: DELETE `/api/prompts/:id`
- [ ] **Health Check**: GET `/api/health`

#### Manual API Testing:
```bash
# Test section generation
curl -X POST http://localhost:3001/api/prompts/generate \
  -H "Content-Type: application/json" \
  -d '{"text":"Create a bakery website","sessionId":"test-session"}'

# Test prompt history
curl "http://localhost:3001/api/prompts/history?sessionId=test-session"

# Test health endpoint
curl http://localhost:3001/api/health
```

### 4. Error Handling Testing

#### Test Cases:
- [ ] **Network Errors**: Test with backend offline
- [ ] **Invalid Input**: Submit empty or invalid prompts
- [ ] **Database Errors**: Test with MongoDB disconnected
- [ ] **Rate Limiting**: Test rapid successive requests

#### Steps:
1. Stop backend server and try generating sections
2. Submit empty prompt and verify error handling
3. Test with very long prompts (>1000 characters)
4. Submit multiple requests rapidly

### 5. Browser Compatibility Testing

#### Test Browsers:
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)
- [ ] **Safari** (latest)
- [ ] **Edge** (latest)

#### Test Features:
- [ ] Basic functionality works in all browsers
- [ ] Animations render correctly
- [ ] Clipboard API works (or shows fallback)
- [ ] Local storage persists data

### 6. Mobile Testing

#### Test Devices:
- [ ] **iPhone** (Safari)
- [ ] **Android** (Chrome)
- [ ] **Tablet** (iPad/Android)

#### Test Cases:
- [ ] **Touch Interactions**: Tap, scroll, swipe work correctly
- [ ] **Responsive Layout**: UI adapts to mobile screens
- [ ] **Performance**: App loads quickly on mobile
- [ ] **Keyboard**: Virtual keyboard doesn't break layout

### 7. Performance Testing

#### Test Cases:
- [ ] **Page Load Speed**: < 3 seconds initial load
- [ ] **Section Generation**: < 5 seconds to generate sections
- [ ] **Memory Usage**: No memory leaks during extended use
- [ ] **Network Usage**: Reasonable API payload sizes

#### Tools:
- Chrome DevTools Performance tab
- Lighthouse audit
- Network tab for API monitoring

### 8. Accessibility Testing

#### Test Cases:
- [ ] **Keyboard Navigation**: All features accessible via keyboard
- [ ] **Screen Reader**: Works with screen reader software
- [ ] **Color Contrast**: Meets WCAG guidelines
- [ ] **Focus Indicators**: Clear focus states for all interactive elements

#### Tools:
- Chrome DevTools Accessibility audit
- axe-core browser extension
- WAVE accessibility checker

## 🐛 Bug Reporting

When reporting bugs, include:

1. **Environment**: Browser, OS, device type
2. **Steps to Reproduce**: Detailed step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots/Videos**: Visual evidence of the issue
6. **Console Logs**: Any error messages in browser console

## 📊 Test Coverage Goals

- **Frontend Unit Tests**: > 80% coverage
- **Backend Unit Tests**: > 85% coverage
- **E2E Test Coverage**: All critical user flows
- **Manual Test Coverage**: All major features and edge cases

## 🔄 Continuous Testing

### Pre-commit Testing
```bash
# Run linting and unit tests before committing
npm run lint
npm test
```

### CI/CD Pipeline Testing
- Unit tests run on every pull request
- E2E tests run on staging deployments
- Performance tests run on production deployments

## 📝 Test Maintenance

- Review and update tests when adding new features
- Remove or update obsolete tests
- Keep test data and mocks up to date
- Regular test environment cleanup

---

For questions about testing, please refer to the development team or create an issue in the project repository.
