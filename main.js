const db = require('./connection.js/connect');
const inquirer = require('inquirer');
const promptList = {
    type: 'list',
    name: 'user_options',
    choices: ["View all departments", "View all roles", "View all employees", new inquirer.Separator(),
                "Add a department", "Add a role", "Add an employee", new inquirer.Separator(), 
                "Update an employee role",new inquirer.Separator(), "Quit", new inquirer.Separator()],
    message: "What would you like to do?",
    // loop: true
}

db.connect((err)=>{
    if(err){
        throw err;
    }
    else{
        prompt();
    }
})
const prompt = () =>{
    inquirer.prompt(promptList).then(answer=>{
        if(answer.user_options === "View all departments"){
            viewDepartments();
        }
        if(answer.user_options === "View all roles"){
            viewRoles();
        }
        if(answer.user_options === "View all employees"){
            viewEmployees();
        }
        if(answer.user_options === "Add a department"){
            addDepartment();
        }
        if(answer.user_options === "Add a role"){
            addRole();
        }
        if(answer.user_options === "Add an employee"){
            addEmployee();
        }
        if(answer.user_options === "Update an employee role"){
            updateEmployeeRole();
        }
        if(answer.user_options === "Quit"){
            process.exit();
        }
    })
}
const viewDepartments = () =>{
    db.promise().query(`SELECT * FROM department`)
    .then(([rows, fields]) =>{
        console.table(rows);
        prompt();
    })
    .catch(err=>{
        throw err;
    })
}
const viewRoles = () =>{
    db.promise().query(`SELECT * FROM role`)
    .then(([rows, fields]) =>{
        console.table(rows);
        prompt();
    })
    .catch(err=>{
        throw err;
    })
}
const viewEmployees = () =>{
    db.promise().query(`SELECT * FROM employee`)
    .then(([rows, fields]) =>{
        console.table(rows);
        prompt();
    })
    .catch(err=>{
        throw err;
    })
}
