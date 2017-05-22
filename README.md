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

---------------------------------------------------------------------------------------------------------

TO upload app on azure server.

1. Change configuration file for stagin and live server:
    a. str-maprentals2/src/index.html      [Line : 82, 83]

         ga('create', 'UA-94002983-1', 'auto');  // staging
        //  ga('create', 'UA-93262825-1', 'auto');  // live


    b. /src/app/services   [Line : 2, 3]

        // BASE_API_URL: 'https://maprental.azurewebsites.net', // Live
        BASE_API_URL: 'https://maprentalsapiqa.azurewebsites.net',  // Staging server

2. Build Application for Staging or Live server

    ng build --prod --aot    


    [It will create dist folder in current directory. 
    Now, Copy & past dist content into dev-buil for staging and 
    release-build for production]

3. Commit and push code.    