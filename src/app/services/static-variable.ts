export const GlobalVariable = Object.freeze({
    // BASE_API_URL: 'https://maprental.azurewebsites.net', // Live
    BASE_API_URL: 'https://maprentalsapiqa.azurewebsites.net',  // QA server
    GET_ALL_PROPERTY: '/api/Property/GetAllProperties',
    GET_ALL_PROPERTY_BY_LAT_LONG: '/api/Property/GetAllPropertiesByLatLong',
    GET_ALL_PROPERTY_BY_LAT_LONG2: '/api/Property/GetAllPropertiesByLatLong2',
    GET_ALL_PROPERTY_BY_GEO_LAT_LONG: '/api/Property/GetAllPropertiesByGeoLatLong',
    ADD_PROPERTY: '/api/Property/AddProperty',
    UPDATE_PROPERTY: '/api/Property/UpdateProperty',
    UPDATE_PROPERTY_VIEWS_COUNT: '/api/Property/UpdatePropertyViews',
    FREE_BUMPED_PROPERTY_BY_ID: '/api/Property/FreeBumpPropertyById',
    DEACTIVE_PROPERTY_BY_ID: '/api/Property/DeActivate',
    ACTIVE_PROPERTY_BY_ID: '/api/Property/Activate',
    DELETE_PROPERTY_BY_ID: '/api/Property/Delete',
    GET_PROPERTY_BY_ID: '/api/Property/GetPropertyById',
    GET_PROPERTY_BY_USERID: '/api/Property/GetAllPropertiesByUserId',
    UPDATE_PROFILE: '/api/User/UpdateProfile',
    UPDATE_PASSWORD: '/api/Account/ChangePassword',
    GET_PROFILE_BY_ID: '/api/User/GetProfileById',
    GET_PROFILE_BY_EMAILID: '/api/User/GetUserByEmail',

    SEND_EMAIL: '/api/User/SendEmail',

    UPLOAD_PICTURE: '/api/Picture/Upload',

    PIN_PURPLE: 'assets/public/img/pin-purple.png',

    PIN_PURPLE_20: 'assets/public/img/pin-purple-20.png',

    PIN_RED: 'assets/public/img/pin-red.png',

    PIN_RED_20: 'assets/public/img/pin-red-20.png',

    PIN_GREEN: 'assets/public/img/pin-green.png',

    PIN_GREEN_20: 'assets/public/img/pin-green-20.png'
});
   

