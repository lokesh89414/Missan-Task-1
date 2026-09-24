/**
 * LeaveFlow – script.js
 * Employee Leave Request Application
 *
 * Flow:
 *   validateInput()  →  evaluateLeaveRequest()  →  displayResult()
 *
 * All DOM references are collected once at the top.
 * Validation is kept separate from business-rule logic.
 */

'use strict';

/* ============================================================
   1. DOM REFERENCES
   ============================================================ */

const form          = document.getElementById('leaveForm');
const resetBtn      = document.getElementById('resetBtn');
const resultCard    = document.getElementById('resultCard');

// Input fields
const fieldEmployeeName = document.getElementById('employeeName');
const fieldEmployeeId   = document.getElementById('employeeId');
const fieldLeaveType    = document.getElementById('leaveType');
const fieldLeaveBalance = document.getElementById('leaveBalance');
const fieldRequestedDays= document.getElementById('requestedDays');

// Inline error spans
const errorEmployeeName = document.getElementById('employeeName-error');
const errorEmployeeId   = document.getElementById('employeeId-error');
const errorLeaveType    = document.getElementById('leaveType-error');
const errorLeaveBalance = document.getElementById('leaveBalance-error');
const errorRequestedDays= document.getElementById('requestedDays-error');

// Result card elements
const resultBadge    = document.getElementById('resultBadge');
const resultName     = document.getElementById('resultName');
const resultId       = document.getElementById('resultId');
const resultLeaveType= document.getElementById('resultLeaveType');
const resultBalance  = document.getElementById('resultBalance');
const resultRequested= document.getElementById('resultRequested');
const resultReason   = document.getElementById('resultReason');


/* ============================================================
   2. VALIDATION
   Checks all inputs for presence and correctness.
   Returns { valid: boolean, errors: { fieldId: message } }
   ============================================================ */

/**
 * Validates the form inputs.
 * Does NOT apply any business rules — only checks that values exist and are
 * of the correct type and range.
 *
 * @param {object} data  Raw string values from the form fields.
 * @returns {{ valid: boolean, errors: object }}
 */
