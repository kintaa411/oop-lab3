class Course {
    private students = new StudentList();

    enroll(student: string): boolean {
        if (this.students.contains(student) || this.students.count() >= 3) {
            return false;
        }

        this.students.add(student);
        return true;
    }

    getEnrollmentCount(): number {
        return this.students.count();
    }
}
const oop = new Course();

console.log(
    oop.enroll("Awa"),
    oop.enroll("Mamadou"),
    oop.enroll("Fatou"),
    oop.enroll("Ibrahima")
);

console.log(oop.getEnrollmentCount());

oop.add("Awa");
oop.add("Intruder");

console.log(oop.getEnrollmentCount());

oop.clear();

console.log(oop.getEnrollmentCount());