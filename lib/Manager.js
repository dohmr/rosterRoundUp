const Employee = require("./employee");
// TODO: Write code to define and export the Manager class. HINT: This class should inherit from Employee.

class Manager extends Employee {
    constructor(name, id, email, office){
        super(name, id, email);
        this.office = office;

    };
    getOfficeNumber(){
        return this.office;
    }

}
module.exports = Manager;