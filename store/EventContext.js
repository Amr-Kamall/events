import React, {createContext, useContext, useState} from 'react';
import axios from 'axios';

const EventContext = createContext();

const API_URL = 'https://677ecf3594bde1c1252d9f95.mockapi.io/api/v1/users';

function EventProvider({children}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  async function login(email, password) {
    try {
      // Fetch the entire user list
      const response = await axios.get(API_URL);
      const users = response.data;

      // Find a matching user with the provided email and password
      const foundUser = users.find(
        userObj => userObj.email === email && userObj.password === password,
      );

      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
      } else {
        throw new Error('There is An Error on email or password');
      }
    } catch (error) {
      throw error;
    }
  }

  async function register(email, password) {
    try {
      // check if the user exist in users list of API
      const response = await axios.get(API_URL);
      const users = response.data;
      const isRegisteredBefore = users.find(
        userObj => userObj.email === email && userObj.password === password,
      );
      // Add a new user to the API
      if (!isRegisteredBefore) {
        await axios.post(API_URL, {email, password});
        setIsAuthenticated(true);
      } else {
        throw new Error('user registered before');
      }
    } catch (error) {
      throw error;
    }
  }

  return (
    <EventContext.Provider value={{isAuthenticated, user, login, register}}>
      {children}
    </EventContext.Provider>
  );
}

function useEventContext() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('Event context was used outside the EventProvider');
  }
  return context;
}

export {EventProvider, useEventContext};