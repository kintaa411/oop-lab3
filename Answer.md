# Lab #3: Inheritance

## Part I: Feel the Duplication

**Question 1. How many places did you edit? How many would it be if DAUST also had exchange students and doctoral students, each in their own copied class?**

I only edited one place inside the parent class. Since we are using inheritance, there is no need to modify the child classes unless we want to override a method.

For the credits, we only need to modify the `addCredits()` method and put all the conditions there.

For DAUST, we don't need to change anything because the child classes (`ExchangeStudent` and `DoctoralStudent`) extend the `Student` class. They inherit all its properties and methods. We only need to override methods when we want to personalize their behavior.

## Part II: Refactor with Extends

**Prediction 1. The class lost its own `addCredits()` and `describe()`. What will the first three output lines be now?**

They will behave according to the methods defined in the parent class.

```text
true true true true
Awa (S-001): 18 credits
Fatou (G-001): 15 credits
```

### 2.1 Experiment with Constructor Order

In the `GraduateStudent` constructor, swap the two lines so that `this.advisor = advisor;` comes before `super(name, id);`.

**Question 2. Hover over the red underline. Copy the error message.**

`'super' must be called before accessing 'this' in the constructor of a derived class.ts(17009)`

**Prediction 2. Run the file anyway with `node students.ts`. Will it run, as it did with private violations in Lab 2? Write your answer down, then run.**

No, it doesn't run.

**Question 3. This time, the program stops with a ReferenceError. Unlike private, this rule is enforced by JavaScript itself. Why must the base part of the object exist before `this` is used?**

The reason `super()` must come before `this` is that the parent class must be initialized before the child class can use its own properties.

### 2.2 Experiment: Private Stays Private

Add this method inside `GraduateStudent`:

```typescript
describe(): string {
    return `${this.name}, advisor: ${this.advisor}`;
}
```

**Question 4. Read the error on `this.name`. A GraduateStudent object contains a name. Why can it not use it?**

It cannot access `name` because the parent class declared it as `private`. A private property can only be accessed from within the class where it was declared.

## Part III: Override Only What Differs

**Question 6. Without `override`, the typo silently created a new, unused method. In one sentence: what does the `override` keyword protect you from?**

The `override` keyword protects you from accidentally creating a new method instead of overriding an existing method in the parent class.

### 3.3 Specialize the Credit Limit

**Question 7. `addCredits()` is written only in Student. When `fatou.addCredits(6)` runs, which version of `getCreditLimit()` is called, and why?**

The overridden version in `GraduateStudent` is called because the subclass provides its own implementation of `getCreditLimit()`.

### 3.4 One List of Students

**Prediction 5. The array is declared as `Student[]`. Will Fatou's line include her advisor? Write your answer down, then run.**

Yes, it will include Fatou's advisor because the overridden `describe()` method in `GraduateStudent` is called at runtime.

## Part IV: When Inheritance Goes Wrong

**Prediction 6. Will these lines show red underlines? What will the two counts be? Write your answers down, then run.**

No, I don't have any red underlines.

The two final counts will be: 5 and 0.

```text
true true true false
3
5
0
```

**Question 9. The course had capacity 3 and no duplicates. Which rules did these four lines break, and why did the compiler not object?**

- **Capacity rule:** The course should have a maximum of three students. However, `add()` allows adding students without checking the capacity.
- **No-duplicates rule:** A student should only be enrolled once. However, `add("Awa")` adds Awa again, even though she is already enrolled.

**Why didn't the compiler object?**

Because TypeScript checks types and syntax, not whether our program follows its business rules.

**Question 10. Why is `oop.add()` underlined in red?**

Because `Course` no longer inherits from `StudentList`.

It has a `students` object internally, but `add()` belongs to that object, not directly to `Course`.

**Prediction 7. Will Node run the code?**

No, Node will not successfully execute those lines.

It produces the following error:

`TypeError: oop.add is not a function`

**Prediction 8. What will the two lines print?**

```text
false
true
```

`oop.enroll()` returns `false` because registration is closed.

`seminar.enroll()` returns `true` because registration is still open.

**Question 12. Which class is at fault?**

Answer: `AlwaysOpenCourse`.

The function `endRegistrationPeriod()` is correct because it expects every `Course` to close registration.

The problem is that `AlwaysOpenCourse` changes the expected behavior of its parent method.

**Question 13. Why does `LabCourse.enroll()` call `super.enroll()` instead of adding the student to the list itself? Give two reasons.**

1. **Code reusability:** It reuses the parent's existing enrollment logic instead of duplicating the checks for capacity, duplicates, and registration status.
2. **Consistency:** It ensures that all the rules defined in `Course` are respected, even if those rules change later.

**Question 14. Why is `LabCourse` not breaking a promise, while `AlwaysOpenCourse` is?**

Because `Course.enroll()` already promises that enrollment will succeed only when the course conditions are satisfied. It does not promise that every student will be accepted.

- **LabCourse:** Adds an extra safety-training requirement. This is a stricter condition, but it doesn't violate the original promise.
- **AlwaysOpenCourse:** Overrides `closeRegistration()` without actually closing registration. This breaks the expected behavior of the parent class.