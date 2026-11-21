# Object-Oriented Programming — DAUST Fall 2026

# Lab 3 — Inheritance in Practice

In Lecture 4 you saw why duplication between classes is a problem, how `extends` removes it, and where inheritance goes wrong. In this lab you go through the same path with your own code: you copy a class, feel the cost, refactor with `extends`, override only what differs, then break a design with inheritance and repair it with composition.

Working method:

1. **Type the code yourself**, except where the lab explicitly asks you to copy.
2. **Predict before you run.** Write each **Prediction** down before executing.
3. **Read every red underline.** `node` runs your code without type-checking it; the editor is the only type check.
4. Keep your predictions and answers somewhere you can refer back to them.

Run any file with:

```bash
node file.ts
```

Create a folder `oop-lab3` and open it in VS Code.

---

## Part 1 — Feel the Duplication

Create `students.ts`:

```typescript
class Student {
  private name: string;
  private id: string;
  private credits = 0;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }

  addCredits(amount: number): boolean {
    if (amount <= 0) return false;
    if (this.credits + amount > 21) return false;
    this.credits += amount;
    return true;
  }

  describe(): string {
    return `${this.name} (${this.id}): ${this.credits} credits`;
  }
}
```

**Task.** Graduate students have an advisor and a limit of 12 credits. Create a class `GraduateStudent` by **copying** `Student` — this time copying is the point of the exercise. Then:

- rename the class to `GraduateStudent`
- add a field `private advisor: string;` and a third constructor parameter `advisor`
- change the limit from 21 to 12
- make `describe()` end with `, advisor: <advisor>`

Add these test lines at the bottom of the file:

```typescript
const awa = new Student("Awa", "S-001");
const fatou = new GraduateStudent("Fatou", "G-001", "Dr. Diop");

console.log(awa.addCredits(18), fatou.addCredits(9), fatou.addCredits(6));
console.log(awa.describe());
console.log(fatou.describe());
```

**Checkpoint 1** — the output is:

```text
true true false
Awa (S-001): 18 credits
Fatou (G-001): 9 credits, advisor: Dr. Diop
```

### 1.1 The New Requirement

The registrar announces: **credits must be whole numbers; adding 2.5 credits is rejected.**

**Task.** Implement the rule. Use `Number.isInteger(amount)`. Add one test line:

```typescript
console.log(awa.addCredits(2.5), fatou.addCredits(2.5));   // false false
```

**Question 1.** How many places did you edit? How many would it be if DAUST also had exchange students and doctoral students, each in their own copied class?

---

## Part 2 — Refactor With `extends`

Replace your entire `GraduateStudent` class with this:

```typescript
class GraduateStudent extends Student {
  private advisor: string;

  constructor(name: string, id: string, advisor: string) {
    super(name, id);
    this.advisor = advisor;
  }
}
```

Keep the test lines unchanged.

**Prediction 1.** The class lost its own `addCredits()` and `describe()`. What will the first three output lines be now? Write your answer down, then run.

The output is:

```text
true true true
Awa (S-001): 18 credits
Fatou (G-001): 15 credits
```

The duplication is gone, but so is everything specific to graduate students: Fatou accepted 15 credits and lost her advisor. Part 3 brings that back without copying anything.

### 2.1 Experiment — The Order of Construction

In the `GraduateStudent` constructor, swap the two lines so that `this.advisor = advisor;` comes **before** `super(name, id);`.

**Question 2.** Hover over the red underline. Copy the error message.

**Prediction 2.** Run the file anyway with `node students.ts`. Will it run, as it did with `private` violations in Lab 2? Write your answer down, then run.

**Question 3.** This time the program stops with a `ReferenceError`. Unlike `private`, this rule is enforced by JavaScript itself. Why must the base part of the object exist before `this` is used?

Swap the lines back.

### 2.2 Experiment — Private Stays Private

Add this method inside `GraduateStudent`:

```typescript
  describe(): string {
    return `${this.name}, advisor: ${this.advisor}`;
  }
```

**Question 4.** Read the error on `this.name`. A `GraduateStudent` object contains a `name`. Why can it not use it?

Delete the method. **Do not** change `name` to `protected` — Part 3 solves this differently.

**Checkpoint 2** — the file has no red underlines, and the output matches the one shown under Prediction 1.

