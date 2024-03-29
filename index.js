const db = require('./config/connection');
const inquirer = require('inquirer');
const Role = require('./assets/Role');
const Department = require('./assets/Department');

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
        name: 'new_role_name',
        message: 'Please enter the role you would like to add.',
        when(choice){
            return choice.user_options === 'Add a role'
        }
    },
    {
        type: 'input',
        name: 'new_role_salary',
        message: (answers)=>`Please enter the salary of the new role: ${answers.new_role_name}.`,
        when(choice){
            return choice.new_role_name;
        }
    },
    {
        type: 'list',
        name: 'new_role_dept',
        message: (answers)=>`Please enter the department of the new role: ${answers.new_role_name}`,
        //Using an async function to query the DB for all department names, including ones dynamically added by user
        //and then using the response to populate the choices array.
        choices: async function(){
            let response =[];
            await db.promise().query(`SELECT name FROM department`)
            .then(([rows,fields])=>{
                for(let i = 0; i<rows.length;i++){
                    response.push(rows[i].name);
                }
            })
            return response;
        },
        when(choice){
            return choice.new_role_salary;
        }
    },
    {
        type: 'input',
        name: 'new_employee_name',
        message: 'Please enter the first and last name of the employee you would like to add.',
        //-- Add validation--
        validate: function(answer){
            if((answer.match(/ /g) || []).length === 1){
                return true;
            }
            else{
                return "Please enter the first and last name seperated by a space.";
            }
        },
        when(choice){
            return choice.user_options === 'Add an employee'
        }
    },
    {
        type: 'list',
        name: 'new_employee_role',
        message: (answers)=>`Please select the role of ${answers.new_employee_name}: `,
        //Using the same ascyn function as before to query and return all roles and populate the choices array with them.
        choices: async function(){
            let response =[];
            await db.promise().query(`SELECT title FROM role`)
            .then(([rows,fields])=>{
                for(let i = 0; i<rows.length;i++){
                    response.push(rows[i].title);
                }
            })
            return response;
        },
        when(input){
            return input.new_employee_name
        }
    },
    {
        type: 'list',
        name: 'new_employee_manager',
        message: (answers)=>`Please select the manager of ${answers.new_employee_name}: `,
        choices: async function(){
            let response = [];
            await db.promise().query(`SELECT first_name, last_name FROM employee`)
            .then(([rows,fields])=>{
                for(let i = 0; i<rows.length;i++){
                    let concat = rows[i].first_name + ' ' + rows[i].last_name;
                    response.push(concat);
                }
            })
            return response;
        },
        when(choice){
            return choice.new_employee_role
        }
    },
    {
        type:'list',
        name: 'update_employee',
        message: `Which employee's role do you want to update?`,
        choices: async function(){
            let response = [];
            await db.promise().query(`SELECT first_name, last_name FROM employee`)
            .then(([rows,fields])=>{
                for(let i = 0; i<rows.length;i++){
                    let concat = rows[i].first_name + ' ' + rows[i].last_name;
                    response.push(concat);
                }
            })
            return response;
        },
        when(choice){
            return choice.user_options === "Update an employee role";
        }
    },
    {
        type: 'list',
        name: 'update_employee_role',
        message: (answer)=> {`Which role do you want to assign for ${answer}?`},
        choices: async function(){
            let response = [];
            await db.promise().query(`SELECT title FROM role`)
            .then(([rows,fields])=>{
                for(let i = 0; i<rows.length;i++){
                    response.push(rows[i].title);
                }
            })
            return response;
        },
        when(choice){
            return choice.update_employee;
        }
    }
    
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
            addRole(answer.new_role_name, answer.new_role_salary, answer.new_role_dept);
        }
        if(answer.user_options === "Add an employee"){
            let splitName = answer.new_employee_name.split(' ');
            let manSplitName = answer.new_employee_manager.split(' ');
            addEmployee(splitName[0],splitName[1],answer.new_employee_role,manSplitName[0], manSplitName[1]);
        }
        if(answer.user_options === "Update an employee role"){
            updateEmployeeRole(answer.update_employee,answer.update_employee_role);
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
    db.promise().query(`SELECT * FROM department JOIN role ON department.id = role.department_id JOIN employee ON role.id = employee.role_id`)
    .then(([rows, fields]) =>{
        console.table(rows);
        prompt();
    })
    .catch(err=>{
        throw err;
    })
}


const getManID = async (mFirst,mLast) =>{
    let id;
    await db.promise().query(`SELECT id FROM employee WHERE first_name = '${mFirst}' AND last_name = '${mLast}'`)
    .then(([rows,fields])=>{
        id = rows[0].id
    })
    return id;
}
const getRoleID = async (role) =>{
    let id;
    await db.promise().query(`SELECT id FROM role WHERE title = '${role}'`)
    .then(([rows,fields])=>{
        id = rows[0].id
    })
    return id;
}

//Figuring out the async/await with promise() wrapper for DB query took me A LONG TIME to figure out
//The key was to add await WITH promise() wrapper on DB query, otherwise getManID and getRoleID would
//always return undefined, despite the query in those functions returning the proper data.
const addEmployee = async (fName,Lname,role,mFirst,mLast) =>{
    let manID = await getManID(mFirst,mLast);
    let roleID = await getRoleID(role);
    try{
        db.query(`INSERT INTO employee(first_name,last_name,role_id,manager_id)VALUES ('${fName}','${Lname}','${roleID}','${manID}')`,(err,result)=>{
            if(err){
                throw err;
            }
            console.log('----------------')
            console.log('Employee Added!')
            viewEmployees();
        })
    }
    catch(error){
        console.log(error);
    }
}
const addRole = (name,sal,dep) =>{
    //Initializing a variable to store the response of the query into (id of department)
    //then passing it through the next query to use in the new insert query.
    let dep_ID;
    db.promise().query(`SELECT id FROM department WHERE name = '${dep}'`)
    .then(([rows,fields])=>{
        dep_ID = rows[0].id;
        db.promise().query(`INSERT INTO role(title,salary,department_id)VALUES('${name}','${sal}','${dep_ID}')`)
        .then(([rows, fields]) =>{
            console.log("Role Added: ", rows.affectedRows);
            console.log('----------------');
            viewRoles();
        })
        .catch((err)=>{
            throw err;
        })
    })
}
const addDepartment = (dept_name) =>{
    db.promise().query(`INSERT INTO department(name)VALUES ('${dept_name}')`)
    .then(([rows, fields]) =>{
        db.promise().query(`SELECT * FROM department`)
        .then(([rows, fields]) =>{
            console.log('----------------');
            console.log("Department successfully added!")
            console.table(rows);
            prompt();
        })
        .catch(err=>{
            throw err;
        })
    })
}
const getEmpID = async (empName)=>{
    let splitName = empName.split(' ');
    let ID;
    await db.promise().query(`SELECT id FROM employee WHERE first_name = '${splitName[0]}' AND last_name = '${splitName[1]}'`)
    .then(([rows,fields])=>{
        ID =  rows[0].id;
    })
    return ID
}
const updateEmployeeRole = async (empName, empNewRole)=>{
    let empID = await getEmpID(empName);
    let newRoleID = await getRoleID(empNewRole);
    db.promise().query(`UPDATE employee SET role_id = '${newRoleID}' WHERE id = '${empID}'`)
    .then(([rows,fields])=>{
        console.log('------------')
        console.log("Employee updated!")
        viewEmployees();
    })
    .catch(error=>{throw err;})

}
//Function for resetting the ID column-auto increment after deleting a row
//May not actually be needed, but keeping it in just in case I want to implement it later.
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