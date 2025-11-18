# Self-Healing Architecture Diagram

## Component Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Test Layer                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  tests/ci-friendly.spec.ts                              │   │
│  │  tests/login-single.spec.ts                             │   │
│  │  tests/self-healing-demo.spec.ts                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ Uses Page Objects
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Page Object Layer                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  pages/LoginPage.ts                                     │   │
│  │  - getSaudiIdInput()                                    │   │
│  │  - getLoginButton()                                     │   │
│  │  - enterSaudiId()                                       │   │
│  │  - clickLogin()                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  pages/DashboardPage.ts                                 │   │
│  │  - getWelcomeHeading()                                  │   │
│  │  - verifyWelcomeMessage()                               │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ Uses Self-Healing
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               Self-Healing Locator Utility                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  utils/SelfHealingLocator.ts                            │   │
│  │  - smartLocator()                                       │   │
│  │  - findInput()                                          │   │
│  │  - findButton()                                         │   │
│  │  - findElement()                                        │   │
│  │  - findByText()                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ Tries Multiple Strategies
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Playwright Locators                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Strategy 1: getByRole()        ✅ Most Stable          │   │
│  │  Strategy 2: getByTestId()      ✅ Stable               │   │
│  │  Strategy 3: getByLabel()       ✅ Semantic             │   │
│  │  Strategy 4: getByPlaceholder() ✅ User-Visible         │   │
│  │  Strategy 5: getByText()        ⚠️  Dynamic             │   │
│  │  Strategy 6: CSS Selector       ⚠️  Can Change          │   │
│  │  Strategy 7: XPath              ❌ Brittle              │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ Locates Elements
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Web Application                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  <input type="text" placeholder="Saudi ID">             │   │
│  │  <button type="submit">Login</button>                   │   │
│  │  <h3 class="user-name-welcome">Welcome User</h3>        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Execution Flow

```
Test Case Start
      │
      ▼
┌─────────────────┐
│  Page Object    │
│  Method Call    │
│  (e.g., login)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Get Element Method     │
│  (e.g., getSaudiId())   │
└────────┬────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  SelfHealingLocator.findInput()│
└────────┬───────────────────────┘
         │
         ▼
    ┌────────────┐
    │ Strategy 1 │ ──[SUCCESS]──┐
    │ Try Role   │              │
    └─────┬──────┘              │
          │ [FAIL]              │
          ▼                     │
    ┌────────────┐              │
    │ Strategy 2 │ ──[SUCCESS]──┤
    │ Try TestID │              │
    └─────┬──────┘              │
          │ [FAIL]              │
          ▼                     │
    ┌────────────┐              │
    │ Strategy 3 │ ──[SUCCESS]──┤
    │ Try Label  │              │
    └─────┬──────┘              │
          │ [FAIL]              │
          ▼                     ▼
    ┌──────────────────┐   ┌──────────┐
    │ All Failed       │   │ Element  │
    │ Throw Error      │   │  Found   │
    └──────────────────┘   └────┬─────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ Return Locator│
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ Perform Action│
                         │ (fill, click) │
                         └──────┬───────┘
                                │
                                ▼
                         Test Continues
```

## Self-Healing Decision Tree

```
Element Location Request
         │
         ▼
    Is Primary
    Selector     ──YES──> Element     ──VISIBLE──> Return
    Working?              Visible?                  Element
         │                    │
        NO                   NOT
         │                    │
         ▼                    ▼
    Try Fallback         Try Next
    Strategy 1           Strategy
         │                    │
         ▼                    ▼
    Element          More        ──YES──> Try Next
    Found?           Strategies?          Strategy
         │                │
        YES              NO
         │                │
         ▼                ▼
    Log Self-        Throw Error:
    Healing          "All strategies
    Success          failed"
         │
         ▼
    Return
    Element
```

## Input Field Location Strategy

```
findInput({ type, name, placeholder, label })
              │
              ▼
    ┌─────────────────────┐
    │  1. Type + Name     │ input[type="text"][name*="id"]
    │     Combination     │
    └─────────┬───────────┘
              │ [FAIL]
              ▼
    ┌─────────────────────┐
    │  2. ID Attribute    │ input[id*="saudi-id"]
    └─────────┬───────────┘
              │ [FAIL]
              ▼
    ┌─────────────────────┐
    │  3. Name Attribute  │ input[name*="id"]
    └─────────┬───────────┘
              │ [FAIL]
              ▼
    ┌─────────────────────┐
    │  4. Placeholder     │ getByPlaceholder("Saudi ID")
    │     (Playwright)    │
    └─────────┬───────────┘
              │ [FAIL]
              ▼
    ┌─────────────────────┐
    │  5. Label           │ getByLabel("Saudi ID")
    │     (Playwright)    │
    └─────────┬───────────┘
              │ [FAIL]
              ▼
    ┌─────────────────────┐
    │  6. Type Only       │ input[type="text"].first()
    └─────────┬───────────┘
              │ [FAIL]
              ▼
        All Failed
```

