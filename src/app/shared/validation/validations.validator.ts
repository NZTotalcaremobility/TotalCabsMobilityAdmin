import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

// validation : Allow Alphanumeric char and space only
export class TextFieldValidator {
    static validTextField(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {
            const regex = /^[0-9a-zA-Z ]+$/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validTextField: true };
            }
        } else {
            return null;
        }
    }
}

// validation : Allow Numeric char only
export class NumericFieldValidator {
    static validNumericField(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {
            const regex = /[0-9]+/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validNumericField: true };
            }
        } else {
            return null;
        }
    }
}

// validation : Allow char and space only
export class OnlyCharFieldValidator {
    static validOnlyCharField(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {
            const regex = /^[a-zA-Z ]+$/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validOnlyCharField: true };
            }
        } else {
            return null;
        }
    }
}

// validation :VALID Email 
export class EmailValidator {
    static validEmail(fc: FormControl) {
        if (fc.value != undefined && fc.value != "") {
            const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
            if (regex.test(fc.value)) {
                return null;
            } else {
                return { validEmail: true };
            }
        } else {
            return null;
        }
    }
}

// export class DateOfBirth {
//     static dobValidator(fc: FormControl) {
//         let currentDate = new Date();
//         if (fc.value != undefined && fc.value != "" && fc.value != null) {
//             let dob = new Date(fc.value);
//             let dobYear = dob.getFullYear();
//             let maxDobYear = currentDate.getFullYear() - 16;
//             //console.log(dobYear, maxDobYear)
//             if (maxDobYear < dobYear) {
//                 return { dobValidator: true };
//             }
//             else {
//                 return null
//             }
//         }
//     }
// }
export class DateOfBirth {
    static dobValidator(fc: FormControl) {
        let currentDate = new Date();
        if (fc.value != undefined && fc.value != "" && fc.value != null) {
            let dob = new Date(fc.value);
            let dobYear = dob.getFullYear();
            let maxDobYear = currentDate.getFullYear() - 16;
            if (maxDobYear < dobYear) {
                return { dobValidator: true };
            }
            else {
                return null
            }
        }
    }
}
// validation : Not Allow WhiteSpace only
export class NoWhiteSpaceValidator {
    static noWhiteSpaceValidator(fc: FormControl) {
        if (fc.value != undefined && fc.value != "" && fc.value != null) {
            const isWhiteSpace = (fc.value.toString()).trim().length === 0;
            if (!isWhiteSpace) {
                return null;
            } else {
                return { noWhiteSpaceValidator: true };
            }
        } else {
            return null;
        }
    }
}

// Validator : To Check two fileds match
export function MustMatchValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];


        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    };
}
export function ageRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {

    if (control.value !== undefined && (isNaN(control.value) || control.value < 18 || control.value > 45)) {
        return { 'ageRange': true };
    }
    return null;
}

