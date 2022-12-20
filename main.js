const db = require('./config/connection');
const inquirer = require('inquirer');
const roles = ["Intern", "Engineer", "Inside Sales", "Outside Sales", "Recruiter", "Portfolio Manager",
"Foriegn Relations Manager", "Operations Specialist", "Operations Manager", "Foriegn Relations Specialist",
"Investment Analyst", "Regional Sales Manager"    
];
const promptList = [
    {
    type: 'list',
    name: 'user_options',
    choices: ["View all departments", "View all roles", "View all employees", new inquirer.Separator(),
                "Add a department", "Add a role", "Add an employee", new inquirer.Separator(), 
                "Update an employee role",new inquirer.Separator(), "Quit", new inquirer.Separator()
            ],
    message: "What would you like to do?"
    },
    {
        type: 'input',
        name: 'dept_name',
        message: 'Please enter the name of the department you would like to add.',
        when(choice){
            return choice.user_options === 'Add a department'
        }
    },
    {
        type: 'input',
        name: 'role_name',
        message: 'Please enter the role you would like to add.',
        when(choice){
            return choice.user_options === 'Add a role'
        }
    },
    {
        type: 'input',
        name: 'new_employee_name',
        message: 'Please enter the first and last name of the employee you would like to add.',
        when(choice){
            return choice.user_options === 'Add an employee'
        }
    },
    {
        type: 'list',
        name: 'new_employee_role',
        message: (answers)=>`Please select the role of ${answers.new_employee_name}: `,
        choices: roles,
        when(input){
            return input.new_employee_name
        }
    },
    {
        type: 'list',
        name: 'new_employee_department',
        message: (answers)=>`Please select the department of ${answers.new_employee_name}: `,
        choices: ["Sales", "Production", "Inventory Management", "Human Resources", "Investments", "Foriegn Relations"],
        when(choice){
            return choice.new_employee_role
        }
    },
    
]


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
            addDepartment(answer.dept_name);  
        }
        if(answer.user_options === "Add a role"){
            addRole();
        }
        if(answer.user_options === "Add an employee"){
            let splitName = answer.new_employee_name.split(' ');
            addEmployee(splitName[0],splitName[1],answer.new_employee_role);
        }
        if(answer.user_options === "Update an employee role"){
            updateEmployeeRole();
        }
        if(answer.user_options === "Quit"){
            db.end();
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

const addEmployee = (fName,Lname,role) =>{
    let roleID = roles.indexOf(role) + 1;
    let man_ID;
    if(role ==="Intern" || "Inside Sales" || "Outside Sales"){
        man_ID = 12;
    }
    if(role ==="Investment Analyst"){
        man_ID = 6;
    }
    if(role === "Foreign Relations Specialist"){
        man_ID = 7;
    }
    if(role === "Operations Specialist"){
        man_ID = 9;
    }
    else{
        man_ID = null;
    }
    let insert = `INSERT INTO employee(first_name,last_name,role_id,manager_id)VALUES ('${fName}','${Lname}',${roleID},${man_ID})`
    db.promise().query(insert)
    .then((result)=>{
        console.log("Rows added: ",result.affectedRows);
        prompt();
    })
    .catch(err=>{
        throw err;
    })

}
const addRole = () =>{
    db.promise().query(`SELECT * FROM employee`)
    .then(([rows, fields]) =>{
        console.table(rows);
        prompt();
    })
    .catch((err)=>{
        throw err;
    })
}
const addDepartment = () =>{
    db.promise().query(`SELECT * FROM employee`)
    .then(([rows, fields]) =>{
        console.table(rows);
        prompt();
    })
    .catch(err=>{
        throw err;
    })
}
//Function for resetting the ID column-auto increment after deleting a row
const resetAutoIncrement = (column,table) =>{
    let max = db.query(`SELECT MAX(${column}) FROM ${table}`,(err,result)=>{
        if(err){
            throw err;
        }
        db.query(`ALTER TABLE ${table} AUTO_INCREMENT = ${max + 1}`, (err, result)=>{
            if(err){
                throw err;
            }
            else{
                console.log(result.affectedRows);
            }
        })
    })
}