## Button Location Strategy

```
findButton({ text, type, testId })
              │
              ▼
    ┌─────────────────────────┐
    │  1. Role + Name         │ getByRole('button', { name })
    │     (Most Stable)       │
    └─────────┬───────────────┘
              │ [FAIL]
              ▼
    ┌─────────────────────────┐
    │  2. Test ID             │ getByTestId('login-button')
    │     (Data Attribute)    │
    └─────────┬───────────────┘
              │ [FAIL]
              ▼
    ┌─────────────────────────┐
    │  3. Text Content        │ getByText(/Login/i)
    │     (Regex Match)       │
    └─────────┬───────────────┘
              │ [FAIL]
              ▼
    ┌─────────────────────────┐
    │  4. Type Attribute      │ button[type="submit"]
    │     (Generic)           │
    └─────────┬───────────────┘
              │ [FAIL]
              ▼
        All Failed
```

## Console Output Flow

```
Self-Healing Attempt
         │
         ▼
    ┌──────────────────┐
    │ Try Primary      │
    │ Selector         │
    └────┬─────────────┘
         │
    [SUCCESS]  [FAIL]
         │        │
         ▼        ▼
    No Output   ⚠️ "Primary selector failed"
         │        │
         │        ▼
         │   ┌──────────────┐
         │   │ Try Fallback │
         │   └────┬─────────┘
         │        │
         │   [SUCCESS]  [FAIL]
         │        │        │
         │        ▼        ▼
         │   ✅ "Self-    ⚠️ "Fallback
         │    healed     selector
         │    using..."  failed"
         │        │        │
         │        │   [More Fallbacks?]
         │        │        │
         │        │       YES ──> Try Next
         │        │        │
         │        │       NO
         │        │        │
         │        │        ▼
         │        │   ❌ "All selectors
         │        │     failed"
         │        │        │
         └────────┴────────┘
                  │
                  ▼
         Continue Test / Fail
```

## Integration with Existing Tests

```
┌────────────────────────────────────────┐
│  Existing Test (No Changes Needed)    │
│                                        │
│  test('login test', async ({ page })   │
│    const loginPage = new LoginPage()  │
│    await loginPage.goto()             │
│    await loginPage.login('id')        │ 
│  )                                     │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│  LoginPage (Updated with Self-Healing) │
│                                        │
│  async login(id) {                     │
│    const input = await this            │
│      .getSaudiIdInput()  ◄────────┐   │
│    await input.fill(id)           │   │
│  }                                 │   │
│                                    │   │
│  private async getSaudiIdInput()   │   │
│    return selfHealing.findInput({  │   │
│      type: 'text',                 │   │
│      name: 'id',                   │   │
│      placeholder: 'Saudi ID'  ◄────┘   │
│    })                                  │
└───────────────┬────────────────────────┘
                │
                ▼
┌────────────────────────────────────────┐
│  Self-Healing Utility                  │
│  (Automatic Fallback Logic)            │
│                                        │
│  ✅ Try multiple strategies            │
│  ✅ Log success/failure                │
│  ✅ Return working locator             │
└────────────────────────────────────────┘
```

## Benefits Visualization

```
WITHOUT Self-Healing              WITH Self-Healing
━━━━━━━━━━━━━━━━━━━              ━━━━━━━━━━━━━━━━━
                                  
Test ──> Locator                  Test ──> Smart Locator
            │                                  │
            │                                  ├─> Strategy 1
            ▼                                  ├─> Strategy 2
        Element?                               ├─> Strategy 3
        │       │                              ├─> Strategy 4
       YES     NO                              └─> Strategy 5
        │       │                                     │
        ▼       ▼                                     ▼
      PASS    FAIL ❌                            ✅ PASS
                                  
  Maintenance: HIGH                Maintenance: LOW
  Stability: LOW                   Stability: HIGH
  Flexibility: NONE                Flexibility: HIGH
```

## Timeline Comparison

```
UI Changes Over Time
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Day 1: Initial Implementation
    Traditional: ✅ Tests Pass
    Self-Healing: ✅ Tests Pass

Day 30: Developer Changes Input ID
    Traditional: ❌ Tests Fail (Need immediate fix)
    Self-Healing: ✅ Tests Pass (Fallback to placeholder)

Day 60: Placeholder Text Updated
    Traditional: ❌ Still Broken
    Self-Healing: ✅ Tests Pass (Fallback to label)

Day 90: Complete Redesign
    Traditional: ❌ Major Rewrite Needed
    Self-Healing: ⚠️ Some Updates (Fewer changes)

Result:
    Traditional: 3+ Maintenance Cycles
    Self-Healing: 0-1 Maintenance Cycles
```

---

This diagram shows how self-healing automatically protects your tests from UI changes by trying multiple location strategies in order of stability.
