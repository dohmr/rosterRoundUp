const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "roster.html");

const render = require("./lib/htmlRenderer");

// empty array of employees
let roster = [];
// initial questions from inquirer
const questionsForEmployees = [{
    type: "input",
    message: "What is your employees name?",
    name: "name"
},
{
    type: "input",
    message: "What is the employees Email?",
    name: "email"
},
{
    type: "input",
    message: "What is the employees ID?",
    name: "id"
},
{
    type: "list",
    message: "What is the employees role?",
    name: "role",
    choices: ["Manager", "Engineer", "Intern"]
},
];
// questions depending on the selection of role...
const forEngineer = {
    type: "input",
    message: "What is the employees Github username?",
    name: "github"
};

const forIntern = {
    type: "input",
    message: "What is the employees school name?",
    name: "school"
};

const forManager = {
    type: "input",
    message: "What is their Office number?",
    name: "officeNumber"
};

const moreEmployees = {
    type: "confirm",
    message: "Add more Employees?",
    name: "addMore",
    default: false
};

// async functions. create team. add employees to team array?

async function addMoreEmployees() {
    try {
        const waitMore = await inquirer.prompt(moreEmployees);
        if (waitMore.addMore) {
            await createRoster();
        }
        return roster;
    } catch (err) {
        console.log(err);
    };
};
// constructor for input parameters with async function to add new employees
// using switch with case blocks for reuse values, instead of multiple if statements
// push employees into roster aray with answers from inquirer prompt
async function createRoster() {
    try {
        const answers = await inquirer.prompt(questionsForEmployees);
        const { name, id, email } = answers;

        switch (answers.role) {

            case "Manager":
                try {
                    const managerAnswers = await inquirer.prompt(forManager);
                    const { officeNumber } = managerAnswers;
                    let manager = new Manager(name, id, email, officeNumber);
                    roster.push(manager);
                    await addMoreEmployees();
                } catch (err) {
                    console.log("Manager error");
                }
                break;

            case "Engineer":
                try {
                    const engineerAnswers = await inquirer.prompt(forEngineer);
                    const { github } = engineerAnswers;
                    let engineer = new Engineer(name, id, email, github);
                    roster.push(engineer);
                    await addMoreEmployees();
                } catch (err) {
                    console.log("Engineer error");
                }
                break;

            case "Intern":
                try {
                    const internAnswers = await inquirer.prompt(forIntern);
                    const { school } = internAnswers;
                    let intern = new Intern(name, id, email, school);
                    roster.push(intern);
                    await addMoreEmployees();
                } catch (err) {
                    console.log("Intern error");
                }
                break;
        }
    } catch (err) {
        console.log(err);
    }
};


// write file html in 'output'. outputPath.
async function createHTML(){
    await createRoster();

// for new file, check if existing folder 'output', if not, create... 
// existsSync looks for existing file
    if (!fs.existsSync("./output")) {
        // mkdirSync creates a directory, synchronously
        fs.mkdirSync("./output");
    }
    // using outputpath, reads current directory location for output
    fs.writeFile(outputPath, render(roster), error => {
        if (error) throw error;
        console.log("Roster is complete!")

    });
};

createHTML();
