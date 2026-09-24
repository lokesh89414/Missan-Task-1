# LeaveFlow – Employee Leave Request Portal

## 1. Project Title

**LeaveFlow** – Employee Leave Request Application

---

## 2. Objective

Build a simple, clean Employee Leave Request Application that allows an employee to enter their leave details, applies defined business rules, and clearly shows whether the request is **Accepted**, **Rejected**, or identified as **Emergency Leave**.

This is a **frontend-only** assessment implementation built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no libraries, no dependencies.

---

## 3. Features

- Submit a leave request with employee details and leave type
- Real-time inline validation with clear error messages
- Business-rule evaluation based on leave type
- Clear result card showing Accepted / Rejected / Emergency Leave
- Reset button to return the application to its initial state
- Responsive layout that works on desktop and mobile
- No external dependencies — runs by opening `index.html` directly in any browser

---

## 4. Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and accessible form markup |
| CSS3 | Design tokens, layout, status-driven theming |
| Vanilla JavaScript (ES6+) | Validation logic, business rules, DOM updates |

**No frameworks, no libraries, no backend, no build step required.**

---

## 5. Project Structure

```
employee-leave-request/
├── index.html    ← Application shell and form markup
├── style.css     ← Design tokens, layout, component and state styles
├── script.js     ← Validation, business logic, result display
└── README.md     ← This file
```

---

## 6. How to Run

1. Download or clone the project folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).
3. No installation, no build step, no server required.

---

## 7. Business Rules

| Leave Type | Rule |
|---|---|
| **Annual Leave** | Request is **Accepted** only if `requestedDays <= leaveBalance`. Otherwise **Rejected** with the reason. |
| **Sick Leave** | Always **Accepted**, even if the annual leave balance is zero or insufficient. |
| **Emergency Leave** | Always accepted and clearly identified as **Emergency Leave Accepted** in the result. |

Additional rules:
- Requested days must be **greater than 0**.
- Available leave balance **cannot be negative**.

---

## 8. Validation Rules

| Field | Rule |
|---|---|
| Employee Name | Must not be empty |
| Employee ID | Must not be empty |
| Leave Type | Must be one of: Annual Leave, Sick Leave, Emergency Leave |
| Available Leave Balance | Must not be empty; must be a number; must be ≥ 0 |
| Number of Days Requested | Must not be empty; must be a number; must be > 0 |

Errors are displayed **inline**, directly below the relevant field. The first field with an error receives focus. Business rules are **not evaluated** until all validation passes.

---

## 9. Test Cases and Expected Results

| # | Employee | ID | Leave Type | Balance | Requested | Expected Result |
|---|---|---|---|---|---|---|
| 1 | Arun | EMP001 | Annual Leave | 5 | 3 | ✔ ACCEPTED |
| 2 | Arun | EMP001 | Annual Leave | 2 | 4 | ✖ REJECTED – insufficient balance |
| 3 | Lokesh | EMP002 | Sick Leave | 0 | 3 | ✔ ACCEPTED |
| 4 | Lokesh | EMP002 | Emergency Leave | 0 | 2 | ⚠ EMERGENCY LEAVE ACCEPTED |
| 5 | *(empty)* | EMP001 | Annual Leave | 5 | 3 | Validation error – name required |
| 6 | Arun | *(empty)* | Annual Leave | 5 | 3 | Validation error – ID required |
| 7 | Arun | EMP001 | *(none)* | 5 | 3 | Validation error – leave type required |
| 8 | Arun | EMP001 | Annual Leave | -1 | 3 | Validation error – balance cannot be negative |
| 9 | Arun | EMP001 | Annual Leave | 5 | 0 | Validation error – days must be > 0 |
| 10 | Arun | EMP001 | Annual Leave | 5 | -2 | Validation error – days must be > 0 |
| 11 | Arun | EMP001 | Annual Leave | 3 | 3 | ✔ ACCEPTED (boundary: equal is accepted) |
| 12 | Arun | EMP001 | Annual Leave | 3 | 4 | ✖ REJECTED |

---

## 10. Implementation Approach

The application is structured around three clearly separated phases:

```
validateInput()
      ↓
evaluateLeaveRequest()
      ↓
displayResult()
```

### validateInput(data)
Checks all form fields for presence, type, and range. Returns `{ valid, errors }`. If any check fails, inline errors are shown and the business-rule phase is **not reached**.

### evaluateLeaveRequest(leaveType, leaveBalance, requestedDays)
Pure logic function — receives cleaned numeric values and a leave type string. Applies the business rules and returns `{ status, message }` with no side effects on the DOM.

### displayResult(data, evaluation)
Reads the evaluation result and updates the result card. A `data-status` attribute on the card (`accepted`, `rejected`, `emergency`) drives all colour theming through CSS, keeping JS free of style logic.

The Reset button clears inputs, errors, and the result card in one step, returning the app to its initial state.

---

*Frontend-only assessment implementation — HTML, CSS, and vanilla JavaScript.*
