# Geoshare

Share location though a socket in real time for both clients. Made with node.js and leaflet 

<img src="https://github.com/jaimesk8/howFarAmI/blob/main/layout/Captura%20de%20Tela%202024-04-15%20a%CC%80s%2021.10.54.png" alt="alt text" width="100">


### To install 

<p>Make sure you've node.js on yout machine 

### 1. Git Clone my project into your terminal 
> gitclone https://github.com/jaimesk8/howFarAmI

### 2. Create a mySQL database in your machine with the following steps

To achive that you can run the following commands into your terminal 
> sudo apt install mysql-server

To confirm the instation you can run to check the version installed 
> mysql -version

Now you enter the database 
> sudo mysql

Then create our database 
> create database yourdatabasename;  

Last but not least, we create our table 
> create table data (id int (25) primary key, lat varchar (25), lon varchar(25), datetime datetime);

### 3. Install the following packages
> npm install express http socket.io cors path

### 4. Run the server.js file.
> nodemon server.js




