
import { useState } from 'react'
import './App.css';
import {useGetEmployeesQuery} from "./api"; 

function App() {
  const { data: employees, isLoading, error } = useGetEmployeesQuery();
  // displayed all the employees from the database into the console browser.
  console.log(employees);

}

export default App;
