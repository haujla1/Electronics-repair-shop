import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import Nav from "../navBar";
import axios from "axios";
import constants from "../../../../back-end/appConstants.js";
// For some reason, this import below causes the entire website to crash. Not sure why...
// import * as validation from "../../../../back-end/util/validationUtil.js"

function NewClient(){
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        address: '',
        age: null
    });

    const addClient = async (form) => {
        console.log(form);
        try {
            let { data } = await axios.post('http://localhost:3000/clients', form);
            return data;
        } catch (e) {
            console.log(e);
            return {error: e.response.data.error};
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let phoneNumber = document.getElementById('phoneNumber').value;
        let email = document.getElementById('email').value;
        let address = document.getElementById('address').value;
        let age = document.getElementById('age').value;

        // Do the form validation.
        let validForm = false;
        let errors = [];
        try {
            if (firstName.length > constants.stringLimits.first_last_names)
                throw `First Name cannot be longer than ${constants.stringLimits.first_last_names} characters`;
            firstName = firstName.trim();
            if (firstName.length === 0) throw 'First Name cannot be empty';
            document.getElementById('firstName').nextElementSibling.textContent = '';
        } catch (e) {
            errors.push(e);
            let errorSpan = document.getElementById('firstName').nextElementSibling;
            errorSpan.textContent = e;
        }

        try {
            if (lastName.length > constants.stringLimits.first_last_names)
                throw `Last Name cannot be longer than ${constants.stringLimits.first_last_names} characters`;
            lastName = lastName.trim();
            if (lastName.length === 0) throw 'Last Name cannot be empty';
            document.getElementById('lastName').nextElementSibling.textContent = '';
        } catch (e) {
            errors.push(e);
            let errorSpan = document.getElementById('lastName').nextElementSibling;
            errorSpan.textContent = e;
        }

        try {
            if (phoneNumber.includes('-')) phoneNumber = phoneNumber.split('-').join('');
            phoneNumber = phoneNumber.trim();
            if (phoneNumber.length !== 10)
              throw "Phone number must be 10 digits long";
            if (!/^\d+$/.test(phoneNumber))
              throw "Phone number must contain only digits";
            document.getElementById('phoneNumber').nextElementSibling.textContent = '';
        } catch (e) {
            errors.push(e);
            let errorSpan = document.getElementById('phoneNumber').nextElementSibling;
            errorSpan.textContent = e;
        }

        try {
            email = email.trim();
            if (email.length === 0) throw 'Email cannot be empty';
            document.getElementById('email').nextElementSibling.textContent = '';
        } catch (e) {
            errors.push(e);
            let errorSpan = document.getElementById('email').nextElementSibling;
            errorSpan.textContent = e;
        }

        try {
            if (address.length > constants.stringLimits.address)
                throw `Address cannot be longer than ${constants.stringLimits.address} characters`;
            address = address.trim();
            if (address.length === 0) throw 'Address cannot be empty';
            document.getElementById('address').nextElementSibling.textContent = '';
        } catch (e) {
            errors.push(e);
            let errorSpan = document.getElementById('address').nextElementSibling;
            errorSpan.textContent = e;
        }

        try {
            if (isNaN(age)) throw 'Age is not a number';
            age = Number.parseInt(age, 10);
            if (age < constants.min_age || age > constants.max_age)
                throw `Age must be between ${constants.min_age} and ${constants.max_age} years old`;
            document.getElementById('age').nextElementSibling.textContent = '';
        } catch (e) {
            errors.push(e);
            let errorSpan = document.getElementById('age').nextElementSibling;
            errorSpan.textContent = e;
        }

        validForm = errors.length === 0;

        if (validForm) {
            const form = {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                address: address,
                age: age
            };
            console.log(form);
            setFormData(form);

            let data = await addClient(form);
            console.log(data);
            if (data.error) {
                if (data.error.includes('First Name')) {
                    let errorSpan = document.getElementById('firstName').nextElementSibling;
                    errorSpan.textContent = e;
                }
                else if (data.error.includes('Last Name')) {
                    let errorSpan = document.getElementById('lastName').nextElementSibling;
                    errorSpan.textContent = e;
                }
                else if (data.error.includes('Phone number')) {
                    let errorSpan = document.getElementById('phoneNumber').nextElementSibling;
                    errorSpan.textContent = e;
                }
                else if (data.error.includes('Email')) {
                    let errorSpan = document.getElementById('email').nextElementSibling;
                    errorSpan.textContent = data.error;
                }
                else if (data.error.includes('Address')) {
                    let errorSpan = document.getElementById('address').nextElementSibling;
                    errorSpan.textContent = e;
                }
                else {
                    let errorSpan = document.getElementById('age').nextElementSibling;
                    errorSpan.textContent = e;
                }
                return;
            }

            document.getElementById('add-client').reset();
            for (let id of Object.keys(formData)) document.getElementById(id).nextElementSibling.textContent = '';
            alert('Client Added');
            setFormData({
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                address: '',
                age: null
            });
            return;
        } else {
            return;
        }
    }

    return (
        <>
            <Nav pagename="Add Client"/>
            <div>
                <form id="add-client" onSubmit={handleSubmit} noValidate>
                    <div>
                        <label>
                            First Name:
                            <br />
                            <input type="text" id="firstName" required autoFocus={true} />
                            <span className="error"></span>
                        </label>
                    </div>

                    <div>
                        <label>
                            Last Name:
                            <br />
                            <input type="text" id="lastName" required />
                            <span className="error"></span>
                        </label>
                    </div>

                    <div>
                        <label>
                            Phone Number:
                            <br />
                            <input type="text" id="phoneNumber" required />
                            <span className="error"></span>
                        </label>
                    </div>

                    <div>
                        <label>
                            Email:
                            <br />
                            <input type="text" id="email" required />
                            <span className="error"></span>
                        </label>
                    </div>

                    <div>
                        <label>
                            Address:
                            <br />
                            <input type="text" id="address" required />
                            <span className="error"></span>
                        </label>
                    </div>

                    <div>
                        <label>
                            Age:
                            <br />
                            <input type="number" id="age" required min={constants.min_age} max={constants.max_age} />
                            <span className="error"></span>
                        </label>
                    </div>
                    
                    <button type="submit">
                        Add Client
                    </button>
                </form>
            </div>
        </>
        
    )
}


export default NewClient