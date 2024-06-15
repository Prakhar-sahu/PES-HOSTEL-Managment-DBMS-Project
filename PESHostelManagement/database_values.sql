INSERT INTO staff (staff_id, staff_name, gender, dob, email_id, staff_role, salary) 
VALUES ('1', 'warden_1', 'M', '1980-01-01', 'warden@example.com', 'Manager', 50000);

INSERT INTO blocks (block_id, block_name, locate, description, status) 
VALUES 
('1', 'NB-Block', 'Inside PES college', '3 sharing, attached washrooms', 'empty'),
('2', 'NB-x Block', 'Inside PES college', '1st years only, 3 sharing, attached washroom', 'empty'),
('3', 'Mess Block', 'Inside PES college', '2 sharing, common washroom for floor', 'empty'),
('4', 'IT Block', 'Inside PES college', '3 sharing, common washroom for floor', 'empty'),
('5', 'IH Block', 'Inside PES college', 'Single rooms with common washrooms', 'empty');

INSERT INTO course (course_id, course_name, year_no) VALUES ('1', 'engineering', NULL);
INSERT INTO course (course_id, course_name, year_no) VALUES ('2', 'bba', NULL);

INSERT INTO room (room_no, status, block_id, beds_no)
VALUES 
('NB-01', 'empty', '1', 1),
('NB-01', 'empty', '1', 2),
('NB-01', 'empty', '1', 3),
('NB-02', 'empty', '1', 1),
('NB-02', 'empty', '1', 2),
('NB-02', 'empty', '1', 3),
('NB-03', 'empty', '1', 1),
('NB-03', 'empty', '1', 2),
('NB-03', 'empty', '1', 3),
('NB-04', 'empty', '1', 1),
('NB-04', 'empty', '1', 2),
('NB-04', 'empty', '1', 3),
('NB-05', 'empty', '1', 1),
('NB-05', 'empty', '1', 2),
('NB-05', 'empty', '1', 3);

INSERT INTO room (room_no, status, block_id, beds_no)
VALUES 
('NB-x-01', 'empty', '2', 1),
('NB-x-01', 'empty', '2', 2),
('NB-x-01', 'empty', '2', 3),
('NB-x-02', 'empty', '2', 1),
('NB-x-02', 'empty', '2', 2),
('NB-x-02', 'empty', '2', 3),
('NB-x-03', 'empty', '2', 1),
('NB-x-03', 'empty', '2', 2),
('NB-x-03', 'empty', '2', 3),
('NB-x-04', 'empty', '2', 1),
('NB-x-04', 'empty', '2', 2),
('NB-x-04', 'empty', '2', 3),
('NB-x-05', 'empty', '2', 1),
('NB-x-05', 'empty', '2', 2),
('NB-x-05', 'empty', '2', 3);

INSERT INTO room (room_no, status, block_id, beds_no)
VALUES 
('Mess-01', 'empty', '3', 1),
('Mess-01', 'empty', '3', 2),
('Mess-02', 'empty', '3', 1),
('Mess-02', 'empty', '3', 2),
('Mess-03', 'empty', '3', 1),
('Mess-03', 'empty', '3', 2),
('Mess-04', 'empty', '3', 1),
('Mess-04', 'empty', '3', 2),
('Mess-05', 'empty', '3', 1),
('Mess-05', 'empty', '3', 2);

INSERT INTO room (room_no, status, block_id, beds_no)
VALUES 
('IT-01', 'empty', '4', 1),
('IT-01', 'empty', '4', 2),
('IT-01', 'empty', '4', 3),
('IT-02', 'empty', '4', 1),
('IT-02', 'empty', '4', 2),
('IT-02', 'empty', '4', 3),
('IT-03', 'empty', '4', 1),
('IT-03', 'empty', '4', 2),
('IT-03', 'empty', '4', 3),
('IT-04', 'empty', '4', 1),
('IT-04', 'empty', '4', 2),
('IT-04', 'empty', '4', 3),
('IT-05', 'empty', '4', 1),
('IT-05', 'empty', '4', 2),
('IT-05', 'empty', '4', 3);

INSERT INTO room (room_no, status, block_id, beds_no)
VALUES 
('IH-01', 'empty', '5', 1),
('IH-02', 'empty', '5', 1),
('IH-03', 'empty', '5', 1),
('IH-04', 'empty', '5', 1),
('IH-05', 'empty', '5', 1);
