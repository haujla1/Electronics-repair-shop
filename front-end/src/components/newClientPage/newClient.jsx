import React, {useContext, useEffect, useState} from "react";
import {Link} from 'react-router-dom';
import Nav from "../navBar";
import axios from "axios";
import constants from "../../../../back-end/appConstants.js"; 
// For some reason, this import below causes the entire website to crash. Not sure why...
// import * as validation from "../../../../back-end/util/validationUtil.js"

//note from kyle -- the import was wrong: forgot to go into back-end

function NewClient(){
    const [error, setError] = useState('');

    const addClient = async (form) => {
        // console.log(form);
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
        const {
            firstName: firstNameElem,
            lastName: lastNameElem,
            phoneNumber: phoneNumberElem,
            email: emailElem,
            address: addressElem,
            age: ageElem
        } = e.target.elements;

        // Protect against changes through inspect element.
        if (
            firstNameElem.getAttribute('type') !== 'text' ||
            lastNameElem.getAttribute('type') !== 'text' ||
            phoneNumberElem.getAttribute('type') !== 'text' ||
            emailElem.getAttribute('type') !== 'email' ||
            addressElem.getAttribute('type') !== 'text' ||
            ageElem.getAttribute('type') !== 'number'
        ) {
            setError('Invalid Input Type');
            let errorSpans = document.getElementsByClassName('error');
            errorSpans.forEach(errorSpan => {
                console.log(errorSpan);
                errorSpan.textContent = '';
            });
            return;
        }

        let firstName = firstNameElem.value;
        let lastName = lastNameElem.value;
        let phoneNumber = phoneNumberElem.value;
        let email = emailElem.value;
        let address = addressElem.value;
        let age = ageElem.value;

        // Do the form validation.
        let validForm = false;
        let errors = [];
        try {
            if (firstName.length === 0) throw 'First Name must be provided';
            if (firstName.length > constants.stringLimits.first_last_names)
                throw `First Name cannot be longer than ${constants.stringLimits.first_last_names} characters`;
            firstName = firstName.trim();
            if (firstName.length === 0) throw 'First Name cannot be empty';
        } catch (e) {
            errors.push(e);
        }

        try {
            if (lastName.length === 0) throw 'Last Name must be provided';
            if (lastName.length > constants.stringLimits.first_last_names)
                throw `Last Name cannot be longer than ${constants.stringLimits.first_last_names} characters`;
            lastName = lastName.trim();
            if (lastName.length === 0) throw 'Last Name cannot be empty';
        } catch (e) {
            errors.push(e);
        }

        try {
            if (phoneNumber.length === 0) throw 'Phone Number must be provided';
            phoneNumber = phoneNumber.trim();
            if (phoneNumber.length !== 10)
              throw "Phone number must be 10 digits long";
            if (!/^\d+$/.test(phoneNumber))
              throw "Phone number must contain only digits";
        } catch (e) {
            errors.push(e);
        }

        try {
            if (email.length === 0) throw 'Email must be provided';
            email = email.trim();
            if (email.length === 0) throw 'Email cannot be empty';
        } catch (e) {
            errors.push(e);
        }

        try {
            if (address.length === 0) throw 'Address must be provided';
            if (address.length > constants.stringLimits.address)
                throw `Address cannot be longer than ${constants.stringLimits.address} characters`;
            address = address.trim();
            if (address.length === 0) throw 'Address cannot be empty';
        } catch (e) {
            errors.push(e);
        }

        try {
            if (age.length === 0) throw 'Age must be provided';
            if (isNaN(age)) throw 'Age is not a number';
            age = Number.parseInt(age, 10);
            if (age < constants.min_age || age > constants.max_age)
                throw `Age must be between ${constants.min_age} and ${constants.max_age} years old`;
        } catch (e) {
            errors.push(e);
        }

        // console.log(errors);
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
            // console.log(form);

            let data = await addClient(form);
            console.log(data);
            if (data.error) {
                setError(data.error);
                return;
            }

            document.getElementById('add-client').reset();
            setError('');
            alert('Client Added');
            return;
        } else {
            if (typeof errors[0] === 'undefined') setError('Unknown Error')
            else setError(errors[0]);
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
                        </label>
                    </div>

                    <div>
                        <label>
                            Last Name:
                            <br />
                            <input type="text" id="lastName" required />
                        </label>
                    </div>

                    <div>
                        <label>
                            Phone Number:
                            <br />
                            <input type="text" id="phoneNumber" required />
                        </label>
                    </div>

                    <div>
                        <label>
                            Email:
                            <br />
                            <input type="email" id="email" required />
                        </label>
                    </div>

                    <div>
                        <label>
                            Address:
                            <br />
                            <input type="text" id="address" required />
                        </label>
                    </div>

                    <div>
                        <label>
                            Age:
                            <br />
                            <input type="number" id="age" required min={constants.min_age} max={constants.max_age} />
                        </label>
                    </div>
                    
                    <button type="submit">
                        Add Client
                    </button>
                    <br />
                    <p>{error}</p>
                </form>
            </div>
        </>
        
    )
}


export default NewClient