---

## Part 3 — Override Only What Differs

### 3.1 Extend the Description

Add to `GraduateStudent`:

```typescript
  override describe(): string {
    return `${super.describe()}, advisor: ${this.advisor}`;
  }
```

Run. Fatou's description includes her advisor again — and `GraduateStudent` never touched `name`, `id`, or `credits`.

### 3.2 Experiment — Why `override` Matters

Rename the method to `describ` (a typo), keeping the `override` keyword.

**Question 5.** Copy the error message. What does the compiler suggest?

Now also **remove** the `override` keyword, keeping the typo.

**Prediction 3.** There is no red underline anymore. What does `fatou.describe()` print? Write your answer down, then run.

**Question 6.** Without `override`, the typo silently created a new, unused method. In one sentence: what does the `override` keyword protect you from?

Restore `override describe()`.

### 3.3 Specialise the Credit Limit

The rule for adding credits is shared; only the limit differs. Copying `addCredits()` back into `GraduateStudent` would bring the duplication back.

**Task.** In `Student`, add a protected method and use it in `addCredits()`:

```typescript
  protected getCreditLimit(): number {
    return 21;
  }
```

```typescript
    if (this.credits + amount > this.getCreditLimit()) return false;
```

**Task.** In `GraduateStudent`, override **only** that method so that it returns 12.

**Prediction 4.** What do the first and last output lines show now? Write your answer down, then run.

**Checkpoint 3** — the output is:

```text
true true false
Awa (S-001): 18 credits
Fatou (G-001): 9 credits, advisor: Dr. Diop
false false
```

**Question 7.** `addCredits()` is written only in `Student`. When `fatou.addCredits(6)` runs, which version of `getCreditLimit()` is called, and why?

**Question 8.** How many places now contain the whole-number rule? Compare with Question 1.

### 3.4 One List, Two Kinds of Students

Add at the bottom:

```typescript
const everyone: Student[] = [awa, fatou];

for (const student of everyone) {
  console.log(student.describe());
}
```

**Prediction 5.** The array is declared as `Student[]`. Will Fatou's line include her advisor? Write your answer down, then run.

It does. The loop only knows the type `Student`, yet each object runs its own `describe()`. This is the subject of the next lecture: **polymorphism**.

---

## Part 4 — When Inheritance Goes Wrong

Create `course.ts`:

```typescript
class StudentList {
  private students: string[] = [];

  add(student: string): void {
    this.students.push(student);
  }

  contains(student: string): boolean {
    return this.students.includes(student);
  }

  count(): number {
    return this.students.length;
  }

  clear(): void {
    this.students = [];
  }
}

class Course extends StudentList {
  enroll(student: string): boolean {
    if (this.contains(student) || this.count() >= 3) return false;
    this.add(student);
    return true;
  }
}

const oop = new Course();
console.log(oop.enroll("Awa"), oop.enroll("Mamadou"), oop.enroll("Fatou"), oop.enroll("Ibrahima"));
console.log(oop.count());
```

The capacity is 3 so that a full course is easy to reach. Run it:

```text
true true true false
3
```

`enroll()` enforces both rules. Now add:

```typescript
oop.add("Awa");
oop.add("Intruder");
console.log(oop.count());
oop.clear();
console.log(oop.count());
```

**Prediction 6.** Will these lines show red underlines? What will the two counts be? Write your answers down, then run.

**Question 9.** The course had capacity 3 and no duplicates. Which rules did these four lines break, and why did the compiler not object?

### 4.1 Repair It With Composition

**Task.** Rewrite `Course` so that it **has** a `StudentList` instead of **being** one:

- remove `extends StudentList`
- add a field `private students = new StudentList();`
- update `enroll()` to call `this.students.contains(...)`, `this.students.count()`, and `this.students.add(...)`
- add a method `getEnrollmentCount(): number` that returns `this.students.count()`
- replace `oop.count()` with `oop.getEnrollmentCount()` in your test lines

Keep the `oop.add(...)` and `oop.clear()` lines.

**Question 10.** Those lines are now underlined in red. Copy the error message for `oop.add("Awa")`.

**Prediction 7.** Run the file with those lines still present. Will `node` run them, as it ran `private` violations in Lab 2? Write your answer down, then run.

