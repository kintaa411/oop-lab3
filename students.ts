class Student {
    private name: string;
    private id: string;
    private credits = 0;

    constructor(name: string, id: string) {
        this.name = name;
        this.id = id;
    }
    protected  getCreditLimit(): number {
        return 21;
        
    }

    addCredits(amount: number): boolean {
        if(!Number.isInteger(amount)) return false;
        if (this.credits + amount > this.getCreditLimit()) return false;
        if (amount <= 0) return false;
        if (this.credits + amount > 21) return false;
        this.credits += amount;
        return true;
    }

    describe(): string {
        return `${this.name} (${this.id}): ${this.credits} credits`;
    }

   
}

class GraduateStudent extends Student {
private advisor:string;
    constructor(name: string, id: string, advisor: string) {
       
        super(name, id);
        this.advisor = advisor;
       
    }
    override addCredits(amount: number): boolean {
        if (amount <= 0) return false; 
        if (this.credits + amount > 12) return false;

        this.credits += amount;
        return true;
    }

    override getCreditLimit(): number {
         return 12;
    }

  override describe(): string {
        return `${this.name}, ${this.id}, ${this.credits},advisor: ${this.advisor}`;//we just override what differs, override its not here to access to private things.
    }
}
const awa = new Student("Awa", "S-001");
const fatou = new GraduateStudent("Fatou", "G-001", "Dr. Diop");
const Rose = new GraduateStudent("Rose","S202404RKM","Dr Guindo")

console.log(awa.addCredits(18), fatou.addCredits(9), fatou.addCredits(10));
console.log(awa.describe());
console.log(fatou.describe());
const everyone: Student[] = [awa, fatou];

for (const student of everyone) {
  console.log(student.describe());
}

