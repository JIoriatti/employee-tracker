INSERT INTO department(name)
VALUES  ("Sales"),
        ("Production"),
        ("Inventory Management"),
        ("Human Resources"),
        ("Investments"),
        ("Foreign Relations");

INSERT INTO role(title,salary,department_id)
VALUES  ("Intern", 30000,1),
        ("Engineer", 150000,2),
        ("Inside Sales", 70000,1),
        ("Outside Sales", 120000,1),
        ("Recruiter", 70000,4),
        ("Portfolio Manager", 250000,5),
        ("Foreign Relations Manager", 200000,6),
        ("Operations Specialist", 120000,3),
        ("Operations Manager", 175000, 3),
        ("Foreign Relations Specialist", 120000,6),
        ("Investment Analyst", 100000,5),
        ("Regional Sales Manager", 175000, 1);

INSERT INTO employee(first_name,last_name,role_id)
VALUES  ("Joe","Shmoe",1),
        ("Johnny","Ditmer",3),
        ("Bob","Newman",2),
        ("Ron","Roberto",8),
        ("Kelly","Ryder",11),
        ("Sarah","Adams",10),
        ("Alec", "Rhinor",9),
        ("John", "Doe",4),
        ("Alex", "Freeman",5),
        ("Jason","Keller",6),
        ("Alexa", "Donaldson",7),
        ("Veronica","Marone",12);
UPDATE employee SET manager_id = 12 WHERE first_name = "Joe";
UPDATE employee SET manager_id = 12 WHERE first_name = "Johnny";
UPDATE employee SET manager_id = 12 WHERE first_name = "John";
UPDATE employee SET manager_id = 6 WHERE first_name = "Kelly";
UPDATE employee SET manager_id = 7 WHERE first_name = "Sarah";
UPDATE employee SET manager_id = 9 WHERE first_name = "Ron";