function validateInput(data) {
  const errors = {};

  // --- Employee Name ---
  if (!data.employeeName.trim()) {
    errors.employeeName = 'Employee Name is required.';
  }

  // --- Employee ID ---
  if (!data.employeeId.trim()) {
    errors.employeeId = 'Employee ID is required.';
  }

  // --- Leave Type ---
  const validLeaveTypes = ['annual', 'sick', 'emergency'];
  if (!validLeaveTypes.includes(data.leaveType)) {
    errors.leaveType = 'Please select a Leave Type.';
  }

  // --- Available Leave Balance ---
  if (data.leaveBalance === '') {
    errors.leaveBalance = 'Leave Balance is required.';
  } else if (isNaN(Number(data.leaveBalance))) {
    errors.leaveBalance = 'Leave Balance must be a number.';
  } else if (Number(data.leaveBalance) < 0) {
    errors.leaveBalance = 'Leave Balance cannot be negative.';
  }

  // --- Requested Days ---
  if (data.requestedDays === '') {
    errors.requestedDays = 'Number of Days Requested is required.';
  } else if (isNaN(Number(data.requestedDays))) {
    errors.requestedDays = 'Requested Days must be a number.';
  } else if (Number(data.requestedDays) <= 0) {
    errors.requestedDays = 'Requested Days must be greater than 0.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}


/* ============================================================
   3. BUSINESS RULES
   Evaluates the leave request according to leave-type rules.
   Called ONLY after validateInput() returns valid = true.
   Returns { status: 'accepted'|'rejected'|'emergency', message: string }
   ============================================================ */

/**
 * Applies leave-type business rules to produce a result.
 *
 * Business rules:
 *   - Annual Leave:   rejected if requestedDays > leaveBalance
 *   - Sick Leave:     always accepted (even if balance is zero)
 *   - Emergency Leave:always accepted, clearly identified as emergency
 *
 * @param {string} leaveType     'annual' | 'sick' | 'emergency'
 * @param {number} leaveBalance  Available leave balance in days
 * @param {number} requestedDays Number of days requested
 * @returns {{ status: string, message: string }}
 */
function evaluateLeaveRequest(leaveType, leaveBalance, requestedDays) {

  if (leaveType === 'annual') {
    // Annual leave: requested days must NOT exceed available balance
    if (requestedDays > leaveBalance) {
      return {
        status: 'rejected',
        message: `Requested ${requestedDays} day(s), but only ${leaveBalance} day(s) are available. ` +
                 `Annual Leave requires sufficient leave balance.`
      };
    }
    return {
      status: 'accepted',
      message: 'Requested days are within the available leave balance.'
    };
  }

  if (leaveType === 'sick') {
    // Sick leave can always be submitted regardless of annual balance
    return {
      status: 'accepted',
      message: 'Sick Leave can be submitted even when annual leave balance is insufficient.'
    };
  }

  if (leaveType === 'emergency') {
    // Emergency leave is always accepted and clearly identified
    return {
      status: 'emergency',
      message: 'This request has been identified as Emergency Leave and has been accepted.'
    };
  }

  // Fallback — should not be reachable after validation
  return {
    status: 'rejected',
    message: 'Unknown leave type. Please select a valid leave type.'
  };
}


/* ============================================================
   4. DISPLAY HELPERS
   ============================================================ */

/**
 * Maps a leave type value to a human-readable label.
 * @param {string} leaveType
 * @returns {string}
 */
function leaveTypeLabel(leaveType) {
  const labels = {
    annual:    'Annual Leave',
    sick:      'Sick Leave',
    emergency: 'Emergency Leave'
  };
  return labels[leaveType] || leaveType;
}

/**
 * Returns badge text and CSS class based on evaluation status.
 * @param {string} status  'accepted' | 'rejected' | 'emergency'
 * @returns {{ text: string, cssClass: string }}
 */
function getBadgeConfig(status) {
  const configs = {
    accepted:  { text: '✔ Accepted',                   cssClass: 'badge-accepted'  },
    rejected:  { text: '✖ Rejected',                   cssClass: 'badge-rejected'  },
    emergency: { text: '⚠ Emergency Leave Accepted',   cssClass: 'badge-emergency' }
  };
  return configs[status] || configs.rejected;
}

/**
 * Renders the result card with the given form data and evaluation result.
 * @param {object} data        Cleaned form data values
 * @param {object} evaluation  Result from evaluateLeaveRequest()
 */
function displayResult(data, evaluation) {
  const badge = getBadgeConfig(evaluation.status);

  // Set the data-status attribute → drives CSS colour theming
  resultCard.dataset.status = evaluation.status;

  // Badge
  resultBadge.textContent = badge.text;
  resultBadge.className   = `result-badge ${badge.cssClass}`;

  // Summary rows
  resultName.textContent      = data.employeeName.trim();
  resultId.textContent        = data.employeeId.trim();
  resultLeaveType.textContent = leaveTypeLabel(data.leaveType);
  resultBalance.textContent   = `${data.leaveBalance} day(s)`;
  resultRequested.textContent = `${data.requestedDays} day(s)`;
  resultReason.textContent    = evaluation.message;

  // Show the card
  resultCard.hidden = false;

  // Scroll result into view smoothly so the user sees it
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hides the result card and clears its previous content.
 */
function clearResult() {
  resultCard.hidden = true;
  resultCard.removeAttribute('data-status');
  resultBadge.textContent      = '';
  resultBadge.className        = 'result-badge';
  resultName.textContent       = '';
  resultId.textContent         = '';
  resultLeaveType.textContent  = '';
  resultBalance.textContent    = '';
  resultRequested.textContent  = '';
  resultReason.textContent     = '';
}


/* ============================================================
   5. INLINE ERROR DISPLAY
   ============================================================ */

/** Map of field ID → { errorEl, inputEl } for easy iteration */
const fieldMap = {
  employeeName:  { errorEl: errorEmployeeName,  inputEl: fieldEmployeeName },
  employeeId:    { errorEl: errorEmployeeId,    inputEl: fieldEmployeeId   },
  leaveType:     { errorEl: errorLeaveType,     inputEl: fieldLeaveType    },
  leaveBalance:  { errorEl: errorLeaveBalance,  inputEl: fieldLeaveBalance },
  requestedDays: { errorEl: errorRequestedDays, inputEl: fieldRequestedDays }
};

/**
 * Shows inline validation errors next to their respective fields.
 * @param {object} errors  { fieldId: errorMessage }
 */
function showErrors(errors) {
  // First clear all previous errors
  clearErrors();

  for (const [fieldId, message] of Object.entries(errors)) {
    const field = fieldMap[fieldId];
    if (!field) continue;

    field.errorEl.textContent = message;
    field.inputEl.classList.add('input-error');
    field.inputEl.setAttribute('aria-invalid', 'true');
  }

  // Focus the first field that has an error for accessibility
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField && fieldMap[firstErrorField]) {
    fieldMap[firstErrorField].inputEl.focus();
  }
}

/**
 * Clears all inline error messages and error styling from every field.
 */
function clearErrors() {
  for (const { errorEl, inputEl } of Object.values(fieldMap)) {
    errorEl.textContent = '';
    inputEl.classList.remove('input-error');
    inputEl.removeAttribute('aria-invalid');
  }
}


/* ============================================================
   6. FORM SUBMISSION HANDLER
   ============================================================ */

form.addEventListener('submit', function handleSubmit(event) {
  event.preventDefault();

  // --- Collect raw string values from the form ---
  const data = {
    employeeName:  fieldEmployeeName.value,
    employeeId:    fieldEmployeeId.value,
    leaveType:     fieldLeaveType.value,
    leaveBalance:  fieldLeaveBalance.value,
    requestedDays: fieldRequestedDays.value
  };

  // --- Phase 1: Validate input ---
  const { valid, errors } = validateInput(data);

  if (!valid) {
    // Show errors and stop — do NOT proceed to business rules
    showErrors(errors);
    clearResult();
    return;
  }

  // Input is valid — clear any previous errors
  clearErrors();

  // Convert numeric strings to numbers for business-rule evaluation
  const leaveBalance  = Number(data.leaveBalance);
  const requestedDays = Number(data.requestedDays);

  // --- Phase 2: Apply business rules ---
  const evaluation = evaluateLeaveRequest(data.leaveType, leaveBalance, requestedDays);

  // --- Phase 3: Display result ---
  displayResult(data, evaluation);
});


/* ============================================================
   7. RESET HANDLER
   ============================================================ */

resetBtn.addEventListener('click', function handleReset() {
  // Reset HTML form (clears all inputs and selects)
  form.reset();

  // Clear inline errors
  clearErrors();

  // Hide the result card
  clearResult();

  // Return focus to the first input for usability
  fieldEmployeeName.focus();
});


/* ============================================================
   8. CLEAR FIELD ERROR ON USER INPUT
   Removes the error highlight as soon as the user starts correcting a field.
   ============================================================ */

for (const [fieldId, { inputEl, errorEl }] of Object.entries(fieldMap)) {
  inputEl.addEventListener('input', function () {
    errorEl.textContent = '';
    inputEl.classList.remove('input-error');
    inputEl.removeAttribute('aria-invalid');
  });

  // Also clear on change (handles <select>)
  inputEl.addEventListener('change', function () {
    errorEl.textContent = '';
    inputEl.classList.remove('input-error');
    inputEl.removeAttribute('aria-invalid');
  });
}
