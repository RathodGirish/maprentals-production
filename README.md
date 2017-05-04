Installation steps

1. Install node (version : 6.9) and npm (version : 3.3).

    http://blog.teamtreehouse.com/install-node-js-npm-windows.

2. Install angular cli and universal cli

    npm install -g @angular/cli@latest

3. Go to your directory path.

    cd <your directory>

4. Clone repository (development-new branch).

    git clone https://github.com/serenetech/str-maprentals2.git -b development-new

5. Go to project directory.

    cd str-maprentals2

6. Install node_modules.

    npm install

7. Run Application.

    ng -serve -host 0.0.0.0

8. Build Application for Staging or Live server

    ng build --prod --aot    