**Question 11.** The program stops with `TypeError: oop.add is not a function`. A `private` field still exists in the running object; `add()` does not exist on a `Course` at all. Explain why composition protects the course even at runtime.

Delete the `oop.add(...)` and `oop.clear()` lines.

**Checkpoint 4** — no red underlines, and the output is:

```text
true true true false
3
```

---

## Part 5 — Keeping the Parent's Promises

Create `registration.ts`:

```typescript
class Course {
  private capacity: number;
  private enrolledStudents: string[] = [];
  private registrationOpen = true;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  enroll(student: string): boolean {
    if (!this.registrationOpen) return false;
    if (this.enrolledStudents.includes(student)) return false;
    if (this.enrolledStudents.length >= this.capacity) return false;
    this.enrolledStudents.push(student);
    return true;
  }

  closeRegistration(): void {
    this.registrationOpen = false;
  }

  getEnrollmentCount(): number {
    return this.enrolledStudents.length;
  }
}
```

### 5.1 A Broken Promise

**Task.** Add a subclass `AlwaysOpenCourse` that overrides `closeRegistration()` with an empty body. Then add:

```typescript
function endRegistrationPeriod(courses: Course[]): void {
  for (const course of courses) {
    course.closeRegistration();
  }
}

const oop = new Course(30);
const seminar = new AlwaysOpenCourse(30);

endRegistrationPeriod([oop, seminar]);

console.log(oop.enroll("Late Student"));
console.log(seminar.enroll("Late Student"));
```

**Prediction 8.** What do the two lines print? Write your answer down, then run.

**Question 12.** `endRegistrationPeriod` is correct for `Course`. Which class is at fault: the function, or `AlwaysOpenCourse`? State the rule that was broken in one sentence.

### 5.2 A Legitimate Specialisation

**Task.** Add a subclass `LabCourse` that only accepts students who completed safety training:

- a field `private trainedStudents: string[] = [];`
- a method `recordSafetyTraining(student: string): void` that adds the student once
- an override of `enroll(student)` that returns `false` for an untrained student, and otherwise **calls `super.enroll(student)`**

Test:

```typescript
const physicsLab = new LabCourse(2);

console.log(physicsLab.enroll("Awa"));       // untrained
physicsLab.recordSafetyTraining("Awa");
physicsLab.recordSafetyTraining("Mamadou");
physicsLab.recordSafetyTraining("Fatou");
console.log(physicsLab.enroll("Awa"));
console.log(physicsLab.enroll("Awa"));       // duplicate
console.log(physicsLab.enroll("Mamadou"));
console.log(physicsLab.enroll("Fatou"));     // course full
```

**Checkpoint 5** — the five lines print:

```text
false
true
false
true
false
```

**Question 13.** Why does `LabCourse.enroll()` call `super.enroll()` instead of adding the student to the list itself? Give two reasons.

**Question 14.** `LabCourse` refuses students that `Course` would accept. Why is that not a broken promise, while `AlwaysOpenCourse` is? (Hint: what did `enroll()` already promise its callers?)

---

## Part 6 — Decide

Apply the three tests from Lecture 4 to each design of this lab:

| Design | Is-a? | Substitutable? | Stable? | Verdict |
|---|---|---|---|---|
| `GraduateStudent extends Student` | | | | |
| `Course extends StudentList` | | | | |
| `AlwaysOpenCourse extends Course` | | | | |
| `LabCourse extends Course` | | | | |

**Question 15.** Mamadou is a student who becomes a teaching assistant for one year. Would `TeachingAssistant extends Student` pass all three tests? Which one fails, and what would you use instead?

---

## Summary

| You experienced | The name for it |
|---|---|
| One rule, edited in every copied class | Duplication between classes |
| `extends` removed the copies | Inheritance |
| `super(...)` had to come first | The base part is built first |
| `this.name` refused in the subclass | `private` holds in a hierarchy |
| A typo caught only with `override` | The compiler checks overriding |
| `getCreditLimit()` overridden, `addCredits()` reused | Override only what differs |
| `oop.add("Intruder")` through inheritance | You cannot inherit a little |
| `private students = new StudentList()` | Composition |
| `AlwaysOpenCourse` ignored the close request | A broken promise |
| `LabCourse` calls `super.enroll()` | Specialisation that keeps the parent's rules |
